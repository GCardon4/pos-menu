<template>
  <q-page class="flex-1 overflow-y-auto scrollbar-hide">
    <!-- Top Navbar -->
    <div
      class="sticky top-0 z-10 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-primary/10 bg-background-light/90"
    >
      <div class="flex items-center gap-6">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Manager Dashboard</h1>
          <p class="text-sm text-slate-500">Live operational overview</p>
        </div>
        <!-- Tab switcher -->
        <div class="flex bg-primary/5 p-1 rounded-xl border border-primary/10">
          <button
            @click="activeTab = 'analytics'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              activeTab === 'analytics'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-primary',
            ]"
          >
            Analítica
          </button>
          <button
            @click="activeTab = 'team'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              activeTab === 'team'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-primary',
            ]"
          >
            Equipo
          </button>
          <button
            @click="activeTab = 'cajas'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              activeTab === 'cajas'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-primary',
            ]"
          >
            Cajas
          </button>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <!-- Period selector (analytics only) -->
        <template v-if="activeTab === 'analytics'">
          <div class="flex bg-primary/5 p-1 rounded-xl border border-primary/10">
            <button
              v-for="p in PERIODS"
              :key="p.key"
              @click="setPeriod(p.key)"
              :class="[
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                dashStore.period === p.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-primary',
              ]"
            >
              {{ p.label }}
            </button>
          </div>
          <button
            @click="dashStore.fetchTransactions(dashStore.period)"
            :class="[
              'flex items-center justify-center p-2.5 rounded-xl border transition-colors',
              'bg-primary/5 border-primary/10 text-primary hover:bg-primary/10',
              dashStore.loading ? 'animate-spin' : '',
            ]"
            title="Refrescar"
          >
            <span class="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </template>
        <!-- New user button (team only) -->
        <button
          v-if="activeTab === 'team'"
          @click="openUserDialog()"
          class="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark shadow-sm transition-all"
        >
          <span class="material-symbols-outlined text-xl">person_add</span>
          Nuevo usuario
        </button>
        <!-- New register button (cajas only) -->
        <button
          v-if="activeTab === 'cajas'"
          @click="openCajaDialog()"
          class="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark shadow-sm transition-all"
        >
          <span class="material-symbols-outlined text-xl">add</span>
          Nueva caja
        </button>
      </div>
    </div>

    <!-- ── ANALYTICS TAB ──────────────────────────────────────── -->
    <div v-if="activeTab === 'analytics'" class="p-8 space-y-8 max-w-[1600px] mx-auto">
      <!-- ── Metrics Grid ──────────────────────────────────────── -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Daily Revenue -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10 neon-glow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <span
              v-if="dashStore.revenueChangePct !== null"
              :class="[
                'text-xs font-bold flex items-center gap-0.5',
                dashStore.revenueChangePct >= 0 ? 'text-primary' : 'text-rose-500',
              ]"
            >
              {{ dashStore.revenueChangePct >= 0 ? '+' : '' }}{{ dashStore.revenueChangePct.toFixed(1) }}%
              <span class="material-symbols-outlined text-[14px]">
                {{ dashStore.revenueChangePct >= 0 ? 'trending_up' : 'trending_down' }}
              </span>
            </span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Revenue del día</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else>{{ formatCurrency(dashStore.totalRevenue) }}</span>
          </h3>
        </div>

        <!-- Active Mesas -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">table_restaurant</span>
            </div>
            <span class="text-xs font-bold text-slate-500">Mesas con ventas</span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Mesas activas</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else-if="dashStore.activeMesaIds.length">
              {{ dashStore.activeMesaIds.length }}
            </span>
            <span v-else class="text-lg text-slate-400">Sin datos</span>
          </h3>
          <div v-if="dashStore.activeMesaIds.length" class="w-full bg-primary/10 h-1.5 rounded-full mt-4">
            <div class="bg-primary h-full rounded-full" :style="`width: 100%`"></div>
          </div>
        </div>

        <!-- Avg Ticket -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">receipt</span>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-medium">Ticket promedio</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else>{{ formatCurrency(dashStore.avgTicket) }}</span>
          </h3>
        </div>

        <!-- Transactions -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">point_of_sale</span>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-medium">Transacciones</p>
          <h3 class="text-3xl font-bold mt-1">
            <span v-if="dashStore.loading" class="text-xl text-slate-300">Cargando…</span>
            <span v-else>{{ dashStore.transactionCount }}</span>
          </h3>
        </div>
      </div>

      <!-- ── Chart + Category ──────────────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Hourly Sales Chart -->
        <div class="xl:col-span-2 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-bold">Ventas por hora</h3>
              <p class="text-sm text-slate-500">Distribución del revenue por hora</p>
            </div>
            <div class="flex gap-2">
              <span class="flex items-center gap-2 text-xs font-medium">
                <span class="size-2 rounded-full bg-primary"></span> Período
              </span>
            </div>
          </div>

          <!-- Barras dinámicas -->
          <div class="flex-1 flex items-end gap-1.5 h-64 min-h-[250px] px-2">
            <div
              v-for="slot in dashStore.chartHours"
              :key="slot.label"
              class="flex-1 bg-primary/10 rounded-t-lg relative group"
              :style="`height: ${Math.max(slot.pct, 4)}%`"
            >
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg opacity-80 group-hover:opacity-100 transition-all"
                :style="`height: ${slot.pct || 0}%`"
              ></div>
              <!-- Tooltip -->
              <div
                class="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none"
              >
                <div class="bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  {{ formatCurrency(slot.total) }}
                </div>
                <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>

          <div class="flex justify-between mt-4 text-[10px] uppercase tracking-widest font-bold px-2 text-slate-400">
            <span v-for="slot in dashStore.chartHours.filter((_, i) => i % 2 === 0)" :key="slot.label">
              {{ slot.label }}
            </span>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h3 class="text-lg font-bold mb-1">Categorías</h3>
          <p class="text-sm text-slate-500 mb-8">Ventas por categoría</p>

          <!-- Con datos reales de category -->
          <div v-if="dashStore.salesByCategory.length" class="space-y-4 mt-4">
            <div
              v-for="cat in dashStore.salesByCategory"
              :key="cat.name"
              class="space-y-1.5"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium">{{ cat.name }}</span>
                <span class="font-bold">{{ cat.pct }}%</span>
              </div>
              <div class="w-full bg-primary/10 h-2 rounded-full">
                <div
                  class="bg-primary h-full rounded-full transition-all"
                  :style="`width: ${cat.pct}%`"
                ></div>
              </div>
              <div class="text-xs text-slate-500">{{ formatCurrency(cat.total) }}</div>
            </div>
          </div>

          <!-- Sin datos de categoría: mostrar totales generales -->
          <div v-else class="space-y-6">
            <div class="relative size-40 mx-auto">
              <svg class="size-full -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-primary/10"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" stroke-dasharray="100, 100" stroke-width="4"
                />
                <path
                  class="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor"
                  :stroke-dasharray="`${dashStore.transactionCount ? 100 : 0}, 100`"
                  stroke-linecap="round" stroke-width="4"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span class="text-xl font-bold">{{ formatCurrencyShort(dashStore.totalRevenue) }}</span>
                <span class="text-[10px] uppercase tracking-tighter text-slate-500">Total ventas</span>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="size-3 rounded-full bg-primary"></span>
                  <span class="font-medium">Transacciones</span>
                </div>
                <span class="font-bold">{{ dashStore.transactionCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="size-3 rounded-full bg-primary/40"></span>
                  <span class="font-medium">Ticket promedio</span>
                </div>
                <span class="font-bold">{{ formatCurrency(dashStore.avgTicket) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Top Mesas + Floor Status ─────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Performing Tables -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold">Top Mesas</h3>
          </div>

          <!-- Con datos reales de table_id -->
          <div v-if="dashStore.topMesas.length" class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] uppercase tracking-widest border-b border-primary/10 text-slate-400">
                  <th class="pb-3 font-bold">Mesa</th>
                  <th class="pb-3 font-bold">Transacciones</th>
                  <th class="pb-3 font-bold text-right">Total ventas</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5">
                <tr
                  v-for="mesa in dashStore.topMesas"
                  :key="mesa.table_id"
                  class="group hover:bg-primary/5 transition-colors"
                >
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs"
                      >
                        {{ mesa.table_id }}
                      </div>
                    </div>
                  </td>
                  <td class="py-4 text-sm text-slate-500">{{ mesa.count }} pedidos</td>
                  <td class="py-4 font-bold text-primary text-right">{{ formatCurrency(mesa.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Sin table_id en transactions -->
          <div v-else-if="!dashStore.loading" class="text-center py-10 text-slate-400">
            <span class="material-symbols-outlined text-4xl mb-2 block">table_restaurant</span>
            <p class="text-sm">
              {{ dashStore.transactionCount > 0
                ? 'Las transacciones no tienen mesa asignada'
                : 'Sin transacciones en este período'
              }}
            </p>
          </div>

          <div v-else class="text-center py-10 text-slate-300 text-sm">Cargando…</div>
        </div>

        <!-- Service Hotspots / Floor Status (visual) -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold">Estado del piso</h3>
            <div class="flex gap-2">
              <span class="px-2 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                {{ dashStore.activeMesaIds.length }} activas
              </span>
            </div>
          </div>
          <!-- Mapa visual -->
          <div class="grid grid-cols-5 gap-3 h-64 border border-primary/5 rounded-xl p-4 bg-slate-50">
            <div
              v-for="n in 12"
              :key="n"
              :class="[
                'rounded-lg flex items-center justify-center text-[10px] font-bold transition-all',
                dashStore.activeMesaIds.includes(String(n)) || dashStore.activeMesaIds.includes(n)
                  ? 'bg-primary text-white border border-primary shadow-[0_0_8px_rgba(17,212,196,0.4)]'
                  : 'bg-primary/10 border border-primary/20 text-slate-400',
                n === 7 ? 'col-span-2' : '',
              ]"
            >
              {{ n === 7 ? 'BAR' : String(n).padStart(2, '0') }}
            </div>
          </div>
          <div class="mt-4 flex gap-6">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-primary shadow-[0_0_5px_rgba(17,212,196,0.8)]"></span>
              <span class="text-xs text-slate-500">Con ventas hoy</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-primary/10 border border-primary/20"></span>
              <span class="text-xs text-slate-500">Sin actividad</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── EQUIPO TAB ──────────────────────────────────────────── -->
    <div v-if="activeTab === 'team'" class="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div class="flex flex-col gap-1 mb-2">
        <h2 class="text-2xl font-bold tracking-tight">Equipo</h2>
        <p class="text-slate-500 text-sm">Gestión de meseros y cajeros de tu empresa.</p>
      </div>

      <!-- Role stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
        <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div class="p-2 rounded-lg bg-primary/10 text-primary">
            <span class="material-symbols-outlined">group</span>
          </div>
          <div>
            <p class="text-slate-500 text-xs font-medium">Total equipo</p>
            <h3 class="text-2xl font-bold">{{ companyStore.profiles.length }}</h3>
          </div>
        </div>
        <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div class="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <span class="material-symbols-outlined">point_of_sale</span>
          </div>
          <div>
            <p class="text-slate-500 text-xs font-medium">Cajas</p>
            <h3 class="text-2xl font-bold">
              {{ companyStore.profiles.filter((p) => p.roles_id === 3).length }}
            </h3>
          </div>
        </div>
        <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <span class="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <p class="text-slate-500 text-xs font-medium">Bodega</p>
            <h3 class="text-2xl font-bold">
              {{ companyStore.profiles.filter((p) => p.roles_id === 4).length }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Users table -->
      <div class="rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden">
        <div class="p-6 border-b border-primary/10 flex items-center justify-between">
          <h3 class="font-bold text-lg">Usuarios de la empresa</h3>
          <p class="text-sm text-slate-400">{{ companyStore.profiles.length }} usuario(s)</p>
        </div>

        <div v-if="companyStore.loadingProfile" class="flex items-center justify-center py-16">
          <span class="material-symbols-outlined text-primary text-4xl animate-spin"
            >progress_activity</span
          >
        </div>

        <div
          v-else-if="companyStore.profiles.length === 0"
          class="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <span class="material-symbols-outlined text-5xl mb-3">manage_accounts</span>
          <p class="font-medium">Sin usuarios registrados en tu empresa</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead
              class="bg-primary/5 text-slate-500 uppercase text-[11px] font-bold tracking-wider"
            >
              <tr>
                <th class="px-6 py-4">Usuario</th>
                <th class="px-6 py-4">Rol</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary/5">
              <tr
                v-for="profile in companyStore.profiles"
                :key="profile.id"
                class="hover:bg-primary/5 transition-colors group"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm"
                    >
                      {{ (profile.full_name ?? profile.email ?? '?').charAt(0).toUpperCase() }}
                    </div>
                    <div class="flex flex-col">
                      <span class="font-semibold text-sm">{{ profile.full_name ?? '—' }}</span>
                      <span class="text-xs text-slate-500">{{ profile.email ?? '' }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      profile.roles_id === 3
                        ? 'bg-amber-50 text-amber-600'
                        : profile.roles_id === 4
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-500',
                      'text-xs font-bold px-2.5 py-1 rounded-full uppercase',
                    ]"
                  >
                    {{ profile.roles_id === 3 ? 'Cajas' : profile.roles_id === 4 ? 'Bodega' : 'Sin rol' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      profile.is_active
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-400 bg-slate-100'
                    "
                    class="flex items-center gap-1.5 text-xs font-bold uppercase w-fit px-2.5 py-1 rounded-full"
                  >
                    <span
                      :class="profile.is_active ? 'bg-emerald-500' : 'bg-slate-400'"
                      class="size-1.5 rounded-full"
                    ></span>
                    {{ profile.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div
                    class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      @click="openUserDialog(profile)"
                      class="p-2 text-slate-400 hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      @click="confirmDeleteUser(profile)"
                      class="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── CAJAS TAB ──────────────────────────────────────────── -->
    <div v-if="activeTab === 'cajas'" class="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div class="flex flex-col gap-1 mb-2">
        <h2 class="text-2xl font-bold tracking-tight">Cajas</h2>
        <p class="text-slate-500 text-sm">Gestión de cajas registradoras de la empresa.</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
        <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div class="p-2 rounded-lg bg-primary/10 text-primary">
            <span class="material-symbols-outlined">point_of_sale</span>
          </div>
          <div>
            <p class="text-slate-500 text-xs font-medium">Total cajas</p>
            <h3 class="text-2xl font-bold">{{ cajasStore.totalRegisters }}</h3>
          </div>
        </div>
        <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <span class="material-symbols-outlined">person_check</span>
          </div>
          <div>
            <p class="text-slate-500 text-xs font-medium">Con usuario asignado</p>
            <h3 class="text-2xl font-bold">
              {{ cajasStore.registers.filter((r) => r.user_id).length }}
            </h3>
          </div>
        </div>
        <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div class="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <span class="material-symbols-outlined">person_off</span>
          </div>
          <div>
            <p class="text-slate-500 text-xs font-medium">Sin usuario asignado</p>
            <h3 class="text-2xl font-bold">
              {{ cajasStore.registers.filter((r) => !r.user_id).length }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Registers table -->
      <div class="rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden">
        <div class="p-6 border-b border-primary/10 flex items-center justify-between">
          <h3 class="font-bold text-lg">Registro de Cajas</h3>
          <p class="text-sm text-slate-400">{{ cajasStore.registers.length }} caja(s)</p>
        </div>

        <div v-if="cajasStore.loading" class="flex items-center justify-center py-16">
          <span class="material-symbols-outlined text-primary text-4xl animate-spin"
            >progress_activity</span
          >
        </div>

        <div
          v-else-if="cajasStore.registers.length === 0"
          class="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <span class="material-symbols-outlined text-5xl mb-3">point_of_sale</span>
          <p class="font-medium">Sin cajas registradas</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead
              class="bg-primary/5 text-slate-500 uppercase text-[11px] font-bold tracking-wider"
            >
              <tr>
                <th class="px-6 py-4">Caja</th>
                <th class="px-6 py-4">Usuario asignado</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary/5">
              <tr
                v-for="register in cajasStore.registers"
                :key="register.id"
                class="hover:bg-primary/5 transition-colors group"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"
                    >
                      <span class="material-symbols-outlined text-xl">point_of_sale</span>
                    </div>
                    <span class="font-semibold text-sm">{{ register.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="register.profiles" class="flex items-center gap-3">
                    <div
                      class="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs"
                    >
                      {{ (register.profiles.full_name ?? register.profiles.email ?? '?').charAt(0).toUpperCase() }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-medium">{{ register.profiles.full_name ?? '—' }}</span>
                      <span class="text-xs text-slate-500">{{ register.profiles.email }}</span>
                    </div>
                  </div>
                  <span v-else class="text-xs text-slate-400 italic">Sin asignar</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div
                    class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      @click="openCajaDialog(register)"
                      class="p-2 text-slate-400 hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      @click="confirmDeleteCaja(register)"
                      class="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── DIALOG: CAJA FORM ───────────────────────────────────── -->
    <q-dialog v-model="cajaDialog" persistent>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-800">
              {{ editingCaja ? 'Editar caja' : 'Nueva caja' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ editingCaja ? 'Modifica los datos de la caja' : 'Registra una nueva caja' }}
            </p>
          </div>
          <button
            @click="cajaDialog = false"
            class="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form @submit.prevent="submitCaja" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre *</label>
            <input
              v-model="cajaForm.name"
              type="text"
              required
              placeholder="Ej: Caja Principal, POS 1"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Usuario asignado
            </label>
            <select
              v-model="cajaForm.user_id"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Sin asignar</option>
              <option
                v-for="profile in companyStore.profiles"
                :key="profile.id"
                :value="profile.id"
              >
                {{ profile.full_name ?? profile.email }}
                ({{ profile.roles_id === 3 ? 'Cajas' : profile.roles_id === 4 ? 'Bodega' : 'Usuario' }})
              </option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="cajaDialog = false"
              class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="cajasStore.loading"
              class="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60"
            >
              {{ cajasStore.loading ? 'Guardando...' : editingCaja ? 'Guardar cambios' : 'Crear caja' }}
            </button>
          </div>
        </form>
      </div>
    </q-dialog>

    <!-- ── DIALOG: CONFIRMAR ELIMINACIÓN CAJA ─────────────────── -->
    <q-dialog v-model="deleteCajaDialog">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div
          class="bg-red-50 text-red-500 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <span class="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">¿Eliminar caja?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Se eliminará permanentemente
          <span class="font-semibold text-slate-700">{{ deletingCaja?.name }}</span>.
          Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteCajaDialog = false"
            class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            @click="executeDeleteCaja"
            :disabled="cajasStore.loading"
            class="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      </div>
    </q-dialog>

    <!-- ── DIALOG: USER FORM ──────────────────────────────────── -->
    <q-dialog v-model="userDialog" persistent>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-800">
              {{ editingUser ? 'Editar usuario' : 'Nuevo usuario' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ editingUser ? 'Modifica datos del usuario' : 'Agrega un mesero o cajero' }}
            </p>
          </div>
          <button
            @click="userDialog = false"
            class="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form @submit.prevent="submitUser" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre completo</label>
            <input
              v-model="userForm.full_name"
              type="text"
              placeholder="Juan Pérez"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>
          <template v-if="!editingUser">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                placeholder="usuario@empresa.com"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña *</label>
              <input
                v-model="userForm.password"
                type="password"
                required
                placeholder="••••••••"
                minlength="6"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
          </template>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Rol *</label>
            <select
              v-model.number="userForm.roles_id"
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option :value="3">Cajas</option>
              <option :value="4">Bodega</option>
            </select>
          </div>
          <div class="flex items-center gap-3 pt-1">
            <button
              type="button"
              @click="userForm.is_active = !userForm.is_active"
              :class="userForm.is_active ? 'bg-primary' : 'bg-slate-200'"
              class="relative w-10 h-6 rounded-full transition-colors focus:outline-none shrink-0"
            >
              <span
                :class="userForm.is_active ? 'translate-x-4' : 'translate-x-0.5'"
                class="absolute top-0.5 size-5 bg-white rounded-full shadow transition-transform block"
              ></span>
            </button>
            <span class="text-sm font-medium text-slate-600">Usuario activo</span>
          </div>
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="userDialog = false"
              class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="companyStore.loadingProfile"
              class="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60"
            >
              {{ companyStore.loadingProfile ? 'Guardando...' : editingUser ? 'Guardar cambios' : 'Crear usuario' }}
            </button>
          </div>
        </form>
      </div>
    </q-dialog>

    <!-- ── DIALOG: CONFIRMAR ELIMINACIÓN ──────────────────────── -->
    <q-dialog v-model="deleteUserDialog">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div
          class="bg-red-50 text-red-500 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <span class="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">¿Eliminar usuario?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Se eliminará permanentemente
          <span class="font-semibold text-slate-700">{{
            deletingUser?.full_name ?? deletingUser?.email
          }}</span>. Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteUserDialog = false"
            class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            @click="executeDeleteUser"
            :disabled="companyStore.loadingProfile"
            class="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      </div>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from 'stores/dashboardStore'
import { useCompanyStore } from 'stores/companyStore'
import { useAuthStore } from 'stores/authStore'
import { useCajasStore } from 'stores/cajasStore'

defineOptions({ name: 'ManagerDashboard' })

const dashStore = useDashboardStore()
const companyStore = useCompanyStore()
const authStore = useAuthStore()
const cajasStore = useCajasStore()

// ── Tabs ──
const activeTab = ref('analytics')

const PERIODS = [
  { key: 'today',     label: 'Hoy' },
  { key: 'yesterday', label: 'Ayer' },
  { key: 'week',      label: 'Últimos 7 días' },
]

function setPeriod(period) {
  dashStore.fetchTransactions(period)
}

// ── Formatters ────────────────────────────────────────────────
function formatCurrency(value) {
  if (!value && value !== 0) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCurrencyShort(value) {
  if (!value) return '$0'
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`
  return `$${value.toFixed(0)}`
}

// ── Team management ──────────────────────────────────────────
const userDialog = ref(false)
const editingUser = ref(null)
const userForm = ref({})

const openUserDialog = (profile = null) => {
  editingUser.value = profile
  userForm.value = profile
    ? { full_name: profile.full_name ?? '', roles_id: profile.roles_id, is_active: profile.is_active ?? true }
    : { full_name: '', email: '', password: '', roles_id: 3, is_active: true }
  userDialog.value = true
}

const submitUser = async () => {
  const companyId = authStore.userProfile?.company_id
  let result
  if (editingUser.value) {
    const { full_name, roles_id, is_active } = userForm.value
    result = await companyStore.updateProfile(editingUser.value.id, { full_name, roles_id, is_active })
  } else {
    const { email, password, full_name, roles_id, is_active } = userForm.value
    result = await companyStore.createUser(email, password, {
      full_name, roles_id, company_id: companyId, is_active,
    })
  }
  if (result.success) {
    userDialog.value = false
    await companyStore.fetchProfiles(companyId)
  }
}

const deleteUserDialog = ref(false)
const deletingUser = ref(null)

const confirmDeleteUser = (profile) => {
  deletingUser.value = profile
  deleteUserDialog.value = true
}

const executeDeleteUser = async () => {
  const result = await companyStore.deleteProfile(deletingUser.value.id)
  if (result.success) {
    deleteUserDialog.value = false
    const companyId = authStore.userProfile?.company_id
    await companyStore.fetchProfiles(companyId)
  }
}

// ── Cajas management ─────────────────────────────────────────
const cajaDialog = ref(false)
const editingCaja = ref(null)
const cajaForm = ref({ name: '', user_id: '' })

const openCajaDialog = (register = null) => {
  editingCaja.value = register
  cajaForm.value = register
    ? { name: register.name, user_id: register.user_id ?? '' }
    : { name: '', user_id: '' }
  cajaDialog.value = true
}

const submitCaja = async () => {
  const companyId = authStore.userProfile?.company_id
  const payload = {
    name: cajaForm.value.name,
    user_id: cajaForm.value.user_id || null,
    company_id: companyId,
  }
  const result = editingCaja.value
    ? await cajasStore.updateRegister(editingCaja.value.id, payload)
    : await cajasStore.createRegister(payload)
  if (result.success) cajaDialog.value = false
}

const deleteCajaDialog = ref(false)
const deletingCaja = ref(null)

const confirmDeleteCaja = (register) => {
  deletingCaja.value = register
  deleteCajaDialog.value = true
}

const executeDeleteCaja = async () => {
  const result = await cajasStore.deleteRegister(deletingCaja.value.id)
  if (result.success) deleteCajaDialog.value = false
}

onMounted(async () => {
  const companyId = authStore.userProfile?.company_id
  await Promise.all([
    dashStore.fetchTransactions('today'),
    companyStore.fetchProfiles(companyId),
    cajasStore.fetchRegisters(companyId),
  ])
  dashStore.subscribeRealtime()
})

onUnmounted(() => {
  dashStore.unsubscribeRealtime()
})
</script>

<style scoped>
.neon-glow {
  box-shadow: 0 0 15px rgba(17, 212, 196, 0.12);
}
</style>
