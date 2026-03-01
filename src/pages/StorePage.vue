<template>
  <q-page>
    <div class="bg-background-light text-slate-900 overflow-hidden h-screen flex flex-col font-sans">
      <div class="relative flex h-screen w-full flex-col overflow-hidden">

        <!-- ══════════════════════════════════════════
             VIEW 1: TABLES
        ══════════════════════════════════════════ -->
        <template v-if="activeView === 'tables'">

          <!-- Header -->
          <header class="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 z-20">
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                <span class="material-symbols-outlined text-2xl font-bold">point_of_sale</span>
              </div>
              <h2 class="text-xl font-bold tracking-tight text-slate-800">POS · Cajas</h2>
            </div>
            <div class="flex flex-1 justify-end gap-8 items-center">
              <div class="relative w-full max-w-lg">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <span class="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  v-model="searchQuery"
                  class="block w-full rounded-full border-slate-100 bg-slate-100/50 py-2.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary border-none text-sm transition-all"
                  placeholder="Buscar mesa por número..."
                  type="text"
                />
              </div>
              <div class="flex items-center gap-4 border-l border-slate-100 pl-8">
                <div class="flex flex-col items-end">
                  <span class="text-sm font-bold text-slate-800">{{ displayName }}</span>
                  <span class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Cajas</span>
                </div>
                <div class="size-11 rounded-full border-2 border-white shadow-md bg-primary/20 ring-1 ring-slate-100 flex items-center justify-center text-primary font-bold text-lg">
                  {{ avatarInitial }}
                </div>
              </div>
            </div>
          </header>

          <div class="flex flex-1 overflow-hidden">

            <!-- Sidebar -->
            <aside class="w-64 flex flex-col border-r border-slate-100 bg-white/50 p-6 gap-8">
              <nav class="flex flex-col gap-1.5">
                <a class="flex items-center gap-3 px-4 py-3 rounded-xl sidebar-item-active" href="#">
                  <span class="material-symbols-outlined">grid_view</span>
                  <span class="text-sm">Mesas</span>
                </a>
                <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-primary transition-all group" href="#">
                  <span class="material-symbols-outlined group-hover:scale-110 transition-transform">receipt_long</span>
                  <span class="text-sm font-medium">Órdenes</span>
                </a>
                <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-primary transition-all group" href="#">
                  <span class="material-symbols-outlined group-hover:scale-110 transition-transform">analytics</span>
                  <span class="text-sm font-medium">Reportes</span>
                </a>
              </nav>

              <!-- Status filters with counts -->
              <div class="flex flex-col gap-2">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Estado</p>
                <button
                  v-for="f in statusFilters"
                  :key="f.key"
                  @click="statusFilter = f.key"
                  :class="[
                    'flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    statusFilter === f.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-500 hover:bg-slate-100',
                  ]"
                >
                  <span>{{ f.label }}</span>
                  <span
                    :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      statusFilter === f.key
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-400',
                    ]"
                  >
                    {{ f.key === 'all' ? mesasStore.tables.length : (mesasStore.totalByStatus[f.key] ?? 0) }}
                  </span>
                </button>
              </div>

              <!-- Info panel -->
              <div class="mt-auto p-5 rounded-2xl bg-primary/5 border border-primary/10">
                <div class="flex items-center gap-2 mb-2 text-primary">
                  <span class="material-symbols-outlined text-sm">info</span>
                  <span class="text-[10px] font-bold uppercase tracking-widest">System Status</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Server is synced. {{ mesasStore.tables.length }} tables loaded.
                </p>
              </div>
            </aside>

            <!-- Main content -->
            <main class="flex-1 overflow-y-auto p-10">
              <div class="max-w-7xl mx-auto space-y-8">
                <div>
                  <h1 class="text-3xl font-bold text-slate-900">Selecciona una mesa</h1>
                  <p class="text-slate-400 mt-1 font-medium">Haz clic en una mesa para abrir la caja</p>
                </div>

                <!-- Loading -->
                <div v-if="mesasStore.loading" class="flex items-center justify-center py-24">
                  <span class="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
                </div>

                <!-- Empty -->
                <div
                  v-else-if="filteredTables.length === 0"
                  class="flex flex-col items-center justify-center py-24 text-slate-400"
                >
                  <span class="material-symbols-outlined text-6xl mb-4">table_restaurant</span>
                  <p class="font-medium text-lg">No tables found</p>
                  <p class="text-sm mt-1">
                    {{ statusFilter !== 'all' ? 'No tables with this status' : 'No tables registered' }}
                  </p>
                </div>

                <!-- Tables grid -->
                <section v-else class="pb-8">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div
                      v-for="table in filteredTables"
                      :key="table.id"
                      @click="openPOS(table)"
                      :class="[
                        'bg-bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1',
                        statusCfg(table.status).cardBorder,
                      ]"
                    >
                      <div class="flex justify-between items-start mb-6">
                        <div
                          :class="[
                            'size-12 rounded-xl flex items-center justify-center',
                            statusCfg(table.status).bg,
                            statusCfg(table.status).text,
                          ]"
                        >
                          <span class="material-symbols-outlined text-3xl">{{ statusCfg(table.status).icon }}</span>
                        </div>
                        <span
                          :class="[
                            'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border',
                            statusCfg(table.status).bg,
                            statusCfg(table.status).text,
                            statusCfg(table.status).border,
                          ]"
                        >{{ statusCfg(table.status).label }}</span>
                      </div>

                      <div class="space-y-1">
                        <h3 class="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                          Table {{ String(table.number).padStart(2, '0') }}
                        </h3>
                        <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                          Click to open POS
                        </p>
                      </div>

                      <div class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                        <span
                          :class="[
                            'text-[10px] font-bold uppercase',
                            table.status === 'available' ? 'text-slate-300' : statusCfg(table.status).text,
                          ]"
                        >
                          {{ table.status === 'available' ? 'Ready' : table.status === 'occupied' ? 'In use' : table.status === 'cleaning' ? 'Cleaning' : 'Reserved' }}
                        </span>
                        <span class="material-symbols-outlined text-slate-300 text-lg group-hover:text-primary transition-colors">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>

          <!-- Footer -->
          <footer class="bg-white border-t border-slate-100 px-8 py-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <div class="flex gap-8">
              <div class="flex items-center gap-2.5">
                <div class="size-2 rounded-full bg-status-available-text shadow-[0_0_8px_rgba(76,175,80,0.3)]"></div>
                <span>Available: {{ mesasStore.totalByStatus.available }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="size-2 rounded-full bg-status-occupied-text shadow-[0_0_8px_rgba(239,83,80,0.3)]"></div>
                <span>Occupied: {{ mesasStore.totalByStatus.occupied }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="size-2 rounded-full bg-status-cleaning-text shadow-[0_0_8px_rgba(255,160,0,0.3)]"></div>
                <span>Cleaning: {{ mesasStore.totalByStatus.cleaning }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="size-2 rounded-full bg-purple-400"></div>
                <span>Reserved: {{ mesasStore.totalByStatus.reserved }}</span>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <span class="text-slate-300">Total: {{ mesasStore.tables.length }} tables</span>
              <span class="text-primary/70">POS · Cajas</span>
            </div>
          </footer>
        </template>

        <!-- ══════════════════════════════════════════
             VIEW 2: POS
        ══════════════════════════════════════════ -->
        <template v-else>

          <!-- Header POS -->
          <header class="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 z-20 gap-4">
            <!-- Back + mesa info -->
            <div class="flex items-center gap-4 shrink-0">
              <button
                @click="backToTables"
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors text-sm font-semibold"
              >
                <span class="material-symbols-outlined text-xl">arrow_back</span>
                <span>Mesas</span>
              </button>
              <div class="h-8 w-px bg-slate-200"></div>
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                  <span class="material-symbols-outlined text-2xl">point_of_sale</span>
                </div>
                <div>
                  <h2 class="text-base font-bold tracking-tight text-slate-800 leading-none">
                    Mesa {{ String(activeMesa?.number ?? '').padStart(2, '0') }}
                  </h2>
                  <span :class="['text-[10px] font-bold uppercase tracking-widest', statusCfg(activeMesa?.status).text]">
                    {{ statusCfg(activeMesa?.status).label }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Search + voice -->
            <div class="flex-1 max-w-xl relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <span class="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                ref="posSearchInput"
                v-model="posSearch"
                class="block w-full rounded-full border-slate-100 bg-slate-100/50 py-2.5 pl-11 pr-12 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary border-none text-sm transition-all"
                placeholder="Buscar productos..."
                type="text"
              />
              <button
                @click="toggleVoice"
                :class="[
                  'absolute inset-y-0 right-3 flex items-center px-1 transition-colors',
                  isListening ? 'text-red-500' : 'text-slate-400 hover:text-primary',
                ]"
              >
                <span class="material-symbols-outlined text-xl">{{ isListening ? 'mic' : 'mic_none' }}</span>
              </button>
            </div>

            <!-- Avatar -->
            <div class="flex items-center gap-4 border-l border-slate-100 pl-6 shrink-0">
              <div class="flex flex-col items-end">
                <span class="text-sm font-bold text-slate-800">{{ displayName }}</span>
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Cajas</span>
              </div>
              <div class="size-11 rounded-full border-2 border-white shadow-md bg-primary/20 ring-1 ring-slate-100 flex items-center justify-center text-primary font-bold text-lg">
                {{ avatarInitial }}
              </div>
            </div>
          </header>

          <!-- Voice feedback banner -->
          <Transition name="slide-down">
            <div v-if="voiceFeedback" class="bg-primary/10 border-b border-primary/20 px-8 py-2 flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-lg animate-pulse">mic</span>
              <span class="text-sm font-semibold text-primary">{{ voiceFeedback }}</span>
            </div>
          </Transition>

          <div class="flex flex-1 overflow-hidden">

            <!-- Cart sidebar -->
            <aside class="w-72 flex flex-col border-r border-slate-100 bg-white/50 overflow-hidden">
              <div class="p-6 border-b border-slate-100">
                <h3 class="text-sm font-bold text-slate-700 uppercase tracking-widest">Orden</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ posStore.cartItemCount }} ítem(s)</p>
              </div>

              <!-- Cart items -->
              <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <div
                  v-if="posStore.cart.length === 0"
                  class="flex flex-col items-center justify-center py-16 text-slate-300"
                >
                  <span class="material-symbols-outlined text-5xl mb-3">shopping_cart</span>
                  <p class="text-sm font-medium">Carrito vacío</p>
                  <p class="text-xs mt-1">Agrega productos</p>
                </div>

                <div
                  v-for="item in posStore.cart"
                  :key="item.product.id"
                  class="bg-white rounded-xl p-3 shadow-sm group border border-slate-100"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-slate-800 truncate">{{ item.product.name }}</p>
                      <p class="text-xs text-slate-400">{{ fmtPrice(item.product.price) }} c/u</p>
                    </div>
                    <button
                      @click="posStore.removeFromCart(item.product.id)"
                      class="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <span class="material-symbols-outlined text-base leading-none">close</span>
                    </button>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center gap-1">
                      <button
                        @click="posStore.updateQty(item.product.id, item.qty - 1)"
                        class="size-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors font-bold text-sm"
                      >−</button>
                      <span class="w-7 text-center text-sm font-bold text-slate-800">{{ item.qty }}</span>
                      <button
                        @click="posStore.updateQty(item.product.id, item.qty + 1)"
                        class="size-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors font-bold text-sm"
                      >+</button>
                    </div>
                    <span class="text-sm font-bold text-slate-800">{{ fmtPrice(item.subtotal) }}</span>
                  </div>
                </div>
              </div>

              <!-- Totals + actions -->
              <div class="p-4 border-t border-slate-100 bg-white space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-500 font-medium">Subtotal</span>
                  <span class="text-sm font-semibold text-slate-800">{{ fmtPrice(posStore.cartTotal) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-base font-bold text-slate-900">Total</span>
                  <span class="text-xl font-bold text-primary">{{ fmtPrice(posStore.cartTotal) }}</span>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="posStore.clearCart()"
                    :disabled="posStore.cart.length === 0"
                    class="flex-1 border border-slate-200 text-slate-500 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-40"
                  >
                    Limpiar
                  </button>
                  <button
                    @click="sendOrder"
                    :disabled="posStore.cart.length === 0 || sendingOrder"
                    class="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm shadow-sm disabled:opacity-40 flex items-center justify-center gap-1"
                  >
                    <span v-if="sendingOrder" class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    <span>{{ sendingOrder ? 'Enviando...' : 'Send Order' }}</span>
                  </button>
                </div>
              </div>
            </aside>

            <!-- Products main -->
            <main class="flex-1 overflow-y-auto p-8">
              <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h1 class="text-2xl font-bold text-slate-900">Productos</h1>
                    <p class="text-slate-400 text-sm mt-0.5 font-medium">{{ filteredProducts.length }} disponibles</p>
                  </div>
                  <!-- Qty selector -->
                  <div class="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                    <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">Cantidad:</span>
                    <div class="flex items-center gap-1">
                      <button
                        @click="addQty = Math.max(1, addQty - 1)"
                        class="size-7 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 font-bold transition-colors shadow-sm"
                      >−</button>
                      <span class="w-8 text-center text-sm font-bold text-slate-800">{{ addQty }}</span>
                      <button
                        @click="addQty++"
                        class="size-7 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 font-bold transition-colors shadow-sm"
                      >+</button>
                    </div>
                  </div>
                </div>

                <!-- Loading -->
                <div v-if="posStore.loading" class="flex items-center justify-center py-24">
                  <span class="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
                </div>

                <!-- Empty -->
                <div
                  v-else-if="filteredProducts.length === 0"
                  class="flex flex-col items-center justify-center py-24 text-slate-400"
                >
                  <span class="material-symbols-outlined text-6xl mb-4">inventory_2</span>
                  <p class="font-medium text-lg">No se encontraron productos</p>
                </div>

                <!-- Products grid -->
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 pb-8">
                  <div
                    v-for="(product, idx) in filteredProducts"
                    :key="product.id"
                    @click="posStore.addToCart(product, addQty)"
                    class="bg-bg-card rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1 overflow-hidden border border-slate-100"
                  >
                    <!-- Color accent top strip -->
                    <div :class="['h-1.5', palette(idx).accent]"></div>

                    <div class="p-4">
                      <!-- Icon container -->
                      <div :class="['size-12 rounded-xl flex items-center justify-center mb-4', palette(idx).bg]">
                        <span :class="['material-symbols-outlined text-2xl', palette(idx).text]">restaurant_menu</span>
                      </div>

                      <h3 class="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight mb-1 line-clamp-2">
                        {{ product.name }}
                      </h3>
                      <p class="text-[10px] text-slate-400 font-mono uppercase mb-2">{{ product.sku || '—' }}</p>
                      <p class="text-lg font-bold text-slate-900">{{ fmtPrice(product.price) }}</p>

                      <!-- Cart badge or stock badge -->
                      <div class="mt-3 flex items-center justify-between gap-1">
                        <span
                          v-if="cartQty(product.id)"
                          class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0"
                        >
                          ×{{ cartQty(product.id) }} en orden
                        </span>
                        <span v-else-if="(product.stock ?? 0) === 0" class="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">Sin stock</span>
                        <span v-else-if="product.stock <= 10" class="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">Stock: {{ product.stock }}</span>
                        <span v-else class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">Stock: {{ product.stock }}</span>
                        <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0', palette(idx).bg, palette(idx).text]">
                          Agregar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          <!-- Footer POS -->
          <footer class="bg-white border-t border-slate-100 px-8 py-3 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Mesa {{ String(activeMesa?.number ?? '').padStart(2, '0') }} · POS Activo</span>
            <div class="flex items-center gap-6">
              <span>{{ posStore.cartItemCount }} item(s)</span>
              <span class="text-primary text-sm font-bold">{{ fmtPrice(posStore.cartTotal) }}</span>
            </div>
          </footer>
        </template>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useMesasStore } from 'stores/mesasStore'
import { usePosStore } from 'stores/posStore'
import { useAuthStore } from 'stores/authStore'

defineOptions({ name: 'StorePage' })

const mesasStore = useMesasStore()
const posStore = usePosStore()
const authStore = useAuthStore()

// ── User info ──
const displayName = computed(
  () => authStore.userProfile?.full_name ?? authStore.currentUser?.email ?? 'Cajas',
)
const avatarInitial = computed(() => displayName.value.charAt(0).toUpperCase())

// ── View ──
const activeView = ref('tables') // 'tables' | 'pos'
const activeMesa = ref(null)

// ── Status config (same as MesasPage) ──
const STATUS_CONFIG = {
  available: {
    bg: 'bg-status-available',
    text: 'text-status-available-text',
    border: 'border-status-available-text/10',
    cardBorder: 'border border-slate-100',
    icon: 'table_bar',
    label: 'Available',
  },
  occupied: {
    bg: 'bg-status-occupied',
    text: 'text-status-occupied-text',
    border: 'border-status-occupied-text/10',
    cardBorder: 'border-2 border-status-occupied-text/10',
    icon: 'person',
    label: 'Occupied',
  },
  cleaning: {
    bg: 'bg-status-cleaning',
    text: 'text-status-cleaning-text',
    border: 'border-status-cleaning-text/10',
    cardBorder: 'border-2 border-status-cleaning-text/10',
    icon: 'cleaning_services',
    label: 'Cleaning',
  },
  reserved: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-200',
    cardBorder: 'border-2 border-purple-200',
    icon: 'bookmark',
    label: 'Reserved',
  },
}
const statusCfg = (status) => STATUS_CONFIG[status] ?? STATUS_CONFIG.available

// ── Filter (tables view) ──
const searchQuery = ref('')
const statusFilter = ref('all')

const statusFilters = [
  { key: 'all',       label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'occupied',  label: 'Occupied' },
  { key: 'cleaning',  label: 'Cleaning' },
  { key: 'reserved',  label: 'Reserved' },
]

const filteredTables = computed(() => {
  let tables = mesasStore.tables
  if (statusFilter.value !== 'all') {
    tables = tables.filter((t) => t.status === statusFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    tables = tables.filter((t) => String(t.number).includes(q))
  }
  return tables
})

// ── Product color palette (8 rotating) ──
const PALETTES = [
  { bg: 'bg-primary/10',  text: 'text-primary',      accent: 'bg-primary' },
  { bg: 'bg-blue-100',    text: 'text-blue-600',     accent: 'bg-blue-500' },
  { bg: 'bg-violet-100',  text: 'text-violet-600',   accent: 'bg-violet-500' },
  { bg: 'bg-rose-100',    text: 'text-rose-600',     accent: 'bg-rose-500' },
  { bg: 'bg-amber-100',   text: 'text-amber-600',    accent: 'bg-amber-500' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600',  accent: 'bg-emerald-500' },
  { bg: 'bg-sky-100',     text: 'text-sky-600',      accent: 'bg-sky-500' },
  { bg: 'bg-orange-100',  text: 'text-orange-600',   accent: 'bg-orange-500' },
]
const palette = (idx) => PALETTES[idx % PALETTES.length]

// ── POS state ──
const posSearch = ref('')
const posSearchInput = ref(null)
const addQty = ref(1)
const sendingOrder = ref(false)

const filteredProducts = computed(() => {
  const q = posSearch.value.toLowerCase()
  if (!q) return posStore.products
  return posStore.products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.sku ?? '').toLowerCase().includes(q),
  )
})

const cartQty = (productId) => {
  const item = posStore.cart.find((i) => i.product.id === productId)
  return item ? item.qty : 0
}

const fmtPrice = (val) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val ?? 0)

// ── Voice search ──
let recognition = null
const isListening = ref(false)
const voiceFeedback = ref('')
let voiceFeedbackTimer = null

const SPANISH_NUMBERS = {
  cero: 0, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
}

function parseVoiceQty(transcript) {
  const words = transcript.toLowerCase().split(/\s+/)
  for (const word of words) {
    const n = SPANISH_NUMBERS[word] ?? parseInt(word, 10)
    if (!isNaN(n) && n > 0) return n
  }
  return 1
}

function setupVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return
  recognition = new SR()
  recognition.lang = 'es-CO'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    voiceFeedback.value = `"${transcript}"`
    clearTimeout(voiceFeedbackTimer)
    voiceFeedbackTimer = setTimeout(() => { voiceFeedback.value = '' }, 3000)

    const qty = parseVoiceQty(transcript)
    posSearch.value = transcript

    const matches = posStore.products.filter((p) =>
      p.name.toLowerCase().includes(transcript.toLowerCase()),
    )
    if (matches.length === 1) {
      posStore.addToCart(matches[0], qty)
      posSearch.value = ''
      voiceFeedback.value = `✓ Agregado: ${matches[0].name} ×${qty}`
      clearTimeout(voiceFeedbackTimer)
      voiceFeedbackTimer = setTimeout(() => { voiceFeedback.value = '' }, 2500)
    }
    isListening.value = false
  }

  recognition.onerror = () => { isListening.value = false }
  recognition.onend = () => { isListening.value = false }
}

function toggleVoice() {
  if (!recognition) return
  if (isListening.value) {
    recognition.stop()
    isListening.value = false
  } else {
    recognition.start()
    isListening.value = true
    voiceFeedback.value = 'Escuchando...'
  }
}

// ── Open / close POS ──
const openPOS = async (table) => {
  activeMesa.value = table
  posStore.clearCart()
  addQty.value = 1
  posSearch.value = ''
  activeView.value = 'pos'
  // Mark table occupied if it was available
  if (table.status === 'available') {
    await mesasStore.updateTableStatus(table.id, 'occupied')
    activeMesa.value = { ...table, status: 'occupied' }
  }
  await nextTick()
  posSearchInput.value?.focus()
}

const backToTables = () => {
  if (recognition && isListening.value) recognition.stop()
  isListening.value = false
  voiceFeedback.value = ''
  clearTimeout(voiceFeedbackTimer)
  activeView.value = 'tables'
  activeMesa.value = null
  posSearch.value = ''
}

// ── Send Order ──
const sendOrder = async () => {
  if (!posStore.cart.length) return
  sendingOrder.value = true
  try {
    const result = await posStore.createTransaction(activeMesa.value?.id)
    if (result.success) {
      if (activeMesa.value) {
        await mesasStore.updateTableStatus(activeMesa.value.id, 'available')
      }
      backToTables()
    }
  } finally {
    sendingOrder.value = false
  }
}

// ── Init ──
onMounted(async () => {
  const companyId = authStore.userProfile?.company_id
  await Promise.all([mesasStore.fetchTables(companyId), posStore.fetchProducts()])
  setupVoice()
})

onBeforeUnmount(() => {
  if (recognition && isListening.value) recognition.stop()
  clearTimeout(voiceFeedbackTimer)
})
</script>

<style scoped>
.sidebar-item-active {
  background: linear-gradient(
    135deg,
    var(--q-primary) 0%,
    color-mix(in srgb, var(--q-primary) 80%, #000) 100%
  );
  color: white;
  font-weight: 600;
}
.sidebar-item-active .material-symbols-outlined {
  color: white;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
