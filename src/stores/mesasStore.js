import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'
import { Notify } from 'quasar'

export const useMesasStore = defineStore('mesas', {
  state: () => ({
    tables: [],
    loading: false,
  }),

  getters: {
    byStatus: (state) => (status) => state.tables.filter((t) => t.status === status),

    totalByStatus: (state) => {
      const result = { available: 0, occupied: 0, cleaning: 0, reserved: 0 }
      for (const t of state.tables) {
        if (result[t.status] !== undefined) result[t.status]++
        else result[t.status] = 1
      }
      return result
    },
  },

  actions: {
    async fetchTables(companyId) {
      this.loading = true
      try {
        let query = supabase
          .from('tables')
          .select('*, companies(id, name)')
          .order('number', { ascending: true })
        if (companyId) query = query.eq('company_id', companyId)
        const { data, error } = await query
        if (error) throw error
        this.tables = data ?? []
      } catch (err) {
        console.error('mesasStore.fetchTables:', err)
        this.tables = []
      } finally {
        this.loading = false
      }
    },

    async createTable(payload) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('tables')
          .insert({ ...payload, status: payload.status ?? 'available' })
          .select('*, companies(id, name)')
          .single()
        if (error) throw error
        this.tables.push(data)
        this.tables.sort((a, b) => a.number - b.number)
        Notify.create({ type: 'positive', message: 'Mesa creada', position: 'top' })
        return { success: true, data }
      } catch (err) {
        console.error('mesasStore.createTable:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al crear mesa',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async updateTable(id, payload) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('tables')
          .update(payload)
          .eq('id', id)
          .select('*, companies(id, name)')
          .single()
        if (error) throw error
        const idx = this.tables.findIndex((t) => t.id === id)
        if (idx !== -1) this.tables[idx] = data
        Notify.create({ type: 'positive', message: 'Mesa actualizada', position: 'top' })
        return { success: true, data }
      } catch (err) {
        console.error('mesasStore.updateTable:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al actualizar mesa',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async deleteTable(id) {
      this.loading = true
      try {
        const { error } = await supabase.from('tables').delete().eq('id', id)
        if (error) throw error
        this.tables = this.tables.filter((t) => t.id !== id)
        Notify.create({ type: 'positive', message: 'Mesa eliminada', position: 'top' })
        return { success: true }
      } catch (err) {
        console.error('mesasStore.deleteTable:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al eliminar mesa',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async updateTableStatus(id, status) {
      try {
        const { data, error } = await supabase
          .from('tables')
          .update({ status })
          .eq('id', id)
          .select('*, companies(id, name)')
          .single()
        if (error) throw error
        const idx = this.tables.findIndex((t) => t.id === id)
        if (idx !== -1) this.tables[idx] = data
        return { success: true, data }
      } catch (err) {
        console.error('mesasStore.updateTableStatus:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al cambiar estado',
          position: 'top',
        })
        return { success: false, error: err }
      }
    },
  },
})
