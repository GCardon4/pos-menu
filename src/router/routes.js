const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'cajas', component: () => import('pages/CajasPage.vue') },
    ],
  },

  // Rutas por rol
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, role: 1 },
    children: [
      { path: '', component: () => import('pages/admin/AdminDashboard.vue') },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, role: 2 },
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') },
    ],
  },
  {
    path: '/mesas',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, role: 3 },
    children: [
      { path: '', component: () => import('pages/MesasPage.vue') },
    ],
  },
  {
    path: '/store',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, role: 4 },
    children: [
      { path: '', component: () => import('pages/StorePage.vue') },
    ],
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
