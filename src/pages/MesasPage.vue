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
                class="block w-full rounded-full border-slate-100 bg-slate-100/50 py-2.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary border-none text-sm transition-all"
                placeholder="Search tables, orders, or items..."
                type="text"
              />
            </div>
            <div class="flex items-center gap-4 border-l border-slate-100 pl-8">
              <div class="flex flex-col items-end">
                <span class="text-sm font-bold text-slate-800">Alex Johnson</span>
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-widest"
                  >Floor Manager</span
                >
              </div>
              <div
                class="size-11 rounded-full border-2 border-white shadow-md bg-cover bg-center ring-1 ring-slate-100"
                style="
                  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCL2bi-JHmwuCQjNNte-MikvM2xi30fvth3-D9w52fjdH_YbPKhsBN_4iJ_J8oQsX0XyNVwHnqZtbKsmqdfw79I6RThkiMsyI-vkEaAEiy0XX2dHGlwocZ6YanI-bPyum9i8lFNhjwd4MifX3U3jVaGjOdo_elEcqUAWXBWpD2nhbMFwnKZ0kAAETCfFj4NU99DcrVuFzKy4npNRO79dSUULyrBHq1du5QNG2FmmERPjwPxrPprNyeoz_z911M-19Gwh1j4Hyh-_uc');
                "
              ></div>
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
              <a
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-primary transition-all group"
                href="#"
              >
                <span class="material-symbols-outlined group-hover:scale-110 transition-transform"
                  >settings</span
                >
                <span class="text-sm font-medium">Settings</span>
              </a>
            </nav>
            <div class="mt-auto p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <div class="flex items-center gap-2 mb-2 text-primary">
                <span class="material-symbols-outlined text-sm">info</span>
                <span class="text-[10px] font-bold uppercase tracking-widest">System Status</span>
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                Server is synced. 14 tables currently active across all zones.
              </p>
            </div>
          </aside>
          <main class="flex-1 overflow-y-auto p-10">
            <div class="max-w-7xl mx-auto space-y-12">
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 class="text-3xl font-bold text-slate-900">Table Management</h1>
                  <p class="text-slate-400 mt-1 font-medium">Live overview of the dining floor</p>
                </div>
                <div class="flex bg-slate-100 p-1.5 rounded-xl self-start">
                  <button
                    class="px-5 py-2 rounded-lg bg-white text-slate-800 font-bold text-xs shadow-sm"
                  >
                    All Zones
                  </button>
                  <button
                    class="px-5 py-2 rounded-lg text-slate-500 font-bold text-xs hover:text-primary transition-colors"
                  >
                    Main Floor
                  </button>
                  <button
                    class="px-5 py-2 rounded-lg text-slate-500 font-bold text-xs hover:text-primary transition-colors"
                  >
                    Terrace
                  </button>
                  <button
                    class="px-5 py-2 rounded-lg text-slate-500 font-bold text-xs hover:text-primary transition-colors"
                  >
                    VIP Lounge
                  </button>
                </div>
              </div>
              <section class="space-y-6">
                <div class="flex items-center gap-4">
                  <h2 class="text-lg font-bold text-slate-800 whitespace-nowrap">Main Floor</h2>
                  <div class="h-[1px] w-full bg-slate-200"></div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    >4 Tables</span
                  >
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div
                    class="bg-bg-card rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-available text-status-available-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">table_bar</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-available text-status-available-text border border-status-available-text/10"
                        >Available</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3
                        class="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors"
                      >
                        Table 01
                      </h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        4 Seats • Regular Area
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-slate-300 uppercase"
                        >Wait Time: 0M</span
                      >
                      <span class="material-symbols-outlined text-slate-300 text-lg"
                        >more_horiz</span
                      >
                    </div>
                  </div>
                  <div
                    class="bg-bg-card rounded-2xl border-2 border-status-occupied-text/10 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-occupied text-status-occupied-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">person</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-occupied text-status-occupied-text border border-status-occupied-text/10"
                        >Occupied</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-lg font-bold text-slate-800">Table 02</h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        2 Seats • Window Side
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-status-occupied-text uppercase"
                        >Active: 42M</span
                      >
                      <div class="flex -space-x-2">
                        <div class="size-6 rounded-full border-2 border-white bg-slate-200"></div>
                        <div class="size-6 rounded-full border-2 border-white bg-slate-300"></div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="bg-bg-card rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-available text-status-available-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">table_restaurant</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-available text-status-available-text border border-status-available-text/10"
                        >Available</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3
                        class="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors"
                      >
                        Table 03
                      </h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        6 Seats • Family Section
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-slate-300 uppercase"
                        >Wait Time: 0M</span
                      >
                      <span class="material-symbols-outlined text-slate-300 text-lg"
                        >more_horiz</span
                      >
                    </div>
                  </div>
                  <div
                    class="bg-bg-card rounded-2xl border-2 border-status-occupied-text/10 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-occupied text-status-occupied-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">group</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-occupied text-status-occupied-text border border-status-occupied-text/10"
                        >Occupied</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-lg font-bold text-slate-800">Table 04</h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        8 Seats • Private Booth
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-status-occupied-text uppercase"
                        >Active: 1H 15M</span
                      >
                      <div class="flex -space-x-2">
                        <div class="size-6 rounded-full border-2 border-white bg-slate-200"></div>
                        <div class="size-6 rounded-full border-2 border-white bg-slate-300"></div>
                        <div class="size-6 rounded-full border-2 border-white bg-slate-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section class="space-y-6">
                <div class="flex items-center gap-4">
                  <h2 class="text-lg font-bold text-slate-800 whitespace-nowrap">Terrace</h2>
                  <div class="h-[1px] w-full bg-slate-200"></div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    >3 Tables</span
                  >
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div
                    class="bg-bg-card rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-available text-status-available-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">table_bar</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-available text-status-available-text border border-status-available-text/10"
                        >Available</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3
                        class="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors"
                      >
                        Table 05
                      </h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        2 Seats • Bar Counter
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-slate-300 uppercase"
                        >Wait Time: 0M</span
                      >
                      <span class="material-symbols-outlined text-slate-300 text-lg"
                        >more_horiz</span
                      >
                    </div>
                  </div>
                  <div
                    class="bg-bg-card rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-available text-status-available-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">table_bar</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-available text-status-available-text border border-status-available-text/10"
                        >Available</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3
                        class="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors"
                      >
                        Table 06
                      </h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        2 Seats • Bar Counter
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-slate-300 uppercase"
                        >Wait Time: 0M</span
                      >
                      <span class="material-symbols-outlined text-slate-300 text-lg"
                        >more_horiz</span
                      >
                    </div>
                  </div>
                  <div
                    class="bg-bg-card rounded-2xl border-2 border-status-cleaning-text/10 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-cleaning text-status-cleaning-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">cleaning_services</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-cleaning text-status-cleaning-text border border-status-cleaning-text/10"
                        >Cleaning</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-lg font-bold text-slate-800">Table 08</h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        4 Seats • Regular Area
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-status-cleaning-text uppercase"
                        >Since: 3M</span
                      >
                      <span class="material-symbols-outlined text-slate-300 text-lg"
                        >more_horiz</span
                      >
                    </div>
                  </div>
                </div>
              </section>
              <section class="space-y-6 pb-8">
                <div class="flex items-center gap-4">
                  <h2 class="text-lg font-bold text-slate-800 whitespace-nowrap">VIP Lounge</h2>
                  <div class="h-[1px] w-full bg-slate-200"></div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    >1 Table</span
                  >
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div
                    class="bg-bg-card rounded-2xl border-2 border-status-occupied-text/10 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div class="flex justify-between items-start mb-6">
                      <div
                        class="size-12 rounded-xl bg-status-occupied text-status-occupied-text flex items-center justify-center"
                      >
                        <span class="material-symbols-outlined text-3xl">person</span>
                      </div>
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-status-occupied text-status-occupied-text border border-status-occupied-text/10"
                        >Occupied</span
                      >
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-lg font-bold text-slate-800">Table 07</h3>
                      <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        4 Seats • Regular Area
                      </p>
                    </div>
                    <div
                      class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center"
                    >
                      <span class="text-[10px] font-bold text-status-occupied-text uppercase"
                        >Active: 12M</span
                      >
                      <div class="flex -space-x-2">
                        <div class="size-6 rounded-full border-2 border-white bg-slate-200"></div>
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
              <span>Available: 12</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div
                class="size-2 rounded-full bg-status-occupied-text shadow-[0_0_8px_rgba(239,83,80,0.3)]"
              ></div>
              <span>Occupied: 14</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div
                class="size-2 rounded-full bg-status-cleaning-text shadow-[0_0_8px_rgba(255,160,0,0.3)]"
              ></div>
              <span>Reserved: 2</span>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <span class="text-slate-300">V2.4.0 Stable</span>
            <span class="text-primary/70">Last synced: Just now</span>
          </div>
        </footer>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { defineOptions } from 'vue'
defineOptions({ name: 'MesasPage' })
</script>

<style scoped>
/* Add any scoped styles if needed */
</style>
