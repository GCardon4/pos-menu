import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

const ROLE_ROUTES = {
  1: '/admin',
  2: '/dashboard',
  3: '/mesas',
  4: '/store',
}

export default defineRouter(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to) => {
    // Importación lazy para evitar ciclo de dependencias
    const { useAuthStore } = await import('stores/authStore')
    const authStore = useAuthStore(store)

    // Inicializar sesión si aún no se ha hecho
    if (authStore.user === null && authStore.session === null) {
      await authStore.initializeAuth()
    }

    const isAuthenticated = authStore.isAuthenticated

    // Ruta protegida sin sesión → redirigir a login
    if (to.meta.requiresAuth && !isAuthenticated) {
      return { path: '/login' }
    }

    // Ya autenticado intentando entrar a /login → redirigir a su ruta de rol
    if (to.path === '/login' && isAuthenticated) {
      const roleId = authStore.userRole
      return { path: ROLE_ROUTES[roleId] ?? '/' }
    }

    // Ruta con restricción de rol → verificar que el usuario tenga el rol correcto
    if (to.meta.role !== undefined && authStore.userRole !== to.meta.role) {
      const roleId = authStore.userRole
      return { path: ROLE_ROUTES[roleId] ?? '/login' }
    }
  })

  return Router
})
