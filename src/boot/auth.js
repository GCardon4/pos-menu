import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/authStore'

const ROLE_ROUTES = {
  1: '/admin',
  2: '/dashboard',
  3: '/mesas',
  4: '/store',
}

export default boot(async ({ router }) => {
  // Pinia está activo aquí — el boot file corre después de app.use(pinia)
  const authStore = useAuthStore()

  await authStore.initializeAuth()

  router.beforeEach((to) => {
    const isAuthenticated = authStore.isAuthenticated

    // Ruta protegida sin sesión → redirigir a login
    if (to.meta.requiresAuth && !isAuthenticated) {
      return { path: '/login' }
    }

    // Ya autenticado intentando entrar a /login → redirigir a su ruta de rol
    if (to.path === '/login' && isAuthenticated) {
      return { path: ROLE_ROUTES[authStore.userRole] ?? '/' }
    }

    // Ruta con restricción de rol → redirigir a la ruta correcta del usuario
    if (to.meta.role !== undefined && authStore.userRole !== to.meta.role) {
      return { path: ROLE_ROUTES[authStore.userRole] ?? '/login' }
    }
  })
})
