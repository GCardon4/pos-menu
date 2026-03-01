import { defineStore } from 'pinia'
import { supabase, supabaseAdmin } from 'boot/supabase'
import { Notify } from 'quasar'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [],
    profiles: [],
    loading: false,
    loadingProfile: false,
  }),

  getters: {
    totalCompanies: (state) => state.companies.length,
    totalProfiles: (state) => state.profiles.length,
    activeCompanies: (state) => state.companies.filter((c) => c.is_active),
    getCompanyById: (state) => (id) => state.companies.find((c) => c.id === id),
    getProfilesByCompany: (state) => (companyId) =>
      state.profiles.filter((p) => p.company_id === companyId),
  },

  actions: {
    // ─────────────────────────────────────────
    // COMPANIES
    // ─────────────────────────────────────────

    async fetchCompanies() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.companies = data
        return { success: true, data }
      } catch (error) {
        console.error('fetchCompanies:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async createCompany(payload) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('companies')
          .insert([payload])
          .select()
          .single()

        if (error) throw error
        this.companies.unshift(data)
        Notify.create({ type: 'positive', message: 'Empresa creada correctamente', position: 'top' })
        return { success: true, data }
      } catch (error) {
        console.error('createCompany:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async updateCompany(id, payload) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('companies')
          .update(payload)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        const idx = this.companies.findIndex((c) => c.id === id)
        if (idx !== -1) this.companies[idx] = data
        Notify.create({ type: 'positive', message: 'Empresa actualizada', position: 'top' })
        return { success: true, data }
      } catch (error) {
        console.error('updateCompany:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async deleteCompany(id) {
      this.loading = true
      try {
        const { error } = await supabase.from('companies').delete().eq('id', id)

        if (error) throw error
        this.companies = this.companies.filter((c) => c.id !== id)
        Notify.create({ type: 'positive', message: 'Empresa eliminada', position: 'top' })
        return { success: true }
      } catch (error) {
        console.error('deleteCompany:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // ─────────────────────────────────────────
    // PROFILES
    // ─────────────────────────────────────────

    async fetchProfiles(companyId = null) {
      this.loadingProfile = true
      try {
        let query = supabase
          .from('profiles')
          .select('*, companies(id, name)')
          .order('created_at', { ascending: false })

        if (companyId) query = query.eq('company_id', companyId)

        const { data, error } = await query
        if (error) throw error
        this.profiles = data
        return { success: true, data }
      } catch (error) {
        console.error('fetchProfiles:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loadingProfile = false
      }
    },

    async fetchProfileById(id) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, companies(id, name)')
          .eq('id', id)
          .single()

        if (error) throw error
        return { success: true, data }
      } catch (error) {
        console.error('fetchProfileById:', error)
        return { success: false, error }
      }
    },

    async updateProfile(id, payload) {
      this.loadingProfile = true
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', id)
          .select('*, companies(id, name)')
          .single()

        if (error) throw error
        const idx = this.profiles.findIndex((p) => p.id === id)
        if (idx !== -1) this.profiles[idx] = data
        Notify.create({ type: 'positive', message: 'Perfil actualizado', position: 'top' })
        return { success: true, data }
      } catch (error) {
        console.error('updateProfile:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loadingProfile = false
      }
    },

    async deleteProfile(id) {
      this.loadingProfile = true
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id)

        if (error) throw error
        this.profiles = this.profiles.filter((p) => p.id !== id)
        Notify.create({ type: 'positive', message: 'Perfil eliminado', position: 'top' })
        return { success: true }
      } catch (error) {
        console.error('deleteProfile:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loadingProfile = false
      }
    },

    // ─────────────────────────────────────────
    // CREAR USUARIO (auth + profile)
    // Supabase crea el profile via trigger en auth.users
    // ─────────────────────────────────────────

    async createUser(email, password, profilePayload = {}) {
      this.loadingProfile = true
      try {
        // Usamos supabaseAdmin (persistSession: false) para que el signUp
        // NO reemplace la sesión activa del usuario actual.
        const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
          email,
          password,
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('No se pudo crear el usuario en Auth.')

        // Upsert del perfil: crea la fila si no existe (trigger ausente o lento)
        // o la actualiza si el trigger ya la creó.
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email,
            ...profilePayload,
          })

        if (profileError) throw profileError

        Notify.create({
          type: 'positive',
          message: `Usuario ${email} creado correctamente.`,
          position: 'top',
        })
        return { success: true, data: authData }
      } catch (error) {
        console.error('createUser:', error)
        Notify.create({ type: 'negative', message: error.message, position: 'top' })
        return { success: false, error }
      } finally {
        this.loadingProfile = false
      }
    },
  },
})
