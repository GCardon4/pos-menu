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
            Table 12 <span class="text-sm font-normal text-slate-500 ml-2">Dine-in</span>
          </h2>
          <p class="text-xs text-slate-500">Server: Alex Johnson • 14:32 PM</p>
        </div>
      </div>
      <div class="flex items-center gap-4 flex-1 justify-end">
        <label class="relative flex items-center w-full max-w-md">
          <span class="absolute left-3 text-slate-400 material-symbols-outlined">search</span>
          <input
            class="w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            placeholder="Search menu items..."
            type="text"
          />
        </label>
        <button
          class="flex items-center gap-2 bg-primary text-slate-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shrink-0 shadow-sm"
        >
          <span class="material-symbols-outlined">mic</span>
          VOICE SEARCH
        </button>
        <button
          class="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <span class="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>

    <main class="flex flex-1 overflow-hidden">
      <aside class="w-1/3 flex flex-col border-r border-slate-300 bg-sidebar-light">
        <div class="p-4 border-b border-slate-300 flex justify-between items-center bg-white/50">
          <h3 class="font-bold text-lg uppercase tracking-wider text-slate-800">Current Order</h3>
          <span class="bg-slate-900 text-white text-xs px-2 py-1 rounded font-bold">4 ITEMS</span>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Order Item 1 -->
          <div
            class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-slate-900 font-bold shadow-sm"
              >
                1
              </div>
              <div>
                <p class="font-bold text-slate-800">Margherita Pizza</p>
                <p class="text-xs text-slate-500">Extra Cheese, No Basil</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900">$12.50</p>
              <div class="flex items-center gap-1 mt-1">
                <button
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  edit
                </button>
                <button
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                >
                  delete
                </button>
              </div>
            </div>
          </div>

          <!-- Order Item 2 -->
          <div
            class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-slate-900 font-bold shadow-sm"
              >
                2
              </div>
              <div>
                <p class="font-bold text-slate-800">Craft Beer IPA</p>
                <p class="text-xs text-slate-500">Draft - 500ml</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900">$18.00</p>
              <div class="flex items-center gap-1 mt-1">
                <button
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  edit
                </button>
                <button
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                >
                  delete
                </button>
              </div>
            </div>
          </div>

          <!-- Order Item 3 -->
          <div
            class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-slate-900 font-bold shadow-sm"
              >
                1
              </div>
              <div>
                <p class="font-bold text-slate-800">Calamari Fritti</p>
                <p class="text-xs text-slate-500">Side of Tartar Sauce</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900">$14.00</p>
              <div class="flex items-center gap-1 mt-1">
                <button
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  edit
                </button>
                <button
                  class="material-symbols-outlined text-sm p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                >
                  delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-white border-t border-slate-300">
          <div class="flex justify-between text-sm mb-1 text-slate-500">
            <span>Subtotal</span>
            <span>$44.50</span>
          </div>
          <div class="flex justify-between text-sm mb-3 text-slate-500">
            <span>Tax (8%)</span>
            <span>$3.56</span>
          </div>
          <div class="flex justify-between text-2xl font-bold mb-4">
            <span>Total</span>
            <span class="text-slate-900">$48.06</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button
              class="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 py-4 rounded-xl font-bold uppercase text-sm hover:bg-slate-300 transition-colors border border-slate-300"
            >
              <span class="material-symbols-outlined text-lg">close</span> Clear
            </button>
            <button
              class="flex items-center justify-center gap-2 bg-slate-900 text-primary py-4 rounded-xl font-bold uppercase text-sm hover:bg-black transition-colors border border-slate-900"
            >
              <span class="material-symbols-outlined text-lg">send</span> Send Order
            </button>
          </div>
        </div>
      </aside>

      <section class="flex-1 flex flex-col bg-background-light">
        <!-- Categories -->
        <div class="p-4 flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide shrink-0">
          <button
            class="bg-primary text-slate-900 px-8 py-4 rounded-xl font-bold text-sm shadow-md shadow-primary/20 border-2 border-primary"
          >
            All Items
          </button>
          <button
            class="bg-white text-slate-600 border border-slate-300 px-8 py-4 rounded-xl font-bold text-sm hover:border-primary hover:text-slate-900 transition-all"
          >
            Appetizers
          </button>
          <button
            class="bg-white text-slate-600 border border-slate-300 px-8 py-4 rounded-xl font-bold text-sm hover:border-primary hover:text-slate-900 transition-all"
          >
            Main Course
          </button>
          <button
            class="bg-white text-slate-600 border border-slate-300 px-8 py-4 rounded-xl font-bold text-sm hover:border-primary hover:text-slate-900 transition-all"
          >
            Beverages
          </button>
          <button
            class="bg-white text-slate-600 border border-slate-300 px-8 py-4 rounded-xl font-bold text-sm hover:border-primary hover:text-slate-900 transition-all"
          >
            Desserts
          </button>
          <button
            class="bg-white text-slate-600 border border-slate-300 px-8 py-4 rounded-xl font-bold text-sm hover:border-primary hover:text-slate-900 transition-all"
          >
            Specials
          </button>
        </div>

        <!-- Products Grid -->
        <div class="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-160px)]">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all p-4 text-left"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1 group-hover:text-slate-900">
                    Margherita Pizza
                  </h4>
                  <p class="text-xs text-slate-500">Classic tomato &amp; mozzarella</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$12.50</p>
              </div>
            </button>

            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-md border-4 border-primary transition-all p-4 text-left ring-4 ring-primary/10"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1">Pepperoni Pizza</h4>
                  <p class="text-xs text-slate-500">Spicy cured pepperoni</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$14.50</p>
              </div>
              <div
                class="absolute top-2 right-2 bg-primary text-slate-900 rounded px-2 py-0.5 text-[10px] font-bold shadow-sm"
              >
                POPULAR
              </div>
            </button>

            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all p-4 text-left"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1">Garden Salad</h4>
                  <p class="text-xs text-slate-500">Fresh greens &amp; vinaigrette</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$9.00</p>
              </div>
            </button>

            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all p-4 text-left"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1">Garlic Knots</h4>
                  <p class="text-xs text-slate-500">6 pieces with marinara</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$6.50</p>
              </div>
            </button>

            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all p-4 text-left"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1">Iced Tea</h4>
                  <p class="text-xs text-slate-500">Sweetened or Unsweetened</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$3.50</p>
              </div>
            </button>

            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all p-4 text-left"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1">Cheese Burger</h4>
                  <p class="text-xs text-slate-500">Angus beef with cheddar</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$15.00</p>
              </div>
            </button>

            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all p-4 text-left"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1">Fries</h4>
                  <p class="text-xs text-slate-500">Large crinkle cut</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$5.00</p>
              </div>
            </button>

            <button
              class="group relative flex flex-col h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all p-4 text-left border-l-4 border-amber-500"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <h4 class="font-bold text-lg leading-tight mb-1">IPA Selection</h4>
                  <p class="text-xs text-slate-500">Rotating local taps</p>
                </div>
                <p class="font-bold text-xl text-slate-900">$9.00</p>
              </div>
              <div
                class="absolute top-2 right-2 bg-amber-100 text-amber-700 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight border border-amber-200"
              >
                Age Required
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
              class="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <span class="material-symbols-outlined text-3xl">remove</span>
            </button>
            <div class="px-6 text-center">
              <p class="text-xs text-slate-500 font-bold uppercase mb-1">QTY</p>
              <p class="text-3xl font-black text-slate-900">1</p>
            </div>
            <button
              class="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all shadow-sm"
            >
              <span class="material-symbols-outlined text-3xl">add</span>
            </button>
          </div>
          <div class="flex gap-4 flex-1">
            <button
              class="flex-1 flex flex-col items-center justify-center gap-1 bg-white border border-slate-300 h-20 rounded-2xl font-bold uppercase text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
            >
              <span class="material-symbols-outlined">notes</span>
              Add Note
            </button>
            <button
              class="flex-1 flex flex-col items-center justify-center gap-1 bg-white border border-slate-300 h-20 rounded-2xl font-bold uppercase text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
            >
              <span class="material-symbols-outlined">percent_discount</span>
              Promo
            </button>
            <button
              class="flex-[2] bg-primary text-slate-900 h-20 rounded-2xl font-black text-lg uppercase shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-primary"
            >
              <span class="material-symbols-outlined text-3xl font-bold"
                >shopping_cart_checkout</span
              >
              ADD TO ORDER
            </button>
          </div>
        </div>
      </section>
    </main>
    <div class="fixed bottom-0 left-0 h-1 bg-primary w-1/3"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Empty space for logic
})
</script>

<style scoped>
/* Scrollbar custom for the UI like Stitch had */
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
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
