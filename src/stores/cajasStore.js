import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'
import { Notify } from 'quasar'

export const useCajasStore = defineStore('cajas', {
  state: () => ({
    registers: [],
    loading: false,
  }),

  getters: {
    totalRegisters: (state) => state.registers.length,
    getByUser: (state) => (userId) => state.registers.filter((r) => r.user_id === userId),
  },

  actions: {
    async fetchRegisters(companyId) {
      this.loading = true
      try {
        let query = supabase
          .from('cash_registers')
          .select('*, profiles(id, full_name, email)')
          .order('name', { ascending: true })
        if (companyId) query = query.eq('company_id', companyId)
        const { data, error } = await query
        if (error) throw error
        this.registers = data ?? []
      } catch (err) {
        console.error('cajasStore.fetchRegisters:', err)
        this.registers = []
      } finally {
        this.loading = false
      }
    },

    async createRegister(payload) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('cash_registers')
          .insert(payload)
          .select('*, profiles(id, full_name, email)')
          .single()
        if (error) throw error
        this.registers.push(data)
        this.registers.sort((a, b) => a.name.localeCompare(b.name))
        Notify.create({ type: 'positive', message: 'Caja creada', position: 'top' })
        return { success: true, data }
      } catch (err) {
        console.error('cajasStore.createRegister:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al crear caja',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async updateRegister(id, payload) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('cash_registers')
          .update(payload)
          .eq('id', id)
          .select('*, profiles(id, full_name, email)')
          .single()
        if (error) throw error
        const idx = this.registers.findIndex((r) => r.id === id)
        if (idx !== -1) this.registers[idx] = data
        Notify.create({ type: 'positive', message: 'Caja actualizada', position: 'top' })
        return { success: true, data }
      } catch (err) {
        console.error('cajasStore.updateRegister:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al actualizar caja',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async deleteRegister(id) {
      this.loading = true
      try {
        const { error } = await supabase.from('cash_registers').delete().eq('id', id)
        if (error) throw error
        this.registers = this.registers.filter((r) => r.id !== id)
        Notify.create({ type: 'positive', message: 'Caja eliminada', position: 'top' })
        return { success: true }
      } catch (err) {
        console.error('cajasStore.deleteRegister:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al eliminar caja',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },
  },
})
