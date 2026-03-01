import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/authStore'

// ── Helpers de rango de fechas ─────────────────────────────────
const startOf = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// from / to en ISO para cada período.
// "to" null significa hasta ahora (sin límite superior).
const PERIODS = {
  today:     { from: () => startOf(0),  to: null },
  yesterday: { from: () => startOf(-1), to: () => startOf(0) },
  week:      { from: () => startOf(-6), to: null },
}

// ── Campos que se leen de la tabla transactions ────────────────
// Ajusta estos nombres si tu tabla usa columnas diferentes.
const TX_COLUMNS = 'id, total, created_at, company_id, table_id, category, payment_method'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    transactions: [],     // período actual
    prevTransactions: [], // período anterior (para comparativa)
    loading: false,
    period: 'today',
    realtimeChannel: null,
  }),

  getters: {
    // ── Revenue ───────────────────────────────────────────────
    totalRevenue: (state) =>
      state.transactions.reduce((sum, t) => sum + (Number(t.total) || 0), 0),

    prevRevenue: (state) =>
      state.prevTransactions.reduce((sum, t) => sum + (Number(t.total) || 0), 0),

    // Pinia: para acceder a otros getters se usa `this` (función regular, no arrow)
    revenueChangePct() {
      if (!this.prevRevenue) return null
      return ((this.totalRevenue - this.prevRevenue) / this.prevRevenue) * 100
    },

    // ── Tickets ───────────────────────────────────────────────
    transactionCount: (state) => state.transactions.length,

    avgTicket() {
      if (!this.transactions.length) return 0
      return this.totalRevenue / this.transactions.length
    },

    // ── Por hora (para gráfica) ───────────────────────────────
    salesByHour: (state) => {
      const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, total: 0, count: 0 }))
      for (const t of state.transactions) {
        const h = new Date(t.created_at).getHours()
        hours[h].total += Number(t.total) || 0
        hours[h].count++
      }
      return hours
    },

    maxHourlyRevenue() {
      return Math.max(...this.salesByHour.map((h) => h.total), 1)
    },

    // 14 slots visibles: 10am → 11pm
    chartHours() {
      const SLOTS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      return SLOTS.map((h) => {
        const data = this.salesByHour[h]
        return {
          label: h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`,
          total: data.total,
          count: data.count,
          pct: Math.round((data.total / this.maxHourlyRevenue) * 100),
        }
      })
    },

    // ── Mesas (si transactions tiene table_id) ─────────────────
    activeMesaIds: (state) =>
      [...new Set(state.transactions.map((t) => t.table_id).filter(Boolean))],

    topMesas() {
      if (!this.activeMesaIds.length) return []
      const map = {}
      for (const t of this.transactions) {
        if (!t.table_id) continue
        if (!map[t.table_id]) map[t.table_id] = { table_id: t.table_id, total: 0, count: 0 }
        map[t.table_id].total += Number(t.total) || 0
        map[t.table_id].count++
      }
      return Object.values(map)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
    },

    // ── Categorías (si transactions tiene category) ───────────
    salesByCategory() {
      if (!this.transactions.some((t) => t.category)) return []
      const map = {}
      for (const t of this.transactions) {
        const cat = t.category || 'Otros'
        if (!map[cat]) map[cat] = 0
        map[cat] += Number(t.total) || 0
      }
      return Object.entries(map)
        .map(([name, total]) => ({
          name,
          total,
          pct: Math.round((total / this.totalRevenue) * 100),
        }))
        .sort((a, b) => b.total - a.total)
    },
  },

  actions: {
    // ── Carga principal ───────────────────────────────────────
    async fetchTransactions(period = 'today') {
      this.loading = true
      this.period = period

      const authStore = useAuthStore()
      const companyId = authStore.userProfile?.company_id

      try {
        const range = PERIODS[period] ?? PERIODS.today

        let query = supabase
          .from('transactions')
          .select(TX_COLUMNS)
          .gte('created_at', range.from())
          .order('created_at', { ascending: true })

        if (range.to) query = query.lt('created_at', range.to())
        if (companyId) query = query.eq('company_id', companyId)

        const { data, error } = await query
        if (error) throw error
        this.transactions = data ?? []

        // Carga el período previo para comparativas (solo para "today")
        if (period === 'today') {
          await this._fetchPrev('yesterday', companyId)
        } else {
          this.prevTransactions = []
        }
      } catch (err) {
        console.error('dashboardStore.fetchTransactions:', err)
        this.transactions = []
      } finally {
        this.loading = false
      }
    },

    async _fetchPrev(period, companyId) {
      try {
        const range = PERIODS[period]
        let query = supabase
          .from('transactions')
          .select('id, total, created_at')
          .gte('created_at', range.from())

        if (range.to) query = query.lt('created_at', range.to())
        if (companyId) query = query.eq('company_id', companyId)

        const { data } = await query
        this.prevTransactions = data ?? []
      } catch {
        this.prevTransactions = []
      }
    },

    // ── Suscripción realtime ──────────────────────────────────
    subscribeRealtime() {
      if (this.realtimeChannel) return

      const authStore = useAuthStore()
      const companyId = authStore.userProfile?.company_id

      this.realtimeChannel = supabase
        .channel('dashboard-transactions')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            ...(companyId ? { filter: `company_id=eq.${companyId}` } : {}),
          },
          (payload) => {
            const created = new Date(payload.new.created_at)
            const range = PERIODS[this.period] ?? PERIODS.today
            const from = new Date(range.from())
            const to = range.to ? new Date(range.to()) : null
            if (created >= from && (!to || created < to)) {
              this.transactions.push(payload.new)
            }
          },
        )
        .subscribe()
    },

    unsubscribeRealtime() {
      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel)
        this.realtimeChannel = null
      }
    },
  },
})
