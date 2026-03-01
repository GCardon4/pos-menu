<template>
  <q-page class="flex-1 overflow-y-auto scrollbar-hide">
    <!-- Top Navbar -->
    <div
      class="sticky top-0 z-10 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-primary/10 bg-background-light/90"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Manager Dashboard</h1>
        <p class="text-sm text-slate-500">Live operational overview</p>
      </div>
      <div class="flex items-center gap-4">
        <!-- Period selector -->
        <div class="flex bg-primary/5 p-1 rounded-xl border border-primary/10">
          <button
            v-for="p in PERIODS"
            :key="p.key"
            @click="setPeriod(p.key)"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              dashStore.period === p.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-primary',
            ]"
          >
            {{ p.label }}
          </button>
        </div>
        <button
          @click="dashStore.fetchTransactions(dashStore.period)"
          :class="[
            'flex items-center justify-center p-2.5 rounded-xl border transition-colors',
            'bg-primary/5 border-primary/10 text-primary hover:bg-primary/10',
            dashStore.loading ? 'animate-spin' : '',
          ]"
          title="Refrescar"
        >
          <span class="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>
    </div>

    <div class="p-8 space-y-8 max-w-[1600px] mx-auto">
      <!-- ── Metrics Grid ──────────────────────────────────────── -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Daily Revenue -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10 neon-glow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <span
              v-if="dashStore.revenueChangePct !== null"
              :class="[
                'text-xs font-bold flex items-center gap-0.5',
                dashStore.revenueChangePct >= 0 ? 'text-primary' : 'text-rose-500',
              ]"
            >
              {{ dashStore.revenueChangePct >= 0 ? '+' : '' }}{{ dashStore.revenueChangePct.toFixed(1) }}%
              <span class="material-symbols-outlined text-[14px]">
                {{ dashStore.revenueChangePct >= 0 ? 'trending_up' : 'trending_down' }}
              </span>
            </span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Revenue del día</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else>{{ formatCurrency(dashStore.totalRevenue) }}</span>
          </h3>
        </div>

        <!-- Active Mesas -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">table_restaurant</span>
            </div>
            <span class="text-xs font-bold text-slate-500">Mesas con ventas</span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Mesas activas</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else-if="dashStore.activeMesaIds.length">
              {{ dashStore.activeMesaIds.length }}
            </span>
            <span v-else class="text-lg text-slate-400">Sin datos</span>
          </h3>
          <div v-if="dashStore.activeMesaIds.length" class="w-full bg-primary/10 h-1.5 rounded-full mt-4">
            <div class="bg-primary h-full rounded-full" :style="`width: 100%`"></div>
          </div>
        </div>

        <!-- Avg Ticket -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">receipt</span>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-medium">Ticket promedio</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else>{{ formatCurrency(dashStore.avgTicket) }}</span>
          </h3>
        </div>

        <!-- Transactions -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">point_of_sale</span>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-medium">Transacciones</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else>{{ dashStore.transactionCount }}</span>
          </h3>
        </div>
      </div>

      <!-- ── Chart + Category ──────────────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Hourly Sales Chart -->
        <div class="xl:col-span-2 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-bold">Ventas por hora</h3>
              <p class="text-sm text-slate-500">Distribución del revenue por hora</p>
            </div>
            <div class="flex gap-2">
              <span class="flex items-center gap-2 text-xs font-medium">
                <span class="size-2 rounded-full bg-primary"></span> Período
              </span>
            </div>
          </div>

          <!-- Barras dinámicas -->
          <div class="flex-1 flex items-end gap-1.5 h-64 min-h-[250px] px-2">
            <div
              v-for="slot in dashStore.chartHours"
              :key="slot.label"
              class="flex-1 bg-primary/10 rounded-t-lg relative group"
              :style="`height: ${Math.max(slot.pct, 4)}%`"
            >
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg opacity-80 group-hover:opacity-100 transition-all"
                :style="`height: ${slot.pct || 0}%`"
              ></div>
              <!-- Tooltip -->
              <div
                class="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none"
              >
                <div class="bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  {{ formatCurrency(slot.total) }}
                </div>
                <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>

          <div class="flex justify-between mt-4 text-[10px] uppercase tracking-widest font-bold px-2 text-slate-400">
            <span v-for="slot in dashStore.chartHours.filter((_, i) => i % 2 === 0)" :key="slot.label">
              {{ slot.label }}
            </span>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h3 class="text-lg font-bold mb-1">Categorías</h3>
          <p class="text-sm text-slate-500 mb-8">Ventas por categoría</p>

          <!-- Con datos reales de category -->
          <div v-if="dashStore.salesByCategory.length" class="space-y-4 mt-4">
            <div
              v-for="cat in dashStore.salesByCategory"
              :key="cat.name"
              class="space-y-1.5"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium">{{ cat.name }}</span>
                <span class="font-bold">{{ cat.pct }}%</span>
              </div>
              <div class="w-full bg-primary/10 h-2 rounded-full">
                <div
                  class="bg-primary h-full rounded-full transition-all"
                  :style="`width: ${cat.pct}%`"
                ></div>
              </div>
              <div class="text-xs text-slate-500">{{ formatCurrency(cat.total) }}</div>
            </div>
          </div>

          <!-- Sin datos de categoría: mostrar totales generales -->
          <div v-else class="space-y-6">
            <div class="relative size-40 mx-auto">
              <svg class="size-full -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-primary/10"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" stroke-dasharray="100, 100" stroke-width="4"
                />
                <path
                  class="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor"
                  :stroke-dasharray="`${dashStore.transactionCount ? 100 : 0}, 100`"
                  stroke-linecap="round" stroke-width="4"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span class="text-xl font-bold">{{ formatCurrencyShort(dashStore.totalRevenue) }}</span>
                <span class="text-[10px] uppercase tracking-tighter text-slate-500">Total ventas</span>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="size-3 rounded-full bg-primary"></span>
                  <span class="font-medium">Transacciones</span>
                </div>
                <span class="font-bold">{{ dashStore.transactionCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="size-3 rounded-full bg-primary/40"></span>
                  <span class="font-medium">Ticket promedio</span>
                </div>
                <span class="font-bold">{{ formatCurrency(dashStore.avgTicket) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Top Mesas + Floor Status ─────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Performing Tables -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold">Top Mesas</h3>
          </div>

          <!-- Con datos reales de mesa_id -->
          <div v-if="dashStore.topMesas.length" class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] uppercase tracking-widest border-b border-primary/10 text-slate-400">
                  <th class="pb-3 font-bold">Mesa</th>
                  <th class="pb-3 font-bold">Transacciones</th>
                  <th class="pb-3 font-bold text-right">Total ventas</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5">
                <tr
                  v-for="mesa in dashStore.topMesas"
                  :key="mesa.mesa_id"
                  class="group hover:bg-primary/5 transition-colors"
                >
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs"
                      >
                        {{ mesa.mesa_id }}
                      </div>
                    </div>
                  </td>
                  <td class="py-4 text-sm text-slate-500">{{ mesa.count }} pedidos</td>
                  <td class="py-4 font-bold text-primary text-right">{{ formatCurrency(mesa.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Sin mesa_id en transactions -->
          <div v-else-if="!dashStore.loading" class="text-center py-10 text-slate-400">
            <span class="material-symbols-outlined text-4xl mb-2 block">table_restaurant</span>
            <p class="text-sm">
              {{ dashStore.transactionCount > 0
                ? 'Las transacciones no tienen mesa_id asignado'
                : 'Sin transacciones en este período'
              }}
            </p>
          </div>

          <div v-else class="text-center py-10 text-slate-300 text-sm">Cargando…</div>
        </div>

        <!-- Service Hotspots / Floor Status (visual) -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold">Estado del piso</h3>
            <div class="flex gap-2">
              <span class="px-2 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                {{ dashStore.activeMesaIds.length }} activas
              </span>
            </div>
          </div>
          <!-- Mapa visual -->
          <div class="grid grid-cols-5 gap-3 h-64 border border-primary/5 rounded-xl p-4 bg-slate-50">
            <div
              v-for="n in 12"
              :key="n"
              :class="[
                'rounded-lg flex items-center justify-center text-[10px] font-bold transition-all',
                dashStore.activeMesaIds.includes(String(n)) || dashStore.activeMesaIds.includes(n)
                  ? 'bg-primary text-white border border-primary shadow-[0_0_8px_rgba(17,212,196,0.4)]'
                  : 'bg-primary/10 border border-primary/20 text-slate-400',
                n === 7 ? 'col-span-2' : '',
              ]"
            >
              {{ n === 7 ? 'BAR' : String(n).padStart(2, '0') }}
            </div>
          </div>
          <div class="mt-4 flex gap-6">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-primary shadow-[0_0_5px_rgba(17,212,196,0.8)]"></span>
              <span class="text-xs text-slate-500">Con ventas hoy</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-primary/10 border border-primary/20"></span>
              <span class="text-xs text-slate-500">Sin actividad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from 'stores/dashboardStore'

defineOptions({ name: 'ManagerDashboard' })

const dashStore = useDashboardStore()

const PERIODS = [
  { key: 'today',     label: 'Hoy' },
  { key: 'yesterday', label: 'Ayer' },
  { key: 'week',      label: 'Últimos 7 días' },
]

function setPeriod(period) {
  dashStore.fetchTransactions(period)
}

// ── Formatters ────────────────────────────────────────────────
function formatCurrency(value) {
  if (!value && value !== 0) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCurrencyShort(value) {
  if (!value) return '$0'
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`
  return `$${value.toFixed(0)}`
}

onMounted(async () => {
  await dashStore.fetchTransactions('today')
  dashStore.subscribeRealtime()
})

onUnmounted(() => {
  dashStore.unsubscribeRealtime()
})
</script>

<style scoped>
.neon-glow {
  box-shadow: 0 0 15px rgba(17, 212, 196, 0.12);
}
</style>
