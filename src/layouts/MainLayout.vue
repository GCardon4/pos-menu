<template>
  <q-layout view="lHh Lpr lFf" class="bg-background-light font-display text-slate-900 antialiased">
    <!-- Header -->
    <q-header
      class="bg-white border-b border-border-accent text-slate-900 h-16 flex items-center shadow-none px-4"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          rounded
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
        />

        <q-toolbar-title class="font-bold text-lg tracking-tight flex items-center gap-2 ml-2">
          <span class="text-primary text-2xl material-symbols-outlined">point_of_sale</span>
          POS Menu
        </q-toolbar-title>

        <div class="flex items-center gap-4">
          <q-btn
            flat
            round
            dense
            icon="notifications"
            class="text-slate-400 hover:text-primary transition-colors"
          />
          <div class="flex items-center gap-3 pl-4 border-l border-border-accent">
            <div
              class="w-8 h-8 rounded-full bg-primary/20 flexItems-center justify-center text-primary font-bold text-sm border border-primary/30"
            >
              A
            </div>
            <div class="hidden sm:block text-sm">
              <div class="font-bold leading-none">Admin User</div>
              <div class="text-xs text-slate-500 mt-0.5">Manager</div>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-sidebar-light border-r border-border-accent"
      :width="260"
    >
      <div class="h-full flex flex-col pt-6 px-4">
        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
          Navigation
        </div>
        <q-list class="space-y-1">
          <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
        </q-list>

        <div class="mt-auto pb-6">
          <div class="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div class="text-sm font-bold text-slate-900 mb-1">POS Version</div>
            <div class="text-xs text-slate-500">v{{ $q.version }} - Build 1204</div>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'POS - Cajas',
    caption: 'Módulo de Pedidos',
    icon: 'point_of_sale',
    link: '#/cajas',
  },
  {
    title: 'Dashboard Manager',
    caption: 'Consistencia Visual',
    icon: 'dashboard',
    link: '#/dashboard',
  },
  {
    title: 'Gestión de Mesas',
    caption: 'Distribución y estado',
    icon: 'table_restaurant',
    link: '#/mesas',
  },
  {
    title: 'Super Admin',
    caption: 'Empresas y Usuarios',
    icon: 'admin_panel_settings',
    link: '#/admin',
  },
  {
    title: 'Login',
    caption: 'Acceso al Sistema',
    icon: 'login',
    link: '#/login',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
/* Adjust Quasar drawer styles for POS Design System */
.q-drawer {
  background: white;
}
</style>
