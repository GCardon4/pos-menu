import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/authStore'

const ROLE_ROUTES = {
  1: '/admin',
  2: '/dashboard',
  3: '/store',
  4: '/bodega',
}

export default boot(async ({ router }) => {
  const authStore = useAuthStore()

  // Callback que se ejecuta ante cualquier SIGNED_OUT
  // (logout manual, expiración de token, cierre desde otro tab)
  const handleSignOut = () => {
    // Evitar redirect infinito si ya estamos en /login
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  }

  await authStore.initializeAuth(handleSignOut)

  router.beforeEach((to) => {
    const isAuthenticated = authStore.isAuthenticated

    if (to.meta.requiresAuth && !isAuthenticated) {
      return { path: '/login' }
    }

    if (to.path === '/login' && isAuthenticated) {
      return { path: ROLE_ROUTES[authStore.userRole] ?? '/' }
    }

    if (to.meta.role !== undefined) {
      const allowed = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
      if (!allowed.includes(authStore.userRole)) {
        return { path: ROLE_ROUTES[authStore.userRole] ?? '/login' }
      }
    }
  })
})
