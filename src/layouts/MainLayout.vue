<template>
  <q-layout view="lHh Lpr lFf" class="bg-background-light font-display text-slate-900 antialiased">

    <!-- ── HEADER ── -->
    <q-header class="bg-white border-b border-border-accent text-slate-900 shadow-none">
      <q-toolbar class="h-16 px-4">
        <q-btn
          flat dense round icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
        />

        <q-toolbar-title class="font-bold text-lg tracking-tight flex items-center gap-2 ml-2">
          <span class="text-primary text-2xl material-symbols-outlined">point_of_sale</span>
          POS Menu
        </q-toolbar-title>

        <div class="flex items-center gap-3">
          <!-- Avatar + nombre -->
          <div class="flex items-center gap-2.5 pl-4 border-l border-border-accent">
            <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30">
              {{ avatarInitial }}
            </div>
            <div class="hidden sm:block text-sm">
              <div class="font-bold leading-none">{{ displayName }}</div>
              <div class="text-xs text-slate-500 mt-0.5">{{ roleLabel }}</div>
            </div>
          </div>

          <!-- Logout -->
          <q-btn
            flat round dense
            @click="handleLogout"
            :loading="authStore.loading"
            title="Cerrar sesión"
            class="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
          >
            <span class="material-symbols-outlined text-xl">logout</span>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- ── SIDEBAR ── -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-sidebar-light border-r border-border-accent"
      :width="260"
    >
      <div class="h-full flex flex-col pt-6 px-4">
        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
          Navegación
        </div>

        <q-list class="space-y-1">
          <EssentialLink v-for="link in visibleLinks" :key="link.title" v-bind="link" />
        </q-list>

        <!-- Logout en sidebar -->
        <div class="mt-auto pb-6 pt-4 border-t border-border-accent">
          <button
            @click="handleLogout"
            :disabled="authStore.loading"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            <span class="material-symbols-outlined text-[22px]">logout</span>
            <span class="text-sm font-semibold">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </q-drawer>

    <!-- ── CONTENT ── -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import { useAuthStore } from 'stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// ── Drawer ──
const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// ── User info ──
const displayName = computed(
  () => authStore.userProfile?.full_name ?? authStore.currentUser?.email ?? 'Usuario'
)

const avatarInitial = computed(() => displayName.value.charAt(0).toUpperCase())

const ROLE_LABELS = { 1: 'Super Admin', 2: 'Manager', 3: 'Mesero', 4: 'Tienda' }
const roleLabel = computed(() => ROLE_LABELS[authStore.userRole] ?? 'Sin rol')

// ── Navigation links por rol ──
const ALL_LINKS = [
  { title: 'Super Admin', caption: 'Empresas y usuarios', icon: 'admin_panel_settings', link: '#/admin', roles: [1] },
  { title: 'Dashboard', caption: 'Análisis y reportes', icon: 'dashboard', link: '#/dashboard', roles: [2] },
  { title: 'Gestión de Mesas', caption: 'Distribución y estado', icon: 'table_restaurant', link: '#/mesas', roles: [3] },
  { title: 'Tienda', caption: 'Productos y ventas', icon: 'storefront', link: '#/store', roles: [4] },
  { title: 'POS - Cajas', caption: 'Módulo de pedidos', icon: 'point_of_sale', link: '#/cajas', roles: [1, 2, 3, 4] },
]

const visibleLinks = computed(() =>
  ALL_LINKS.filter((l) => l.roles.includes(authStore.userRole))
)

// ── Logout ──
const handleLogout = async () => {
  await authStore.logout()
  // El redirect lo maneja boot/auth.js via onAuthStateChange → handleSignOut
  // pero si por algún motivo no dispara, redirigimos manualmente
  router.push('/login')
}
</script>

<style>
.q-drawer {
  background: white;
}
</style>
