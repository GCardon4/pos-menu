<template>
  <q-page class="flex-1 overflow-y-auto scrollbar-hide">
    <!-- Top Navbar -->
    <div
      class="sticky top-0 z-10 flex items-center justify-between px-8 py-6/80/80 backdrop-blur-md border-b border-primary/10"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Manager Dashboard</h1>
        <p class="text-sm">Live operational overview</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex bg-primary/5 p-1 rounded-xl border border-primary/10">
          <button
            class="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-background-dark transition-all"
          >
            Today
          </button>
          <button
            class="px-4 py-1.5 rounded-lg text-sm font-medium hover:text-primary transition-all"
          >
            Yesterday
          </button>
          <button
            class="px-4 py-1.5 rounded-lg text-sm font-medium hover:text-primary transition-all"
          >
            Last 7 Days
          </button>
        </div>
        <button
          class="flex items-center justify-center p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 transition-colors"
        >
          <span class="material-symbols-outlined">calendar_today</span>
        </button>
        <button
          class="flex items-center justify-center p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 transition-colors"
        >
          <span class="material-symbols-outlined">tune</span>
        </button>
      </div>
    </div>
    <div class="p-8 space-y-8 max-w-[1600px] mx-auto">
      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10 neon-glow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <span class="text-xs font-bold text-primary flex items-center"
              >+12.5% <span class="material-symbols-outlined text-[14px]">trending_up</span></span
            >
          </div>
          <p class="text-slate-500 text-sm font-medium">Daily Revenue</p>
          <h3 class="text-3xl font-bold mt-1">$4,250.00</h3>
        </div>
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">table_restaurant</span>
            </div>
            <span class="text-xs font-bold">72% Occ.</span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Active Tables</p>
          <h3 class="text-3xl font-bold mt-1">18/25</h3>
          <div class="w-full bg-primary/10 h-1.5 rounded-full mt-4">
            <div class="bg-primary h-full rounded-full" style="width: 72%"></div>
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">receipt</span>
            </div>
            <span class="text-xs font-bold text-rose-500 flex items-center"
              >-2.1% <span class="material-symbols-outlined text-[14px]">trending_down</span></span
            >
          </div>
          <p class="text-slate-500 text-sm font-medium">Avg Ticket Size</p>
          <h3 class="text-3xl font-bold mt-1">$64.50</h3>
        </div>
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <span class="material-symbols-outlined">person_add</span>
            </div>
            <span class="text-xs font-bold text-primary flex items-center"
              >+5.0% <span class="material-symbols-outlined text-[14px]">trending_up</span></span
            >
          </div>
          <p class="text-slate-500 text-sm font-medium">New Guests</p>
          <h3 class="text-3xl font-bold mt-1">12</h3>
        </div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Hourly Sales Chart Placeholder -->
        <div
          class="xl:col-span-2 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col"
        >
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-bold">Hourly Sales Performance</h3>
              <p class="text-sm">Revenue distribution by hour</p>
            </div>
            <div class="flex gap-2">
              <span class="flex items-center gap-2 text-xs font-medium">
                <span class="size-2 rounded-full bg-primary"></span> Today
              </span>
              <span class="flex items-center gap-2 text-xs font-medium">
                <span class="size-2 rounded-full bg-primary/20"></span> Yesterday
              </span>
            </div>
          </div>
          <div class="flex-1 flex items-end gap-2 h-64 min-h-[250px] px-2">
            <!-- Simulated Chart Bars -->
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[20%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[60%] opacity-80 group-hover:opacity-100 transition-all"
              ></div>
            </div>
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[30%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[40%] opacity-80 group-hover:opacity-100 transition-all"
              ></div>
            </div>
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[45%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[75%] opacity-80 group-hover:opacity-100 transition-all"
              ></div>
            </div>
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[60%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[85%] opacity-80 group-hover:opacity-100 transition-all"
              ></div>
            </div>
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[80%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[95%] opacity-80 group-hover:opacity-100 transition-all border-t-2 border-primary"
              ></div>
            </div>
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[70%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[60%] opacity-80 group-hover:opacity-100 transition-all"
              ></div>
            </div>
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[50%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[40%] opacity-80 group-hover:opacity-100 transition-all"
              ></div>
            </div>
            <div class="flex-1 bg-primary/10 rounded-t-lg h-[40%] relative group">
              <div
                class="absolute bottom-0 w-full bg-primary rounded-t-lg h-[30%] opacity-80 group-hover:opacity-100 transition-all"
              ></div>
            </div>
          </div>
          <div
            class="flex justify-between mt-4 text-[10px] uppercase tracking-widest font-bold px-2"
          >
            <span>10am</span><span>12pm</span><span>2pm</span><span>4pm</span><span>6pm</span
            ><span>8pm</span><span>10pm</span><span>12am</span>
          </div>
        </div>
        <!-- Category Breakdown -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h3 class="text-lg font-bold mb-1">Category Breakdown</h3>
          <p class="text-sm mb-8">Sales by department</p>
          <div class="relative size-48 mx-auto mb-8">
            <svg class="size-full -rotate-90" viewbox="0 0 36 36">
              <path
                class="text-primary/10"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                stroke-dasharray="100, 100"
                stroke-width="4"
              ></path>
              <path
                class="text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                stroke-dasharray="65, 100"
                stroke-linecap="round"
                stroke-width="4"
              ></path>
              <path
                class="text-primary/40"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                stroke-dasharray="35, 100"
                stroke-dashoffset="-65"
                stroke-linecap="round"
                stroke-width="4"
              ></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold">$4.2k</span>
              <span class="text-[10px] uppercase tracking-tighter">Total Sales</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="size-3 rounded-full bg-primary"></span>
                <span class="text-sm font-medium">Food</span>
              </div>
              <span class="text-sm font-bold">$2,762 (65%)</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="size-3 rounded-full bg-primary/40"></span>
                <span class="text-sm font-medium">Drinks</span>
              </div>
              <span class="text-sm font-bold">$1,488 (35%)</span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Performing Tables -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold">Top Performing Tables</h3>
            <button class="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] uppercase tracking-widest border-b border-primary/10">
                  <th class="pb-3 font-bold">Table No.</th>
                  <th class="pb-3 font-bold">Primary Server</th>
                  <th class="pb-3 font-bold">Total Sales</th>
                  <th class="pb-3 font-bold text-right">Trend</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5">
                <tr class="group hover:bg-primary/5 transition-colors">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs"
                      >
                        T-12
                      </div>
                      <span class="font-medium">Main Hall</span>
                    </div>
                  </td>
                  <td class="py-4 text-sm">Elena S.</td>
                  <td class="py-4 font-bold text-primary">$842.50</td>
                  <td class="py-4 text-right">
                    <span class="material-symbols-outlined text-primary">trending_up</span>
                  </td>
                </tr>
                <tr class="group hover:bg-primary/5 transition-colors">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs"
                      >
                        T-04
                      </div>
                      <span class="font-medium">Window Side</span>
                    </div>
                  </td>
                  <td class="py-4 text-sm">Marcus L.</td>
                  <td class="py-4 font-bold text-primary">$612.00</td>
                  <td class="py-4 text-right">
                    <span class="material-symbols-outlined text-primary">trending_up</span>
                  </td>
                </tr>
                <tr class="group hover:bg-primary/5 transition-colors">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs"
                      >
                        T-22
                      </div>
                      <span class="font-medium">Terrace</span>
                    </div>
                  </td>
                  <td class="py-4 text-sm">Sarah W.</td>
                  <td class="py-4 font-bold text-primary">$589.20</td>
                  <td class="py-4 text-right">
                    <span class="material-symbols-outlined">horizontal_rule</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Service Hotspots / Floor Status -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold">Service Hotspots</h3>
            <div class="flex gap-2">
              <span
                class="px-2 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                >Lounge</span
              >
              <span
                class="px-2 py-1 rounded text-[10px] bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse"
                >Kitchen</span
              >
            </div>
          </div>
          <!-- Map Grid Layout -->
          <div
            class="grid grid-cols-5 gap-3 h-64 border border-primary/5 rounded-xl p-4 bg-background-dark/30"
          >
            <!-- Simulated Floor Plan Tables -->
            <div
              class="bg-primary/40 rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary/50 text-background-dark"
            >
              01
            </div>
            <div
              class="bg-primary rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary shadow-[0_0_10px_rgba(17,212,196,0.5)] text-background-dark"
            >
              02
            </div>
            <div
              class="bg-primary/10 rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary/20"
            >
              03
            </div>
            <div
              class="bg-primary/40 rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary/50 text-background-dark"
            >
              04
            </div>
            <div
              class="bg-primary rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary shadow-[0_0_10px_rgba(17,212,196,0.5)] text-background-dark"
            >
              05
            </div>
            <div
              class="col-span-2 row-span-2 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/40 relative group"
            >
              <span class="text-[10px] font-bold text-rose-500">BAR AREA</span>
              <div
                class="absolute -top-2 -right-2 bg-rose-500 size-4 rounded-full flex items-center justify-center animate-bounce shadow-lg"
              >
                <span class="material-symbols-outlined text-[10px] text-white">priority_high</span>
              </div>
            </div>
            <div
              class="bg-primary/40 rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary/50 text-background-dark"
            >
              06
            </div>
            <div
              class="bg-primary/10 rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary/20"
            >
              07
            </div>
            <div
              class="bg-primary/10 rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary/20"
            >
              08
            </div>
            <div
              class="bg-primary rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary shadow-[0_0_10px_rgba(17,212,196,0.5)] text-background-dark"
            >
              09
            </div>
            <div
              class="bg-primary/40 rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary/50 text-background-dark"
            >
              10
            </div>
            <div
              class="bg-primary rounded-lg flex items-center justify-center text-[10px] font-bold border border-primary shadow-[0_0_10px_rgba(17,212,196,0.5)] text-background-dark"
            >
              11
            </div>
          </div>
          <div class="mt-6 flex gap-6">
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full bg-primary shadow-[0_0_5px_rgba(17,212,196,0.8)]"
              ></span>
              <span class="text-xs">Active Service</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-primary/40"></span>
              <span class="text-xs">Ordered</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-primary/10"></span>
              <span class="text-xs">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({ name: 'ManagerDashboard' })
</script>

<style scoped>
.chart-gradient {
  background: linear-gradient(180deg, rgba(17, 212, 196, 0.2) 0%, rgba(17, 212, 196, 0) 100%);
}
.neon-glow {
  box-shadow: 0 0 15px rgba(17, 212, 196, 0.15);
}
</style>
