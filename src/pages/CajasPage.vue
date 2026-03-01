<template>
  <div class="bg-background-light text-slate-900 overflow-hidden h-screen flex flex-col font-sans">
    <header
      class="flex items-center justify-between border-b border-slate-300 bg-white px-6 py-3 shrink-0"
    >
      <div class="flex items-center gap-4">
        <div class="bg-primary p-2 rounded-lg text-slate-900 shadow-sm shadow-primary/20">
          <span class="material-symbols-outlined">restaurant</span>
        </div>
        <div>
          <h2 class="text-xl font-bold tracking-tight">
            <span v-if="mesaNumber">
              Table {{ String(mesaNumber).padStart(2, '0') }}
              <span class="text-sm font-normal text-slate-500 ml-2">Dine-in</span>
            </span>
            <span v-else>Walk-in <span class="text-sm font-normal text-slate-500 ml-2">Sin mesa</span></span>
          </h2>
          <p class="text-xs text-slate-500">Server: {{ displayName }} • {{ currentTime }}</p>
        </div>
      </div>
      <div class="flex items-center gap-4 flex-1 justify-end">
        <label class="relative flex items-center w-full max-w-md">
          <span class="absolute left-3 text-slate-400 material-symbols-outlined">search</span>
          <input
            v-model="searchQuery"
            class="w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            placeholder="Search menu items..."
            type="text"
          />
        </label>
        <button
          @click="goBack"
          class="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors"
          title="Volver a Mesas"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
      </div>
    </header>

    <main class="flex flex-1 overflow-hidden">
      <!-- Cart Panel -->
      <aside class="w-1/3 flex flex-col border-r border-slate-300 bg-sidebar-light">
        <div class="p-4 border-b border-slate-300 flex justify-between items-center bg-white/50">
          <h3 class="font-bold text-lg uppercase tracking-wider text-slate-800">Current Order</h3>
          <span class="bg-slate-900 text-white text-xs px-2 py-1 rounded font-bold">
            {{ posStore.cartItemCount }} ITEMS
          </span>
        </div>

        <!-- Empty cart -->
        <div
          v-if="posStore.cart.length === 0"
          class="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3"
        >
          <span class="material-symbols-outlined text-5xl">shopping_cart</span>
          <p class="text-sm font-medium">No items in cart</p>
          <p class="text-xs">Select a product to add</p>
        </div>

        <!-- Cart items -->
        <div v-else class="flex-1 overflow-y-auto p-4 space-y-3">
          <div
            v-for="item in posStore.cart"
            :key="item.product.id"
            class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-slate-900 font-bold shadow-sm shrink-0"
              >
                {{ item.qty }}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-800 truncate">{{ item.product.name }}</p>
                <p class="text-xs text-slate-500">
                  ${{ Number(item.product.price).toFixed(2) }} × {{ item.qty }}
                </p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-bold text-slate-900">${{ Number(item.subtotal).toFixed(2) }}</p>
              <div class="flex items-center gap-1 mt-1 justify-end">
                <button
                  @click="posStore.updateQty(item.product.id, item.qty - 1)"
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  remove
                </button>
                <button
                  @click="posStore.updateQty(item.product.id, item.qty + 1)"
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  add
                </button>
                <button
                  @click="posStore.removeFromCart(item.product.id)"
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                >
                  delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals + actions -->
        <div class="p-4 bg-white border-t border-slate-300">
          <div class="flex justify-between text-sm mb-1 text-slate-500">
            <span>Subtotal</span>
            <span>${{ Number(posStore.cartTotal).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-2xl font-bold mb-4">
            <span>Total</span>
            <span class="text-slate-900">${{ Number(posStore.cartTotal).toFixed(2) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="posStore.clearCart()"
              class="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 py-4 rounded-xl font-bold uppercase text-sm hover:bg-slate-300 transition-colors border border-slate-300"
            >
              <span class="material-symbols-outlined text-lg">close</span> Clear
            </button>
            <button
              @click="sendOrder"
              :disabled="posStore.cart.length === 0"
              class="flex items-center justify-center gap-2 bg-slate-900 text-primary py-4 rounded-xl font-bold uppercase text-sm hover:bg-black transition-colors border border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="material-symbols-outlined text-lg">send</span> Send Order
            </button>
          </div>
        </div>
      </aside>

      <!-- Products Panel -->
      <section class="flex-1 flex flex-col bg-background-light">
        <!-- Loading -->
        <div
          v-if="posStore.loading"
          class="flex-1 flex items-center justify-center text-slate-400"
        >
          <span class="material-symbols-outlined text-primary text-5xl animate-spin"
            >progress_activity</span
          >
        </div>

        <template v-else>
          <!-- Products Grid -->
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Empty search result -->
            <div
              v-if="filteredProducts.length === 0"
              class="flex flex-col items-center justify-center h-full text-slate-300 gap-3"
            >
              <span class="material-symbols-outlined text-5xl">search_off</span>
              <p class="font-medium">No products found</p>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <button
                v-for="product in filteredProducts"
                :key="product.id"
                @click="selectProduct(product)"
                :class="[
                  'group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm transition-all p-4 text-left',
                  selectedProduct?.id === product.id
                    ? 'border-4 border-primary ring-4 ring-primary/10 shadow-md'
                    : 'border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30',
                ]"
              >
                <div class="flex flex-col h-full justify-between">
                  <div>
                    <h4 class="font-bold text-lg leading-tight mb-1 group-hover:text-slate-900">
                      {{ product.name }}
                    </h4>
                    <p v-if="product.sku" class="text-xs text-slate-500">SKU: {{ product.sku }}</p>
                    <p v-if="product.stock !== null && product.stock !== undefined" class="text-xs text-slate-400 mt-0.5">
                      Stock: {{ product.stock }}
                    </p>
                  </div>
                  <p class="font-bold text-xl text-slate-900">
                    ${{ Number(product.price).toFixed(2) }}
                  </p>
                </div>
                <!-- In cart indicator -->
                <div
                  v-if="getCartQty(product.id) > 0"
                  class="absolute top-2 right-2 bg-primary text-slate-900 rounded px-2 py-0.5 text-[10px] font-bold shadow-sm"
                >
                  ×{{ getCartQty(product.id) }}
                </div>
              </button>
            </div>
          </div>

          <!-- Quick Action Bar -->
          <div
            class="p-4 bg-white/80 backdrop-blur-md border-t border-slate-300 flex items-center justify-between gap-6 shrink-0 z-10"
          >
            <div
              class="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl shadow-inner border border-slate-200"
            >
              <button
                @click="selectedQty > 1 ? selectedQty-- : null"
                class="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <span class="material-symbols-outlined text-3xl">remove</span>
              </button>
              <div class="px-6 text-center">
                <p class="text-xs text-slate-500 font-bold uppercase mb-1">QTY</p>
                <p class="text-3xl font-black text-slate-900">{{ selectedQty }}</p>
              </div>
              <button
                @click="selectedQty++"
                class="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all shadow-sm"
              >
                <span class="material-symbols-outlined text-3xl">add</span>
              </button>
            </div>
            <div class="flex gap-4 flex-1">
              <div
                class="flex-1 flex flex-col items-center justify-center gap-1 bg-slate-50 border border-slate-200 h-20 rounded-2xl text-xs text-slate-400 font-bold uppercase"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ selectedProduct ? 'check_circle' : 'touch_app' }}
                </span>
                {{ selectedProduct ? selectedProduct.name.substring(0, 14) : 'Select item' }}
              </div>
              <button
                @click="addToOrder"
                :disabled="!selectedProduct"
                class="flex-[2] bg-primary text-slate-900 h-20 rounded-2xl font-black text-lg uppercase shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="material-symbols-outlined text-3xl font-bold"
                  >shopping_cart_checkout</span
                >
                ADD TO ORDER
              </button>
            </div>
          </div>
        </template>
      </section>
    </main>
    <div class="fixed bottom-0 left-0 h-1 bg-primary w-1/3"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosStore } from 'stores/posStore'
import { useAuthStore } from 'stores/authStore'

defineOptions({ name: 'CajasPage' })

const route = useRoute()
const router = useRouter()
const posStore = usePosStore()
const authStore = useAuthStore()

// ── Mesa info from route query ──
const mesaId = computed(() => route.query.mesaId ?? null)
const mesaNumber = computed(() => route.query.mesaNumber ?? null)

// ── User info ──
const displayName = computed(
  () => authStore.userProfile?.full_name ?? authStore.currentUser?.email ?? 'Staff',
)

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
})

// ── Product selection ──
const searchQuery = ref('')
const selectedProduct = ref(null)
const selectedQty = ref(1)

const filteredProducts = computed(() => {
  if (!searchQuery.value) return posStore.products
  const q = searchQuery.value.toLowerCase()
  return posStore.products.filter((p) => p.name.toLowerCase().includes(q))
})

const selectProduct = (product) => {
  selectedProduct.value = product
  selectedQty.value = 1
}

const getCartQty = (productId) => {
  const item = posStore.cart.find((i) => i.product.id === productId)
  return item?.qty ?? 0
}

const addToOrder = () => {
  if (!selectedProduct.value) return
  posStore.addToCart(selectedProduct.value, selectedQty.value)
  selectedQty.value = 1
}

// ── Order ──
const sendOrder = async () => {
  if (!posStore.cart.length) return
  await posStore.createTransaction(mesaId.value)
}

// ── Navigation ──
const goBack = () => {
  const role = authStore.userRole
  if (role === 3) {
    router.push('/mesas')
  } else {
    router.back()
  }
}

// ── Init ──
onMounted(async () => {
  await posStore.fetchProducts()
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ccff00;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
