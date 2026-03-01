<template>
  <q-page>
    <div
      class="bg-background-light text-slate-900 overflow-hidden h-screen flex flex-col font-sans"
    >
      <div class="relative flex h-screen w-full flex-col overflow-hidden">
        <header
          class="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 z-20"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary"
            >
              <span class="material-symbols-outlined text-2xl font-bold">restaurant</span>
            </div>
            <h2 class="text-xl font-bold tracking-tight text-slate-800">POS Menu</h2>
          </div>
          <div class="flex flex-1 justify-end gap-8 items-center">
            <div class="relative w-full max-w-lg">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400"
              >
                <span class="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                v-model="searchQuery"
                class="block w-full rounded-full border-slate-100 bg-slate-100/50 py-2.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary border-none text-sm transition-all"
                placeholder="Search tables by number..."
                type="text"
              />
            </div>
            <div class="flex items-center gap-4 border-l border-slate-100 pl-8">
              <div class="flex flex-col items-end">
                <span class="text-sm font-bold text-slate-800">{{ displayName }}</span>
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                  Manager
                </span>
              </div>
              <div
                class="size-11 rounded-full border-2 border-white shadow-md bg-primary/20 ring-1 ring-slate-100 flex items-center justify-center text-primary font-bold text-lg"
              >
                {{ avatarInitial }}
              </div>
            </div>
          </div>
        </header>

        <div class="flex flex-1 overflow-hidden">
          <aside class="w-64 flex flex-col border-r border-slate-100 bg-white/50 p-6 gap-8">
            <nav class="flex flex-col gap-1.5">
              <a class="flex items-center gap-3 px-4 py-3 rounded-xl sidebar-item-active" href="#">
                <span class="material-symbols-outlined">grid_view</span>
                <span class="text-sm">Tables</span>
              </a>
              <a
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-primary transition-all group"
                href="#"
              >
                <span class="material-symbols-outlined group-hover:scale-110 transition-transform"
                  >receipt_long</span
                >
                <span class="text-sm font-medium">Orders</span>
              </a>
              <a
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-primary transition-all group"
                href="#"
              >
                <span class="material-symbols-outlined group-hover:scale-110 transition-transform"
                  >inventory_2</span
                >
                <span class="text-sm font-medium">Inventory</span>
              </a>
              <a
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-primary transition-all group"
                href="#"
              >
                <span class="material-symbols-outlined group-hover:scale-110 transition-transform"
                  >analytics</span
                >
                <span class="text-sm font-medium">Reports</span>
              </a>
            </nav>
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

          <main class="flex-1 overflow-y-auto p-10">
            <div class="max-w-7xl mx-auto space-y-12">
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 class="text-3xl font-bold text-slate-900">Table Management</h1>
                  <p class="text-slate-400 mt-1 font-medium">
                    {{ isManager ? 'Gestión completa de mesas' : 'Live overview of the dining floor' }}
                  </p>
                </div>
                <div class="flex items-center gap-3 self-start">
                  <!-- Nueva Mesa button (Manager only) -->
                  <button
                    v-if="isManager"
                    @click="openMesaDialog()"
                    class="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm shrink-0"
                  >
                    <span class="material-symbols-outlined text-lg">add</span>
                    Nueva Mesa
                  </button>
                  <!-- Status filter tabs -->
                  <div class="flex bg-slate-100 p-1.5 rounded-xl flex-wrap gap-1">
                  <button
                    v-for="f in statusFilters"
                    :key="f.key"
                    @click="statusFilter = f.key"
                    :class="[
                      'px-5 py-2 rounded-lg font-bold text-xs transition-colors',
                      statusFilter === f.key
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-primary',
                    ]"
                  >
                    {{ f.label }}
                  </button>
                  </div>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="mesasStore.loading" class="flex items-center justify-center py-24">
                <span
                  class="material-symbols-outlined text-primary text-5xl animate-spin"
                  >progress_activity</span
                >
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
              <section v-else class="space-y-6 pb-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div
                    v-for="table in filteredTables"
                    :key="table.id"
                    @click="handleTableClick(table)"
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
                        <span class="material-symbols-outlined text-3xl">{{
                          statusCfg(table.status).icon
                        }}</span>
                      </div>
                      <span
                        :class="[
                          'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border',
                          statusCfg(table.status).bg,
                          statusCfg(table.status).text,
                          statusCfg(table.status).border,
                        ]"
                        >{{ statusCfg(table.status).label }}</span
                      >
                    </div>

                    <div class="space-y-1">
                      <h3
                        class="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors"
                      >
                        Table {{ String(table.number).padStart(2, '0') }}
                      </h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        Click to cycle status
                      </p>
                    </div>

                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span
                        :class="[
                          'text-[10px] font-bold uppercase',
                          table.status === 'available'
                            ? 'text-slate-300'
                            : statusCfg(table.status).text,
                        ]"
                      >
                        {{
                          table.status === 'available'
                            ? 'Ready'
                            : table.status === 'occupied'
                              ? 'In use'
                              : table.status === 'cleaning'
                                ? 'Cleaning'
                                : 'Reserved'
                        }}
                      </span>

                      <div class="flex items-center gap-1">
                        <!-- Abrir Caja button for occupied tables -->
                        <button
                          v-if="table.status === 'occupied'"
                          @click.stop="openCajas(table)"
                          class="flex items-center gap-1.5 text-xs font-bold bg-primary text-slate-900 px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                        >
                          <span class="material-symbols-outlined text-sm leading-none"
                            >point_of_sale</span
                          >
                          Abrir Caja
                        </button>

                        <!-- Manager CRUD buttons -->
                        <template v-if="isManager">
                          <button
                            @click.stop="openMesaDialog(table)"
                            class="p-1.5 rounded-lg text-slate-300 hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Editar"
                          >
                            <span class="material-symbols-outlined text-base leading-none">edit</span>
                          </button>
                          <button
                            @click.stop="confirmDeleteMesa(table)"
                            class="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <span class="material-symbols-outlined text-base leading-none">delete</span>
                          </button>
                        </template>

                        <span
                          v-else-if="table.status !== 'occupied'"
                          class="material-symbols-outlined text-slate-300 text-lg"
                          >more_horiz</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>

        <footer
          class="bg-white border-t border-slate-100 px-8 py-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          <div class="flex gap-8">
            <div class="flex items-center gap-2.5">
              <div
                class="size-2 rounded-full bg-status-available-text shadow-[0_0_8px_rgba(76,175,80,0.3)]"
              ></div>
              <span>Available: {{ mesasStore.totalByStatus.available }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div
                class="size-2 rounded-full bg-status-occupied-text shadow-[0_0_8px_rgba(239,83,80,0.3)]"
              ></div>
              <span>Occupied: {{ mesasStore.totalByStatus.occupied }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div
                class="size-2 rounded-full bg-status-cleaning-text shadow-[0_0_8px_rgba(255,160,0,0.3)]"
              ></div>
              <span>Cleaning: {{ mesasStore.totalByStatus.cleaning }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="size-2 rounded-full bg-purple-400"></div>
              <span>Reserved: {{ mesasStore.totalByStatus.reserved }}</span>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <span class="text-slate-300">Total: {{ mesasStore.tables.length }} tables</span>
            <span class="text-primary/70">Last synced: Just now</span>
          </div>
        </footer>
      </div>
    </div>
      <!-- ── DIALOG: MESA FORM (Manager only) ── -->
    <q-dialog v-model="mesaDialog" persistent>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-slate-800">
            {{ editingMesa ? 'Editar mesa' : 'Nueva mesa' }}
          </h3>
          <button
            @click="mesaDialog = false"
            class="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form @submit.prevent="submitMesa" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Número *</label>
            <input
              v-model.number="mesaForm.number"
              type="number"
              required
              min="1"
              placeholder="Ej: 5"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Estado</label>
            <select
              v-model="mesaForm.status"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning">Cleaning</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
          <div class="flex gap-3 pt-1">
            <button
              type="button"
              @click="mesaDialog = false"
              class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="mesasStore.loading"
              class="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60"
            >
              {{ mesasStore.loading ? 'Guardando...' : editingMesa ? 'Guardar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </q-dialog>

    <!-- ── DIALOG: CONFIRMAR ELIMINACIÓN ── -->
    <q-dialog v-model="deleteDialog">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="bg-red-50 text-red-500 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">¿Eliminar mesa?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Se eliminará permanentemente
          <span class="font-semibold text-slate-700">Mesa {{ deletingMesa?.number }}</span>.
          Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteDialog = false"
            class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            @click="executeDeleteMesa"
            :disabled="mesasStore.loading"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMesasStore } from 'stores/mesasStore'
import { useAuthStore } from 'stores/authStore'

defineOptions({ name: 'MesasPage' })

const router = useRouter()
const mesasStore = useMesasStore()
const authStore = useAuthStore()

// ── User info ──
const displayName = computed(
  () => authStore.userProfile?.full_name ?? authStore.currentUser?.email ?? 'Manager',
)
const avatarInitial = computed(() => displayName.value.charAt(0).toUpperCase())
const isManager = computed(() => authStore.userRole === 2)

// ── Status config ──
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

// ── Status cycle ──
const STATUS_CYCLE = {
  available: 'occupied',
  occupied: 'cleaning',
  cleaning: 'available',
  reserved: 'available',
}

// ── Filter ──
const searchQuery = ref('')
const statusFilter = ref('all')

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'cleaning', label: 'Cleaning' },
  { key: 'reserved', label: 'Reserved' },
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

// ── Actions ──
const handleTableClick = async (table) => {
  const nextStatus = STATUS_CYCLE[table.status] ?? 'available'
  await mesasStore.updateTableStatus(table.id, nextStatus)
}

const openCajas = (table) => {
  router.push(`/cajas?mesaId=${table.id}&mesaNumber=${table.number}`)
}

// ── Manager CRUD ──
const mesaDialog = ref(false)
const editingMesa = ref(null)
const mesaForm = ref({ number: '', status: 'available' })

const openMesaDialog = (mesa = null) => {
  editingMesa.value = mesa
  mesaForm.value = mesa
    ? { number: mesa.number, status: mesa.status }
    : { number: '', status: 'available' }
  mesaDialog.value = true
}

const submitMesa = async () => {
  const companyId = authStore.userProfile?.company_id
  const payload = { ...mesaForm.value, company_id: companyId }
  const result = editingMesa.value
    ? await mesasStore.updateTable(editingMesa.value.id, payload)
    : await mesasStore.createTable(payload)
  if (result.success) mesaDialog.value = false
}

const deleteDialog = ref(false)
const deletingMesa = ref(null)

const confirmDeleteMesa = (mesa) => {
  deletingMesa.value = mesa
  deleteDialog.value = true
}

const executeDeleteMesa = async () => {
  const result = await mesasStore.deleteTable(deletingMesa.value.id)
  if (result.success) deleteDialog.value = false
}

// ── Init ──
onMounted(async () => {
  const companyId = authStore.userProfile?.company_id
  await mesasStore.fetchTables(companyId)
})
</script>

<style scoped>
/* Add any scoped styles if needed */
</style>
