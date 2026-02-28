import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'
import { Notify } from 'quasar'

// Guardamos la suscripción fuera del store para registrarla UNA sola vez
// y evitar listeners duplicados al navegar o recalgar módulos.
let _authSubscription = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    session: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    userProfile: (state) => state.profile,
    userRole: (state) => state.profile?.roles_id ?? null,
  },

  actions: {
    // Inicializa la sesión y registra el listener UNA sola vez.
    // Acepta un callback onSignOut para que boot/auth.js pueda redirigir
    // ante cualquier tipo de cierre de sesión (manual, expiración, otro tab).
    async initializeAuth(onSignOut = null) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          this.session = session
          this.user = session.user
          await this.loadUserProfile()
        }

        // Registrar listener solo si no existe ya
        if (!_authSubscription) {
          const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            this.session = session
            this.user = session?.user ?? null

            if (event === 'SIGNED_OUT' || !session) {
              this.profile = null
              // Notificar al boot/auth para redirigir
              if (typeof onSignOut === 'function') onSignOut()
              return
            }

            if (session.user) {
              await this.loadUserProfile()
            }
          })
          _authSubscription = data.subscription
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error)
      }
    },

    async loadUserProfile() {
      if (!this.user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single()

        if (error) throw error
        this.profile = data
      } catch (error) {
        console.error('Error cargando perfil:', error)
      }
    },

    async login(email, password) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        this.user = data.user
        this.session = data.session
        await this.loadUserProfile()

        Notify.create({ type: 'positive', message: 'Inicio de sesión exitoso', position: 'top' })
        return { success: true, data }
      } catch (error) {
        console.error('Error en login:', error)
        Notify.create({
          type: 'negative',
          message: error.message || 'Error al iniciar sesión',
          position: 'top',
        })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        // scope: 'global' revoca el token en el servidor (todos los dispositivos)
        const { error } = await supabase.auth.signOut({ scope: 'global' })
        if (error) throw error

        // El listener onAuthStateChange dispara SIGNED_OUT y limpia el state
        // pero también lo limpiamos aquí por si acaso
        this.user = null
        this.profile = null
        this.session = null

        return { success: true }
      } catch (error) {
        console.error('Error en logout:', error)
        Notify.create({
          type: 'negative',
          message: error.message || 'Error al cerrar sesión',
          position: 'top',
        })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },
  },
})
