<template>
  <q-page class="flex-1 overflow-y-auto scrollbar-hide">

    <!-- ── HEADER ── -->
    <div class="sticky top-0 z-10 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-primary/10 bg-background-light/90">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Bodega</h1>
        <p class="text-sm text-slate-500">Control de inventario y productos</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
          <input
            v-model="search"
            type="text"
            placeholder="Nombre o SKU..."
            class="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none w-64 transition-all"
          />
        </div>

        <!-- Filter chips -->
        <div class="flex bg-primary/5 p-1 rounded-xl border border-primary/10 gap-1">
          <button
            v-for="f in FILTERS"
            :key="f.key"
            @click="activeFilter = f.key"
            :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', activeFilter === f.key ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500 hover:text-primary']"
          >
            {{ f.label }}
            <span v-if="f.count !== undefined" class="ml-1 opacity-70">({{ f.count }})</span>
          </button>
        </div>

        <!-- Nuevo producto -->
        <button
          @click="openDialog()"
          class="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark shadow-sm transition-all"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          Nuevo producto
        </button>
      </div>
    </div>

    <div class="px-8 py-6 space-y-6 max-w-[1600px] mx-auto">

      <!-- ── STATS ── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div class="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <span class="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium">Total productos</p>
            <h3 class="text-2xl font-black text-slate-800">{{ posStore.products.length }}</h3>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4">
          <div class="p-2.5 rounded-xl bg-amber-100 text-amber-600 shrink-0">
            <span class="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <p class="text-xs text-amber-600 font-medium">Bajo stock (≤ 10)</p>
            <h3 class="text-2xl font-black text-amber-700">{{ lowStockCount }}</h3>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4">
          <div class="p-2.5 rounded-xl bg-red-100 text-red-500 shrink-0">
            <span class="material-symbols-outlined text-2xl">remove_shopping_cart</span>
          </div>
          <div>
            <p class="text-xs text-red-500 font-medium">Sin stock</p>
            <h3 class="text-2xl font-black text-red-600">{{ outOfStockCount }}</h3>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
          <div class="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
            <span class="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div>
            <p class="text-xs text-emerald-600 font-medium">Valor inventario</p>
            <h3 class="text-xl font-black text-emerald-700">{{ formatCurrencyShort(inventoryValue) }}</h3>
          </div>
        </div>
      </div>

      <!-- ── TABLE ── -->
      <div class="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">

        <!-- Table header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-slate-800">
            Productos
            <span class="ml-2 text-sm font-normal text-slate-400">{{ filteredProducts.length }} resultado(s)</span>
          </h3>
          <button
            @click="posStore.fetchProducts()"
            :class="['p-2 rounded-lg border transition-colors bg-slate-50 border-slate-200 text-slate-400 hover:text-primary hover:border-primary', posStore.loading ? 'animate-spin' : '']"
            title="Refrescar"
          >
            <span class="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="posStore.loading" class="flex items-center justify-center py-16">
          <span class="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
          <span class="material-symbols-outlined text-5xl mb-3">inventory_2</span>
          <p class="font-medium">Sin productos</p>
          <p class="text-sm mt-1">{{ search ? 'No se encontraron coincidencias' : 'Agrega tu primer producto' }}</p>
        </div>

        <!-- Products table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th class="px-6 py-4">Producto</th>
                <th class="px-6 py-4">SKU</th>
                <th class="px-6 py-4 text-right">Costo</th>
                <th class="px-6 py-4 text-right">Precio</th>
                <th class="px-6 py-4 text-right">Margen</th>
                <th class="px-6 py-4 text-center">Stock</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-slate-50 transition-colors group"
              >
                <!-- Nombre -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-lg">package_2</span>
                    </div>
                    <span class="font-semibold text-slate-800">{{ product.name }}</span>
                  </div>
                </td>

                <!-- SKU -->
                <td class="px-6 py-4">
                  <span v-if="product.sku" class="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                    {{ product.sku }}
                  </span>
                  <span v-else class="text-slate-300 text-xs">—</span>
                </td>

                <!-- Costo -->
                <td class="px-6 py-4 text-right text-sm text-slate-600">
                  {{ product.cost != null ? formatCurrency(product.cost) : '—' }}
                </td>

                <!-- Precio -->
                <td class="px-6 py-4 text-right font-semibold text-slate-800">
                  {{ formatCurrency(product.price) }}
                </td>

                <!-- Margen -->
                <td class="px-6 py-4 text-right">
                  <span
                    v-if="product.cost != null && product.price != null"
                    :class="margin(product) >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'"
                    class="text-xs font-bold px-2 py-1 rounded-lg"
                  >
                    {{ margin(product) >= 0 ? '+' : '' }}{{ margin(product).toFixed(0) }}%
                  </span>
                  <span v-else class="text-slate-300 text-xs">—</span>
                </td>

                <!-- Stock con ajuste rápido -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="posStore.adjustStock(product.id, -1)"
                      :disabled="(product.stock ?? 0) <= 0 || posStore.loadingProduct"
                      class="size-7 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined text-sm">remove</span>
                    </button>

                    <span
                      :class="[
                        'w-14 text-center font-black text-base rounded-lg px-2 py-1',
                        (product.stock ?? 0) === 0
                          ? 'bg-red-100 text-red-600'
                          : (product.stock ?? 0) <= 10
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700',
                      ]"
                    >
                      {{ product.stock ?? 0 }}
                    </span>

                    <button
                      @click="posStore.adjustStock(product.id, +1)"
                      :disabled="posStore.loadingProduct"
                      class="size-7 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <span class="material-symbols-outlined text-sm">add</span>
                    </button>

                    <!-- Ajuste masivo -->
                    <button
                      @click="openStockDialog(product)"
                      class="size-7 rounded-lg bg-slate-100 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-colors ml-1"
                      title="Ajuste de entrada"
                    >
                      <span class="material-symbols-outlined text-sm">input</span>
                    </button>
                  </div>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="openDialog(product)"
                      class="p-2 text-slate-400 hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      @click="confirmDelete(product)"
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

    <!-- ══════════════════════════════════════════════════════════
         DIALOG — CREAR / EDITAR PRODUCTO
    ══════════════════════════════════════════════════════════ -->
    <q-dialog v-model="productDialog" persistent>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-800">
              {{ editingProduct ? 'Editar producto' : 'Nuevo producto' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ editingProduct ? 'Modifica los datos del producto' : 'Agrega un nuevo producto al inventario' }}
            </p>
          </div>
          <button @click="productDialog = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="submitProduct" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Ej: Hamburguesa clásica"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

          <!-- SKU + Proveedor -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">SKU</label>
              <input
                v-model="form.sku"
                type="text"
                placeholder="Ej: BURG-001"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Proveedor</label>
              <input
                v-model="form.supplier_id"
                type="text"
                placeholder="Proveedor"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <!-- Costo + Precio -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Costo *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                <input
                  v-model.number="form.cost"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-7 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Precio venta *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                <input
                  v-model.number="form.price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-7 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Margen preview -->
          <div
            v-if="form.cost > 0 && form.price > 0"
            :class="previewMargin >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold"
          >
            <span class="material-symbols-outlined text-base">trending_up</span>
            Margen: {{ previewMargin >= 0 ? '+' : '' }}{{ previewMargin.toFixed(1) }}%
            ({{ formatCurrency(form.price - form.cost) }} por unidad)
          </div>

          <!-- Stock inicial -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Stock inicial</label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              placeholder="0"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="productDialog = false"
              class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="posStore.loadingProduct"
              class="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60"
            >
              {{ posStore.loadingProduct ? 'Guardando...' : editingProduct ? 'Guardar cambios' : 'Crear producto' }}
            </button>
          </div>
        </form>
      </div>
    </q-dialog>

    <!-- ══════════════════════════════════════════════════════════
         DIALOG — AJUSTE DE STOCK (ENTRADA)
    ══════════════════════════════════════════════════════════ -->
    <q-dialog v-model="stockDialog">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Ajuste de stock</h3>
            <p class="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{{ adjustingProduct?.name }}</p>
          </div>
          <button @click="stockDialog = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Stock actual -->
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mb-5">
          <span class="text-sm text-slate-500 font-medium">Stock actual</span>
          <span class="text-xl font-black text-slate-800">{{ adjustingProduct?.stock ?? 0 }}</span>
        </div>

        <form @submit.prevent="submitStockAdjust" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de ajuste</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="stockAdjust.type = 'add'"
                :class="['py-2.5 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-1.5', stockAdjust.type === 'add' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300']"
              >
                <span class="material-symbols-outlined text-base">add_circle</span> Entrada
              </button>
              <button
                type="button"
                @click="stockAdjust.type = 'subtract'"
                :class="['py-2.5 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-1.5', stockAdjust.type === 'subtract' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 text-slate-500 hover:border-slate-300']"
              >
                <span class="material-symbols-outlined text-base">remove_circle</span> Salida
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Cantidad</label>
            <input
              v-model.number="stockAdjust.qty"
              type="number"
              required
              min="1"
              placeholder="0"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

          <!-- Preview resultado -->
          <div v-if="stockAdjust.qty > 0" class="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
            <span class="text-sm text-slate-500">Nuevo stock</span>
            <span class="font-black text-lg text-slate-800">
              {{ stockAdjust.type === 'add'
                ? (adjustingProduct?.stock ?? 0) + (stockAdjust.qty ?? 0)
                : Math.max(0, (adjustingProduct?.stock ?? 0) - (stockAdjust.qty ?? 0)) }}
            </span>
          </div>

          <div class="flex gap-3 pt-1">
            <button
              type="button"
              @click="stockDialog = false"
              class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="posStore.loadingProduct || !stockAdjust.qty"
              :class="['flex-1 font-bold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60', stockAdjust.type === 'add' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white']"
            >
              {{ posStore.loadingProduct ? 'Aplicando...' : 'Aplicar ajuste' }}
            </button>
          </div>
        </form>
      </div>
    </q-dialog>

    <!-- ══════════════════════════════════════════════════════════
         DIALOG — CONFIRMAR ELIMINACIÓN
    ══════════════════════════════════════════════════════════ -->
    <q-dialog v-model="deleteDialog">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="bg-red-50 text-red-500 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">¿Eliminar producto?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Se eliminará permanentemente
          <span class="font-semibold text-slate-700">{{ deletingProduct?.name }}</span>.
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
            @click="executeDelete"
            :disabled="posStore.loadingProduct"
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
import { usePosStore } from 'stores/posStore'

defineOptions({ name: 'BodegaPage' })

const posStore = usePosStore()

// ── Computed stats ──
const lowStockCount  = computed(() => posStore.products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length)
const outOfStockCount = computed(() => posStore.products.filter(p => (p.stock ?? 0) === 0).length)
const inventoryValue  = computed(() => posStore.products.reduce((sum, p) => sum + ((p.cost ?? 0) * (p.stock ?? 0)), 0))

// ── Filters ──
const search = ref('')
const activeFilter = ref('all')

const FILTERS = computed(() => [
  { key: 'all',      label: 'Todos',      count: posStore.products.length },
  { key: 'low',      label: 'Bajo stock', count: lowStockCount.value },
  { key: 'out',      label: 'Sin stock',  count: outOfStockCount.value },
])

const filteredProducts = computed(() => {
  let list = posStore.products
  if (activeFilter.value === 'low') list = list.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10)
  if (activeFilter.value === 'out') list = list.filter(p => (p.stock ?? 0) === 0)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q))
  }
  return list
})

// ── Helpers ──
const margin = (p) => p.cost > 0 ? ((p.price - p.cost) / p.cost) * 100 : 0

const formatCurrency = (v) => {
  if (v == null) return '—'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
}

const formatCurrencyShort = (v) => {
  if (!v) return '$0'
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return `$${v.toFixed(0)}`
}

// ── Product dialog ──
const productDialog = ref(false)
const editingProduct = ref(null)
const form = ref({ name: '', sku: '', cost: '', price: '', stock: 0, supplier_id: '' })

const previewMargin = computed(() => {
  if (!form.value.cost || !form.value.price) return 0
  return ((form.value.price - form.value.cost) / form.value.cost) * 100
})

const openDialog = (product = null) => {
  editingProduct.value = product
  form.value = product
    ? { name: product.name, sku: product.sku ?? '', cost: product.cost ?? '', price: product.price ?? '', stock: product.stock ?? 0, supplier_id: product.supplier_id ?? '' }
    : { name: '', sku: '', cost: '', price: '', stock: 0, supplier_id: '' }
  productDialog.value = true
}

const submitProduct = async () => {
  const payload = {
    name: form.value.name,
    sku: form.value.sku || null,
    cost: form.value.cost || null,
    price: form.value.price,
    stock: form.value.stock ?? 0,
    supplier_id: form.value.supplier_id || null,
  }
  const result = editingProduct.value
    ? await posStore.updateProduct(editingProduct.value.id, payload)
    : await posStore.createProduct(payload)
  if (result.success) productDialog.value = false
}

// ── Stock adjustment dialog ──
const stockDialog = ref(false)
const adjustingProduct = ref(null)
const stockAdjust = ref({ type: 'add', qty: null })

const openStockDialog = (product) => {
  adjustingProduct.value = product
  stockAdjust.value = { type: 'add', qty: null }
  stockDialog.value = true
}

const submitStockAdjust = async () => {
  if (!stockAdjust.value.qty || stockAdjust.value.qty <= 0) return
  const delta = stockAdjust.value.type === 'add' ? stockAdjust.value.qty : -stockAdjust.value.qty
  const result = await posStore.adjustStock(adjustingProduct.value.id, delta)
  if (result.success) stockDialog.value = false
}

// ── Delete ──
const deleteDialog = ref(false)
const deletingProduct = ref(null)

const confirmDelete = (product) => {
  deletingProduct.value = product
  deleteDialog.value = true
}

const executeDelete = async () => {
  const result = await posStore.deleteProduct(deletingProduct.value.id)
  if (result.success) deleteDialog.value = false
}

// ── Init ──
onMounted(() => posStore.fetchProducts())
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
