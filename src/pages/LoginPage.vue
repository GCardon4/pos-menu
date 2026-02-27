<template>
  <div
    class="bg-background-dark min-h-screen flex items-center justify-center p-4 font-sans text-white"
  >
    <!-- Main Card -->
    <div
      class="max-w-md w-full bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
    >
      <!-- Card Header -->
      <div
        class="bg-slate-900 border-b border-slate-700 p-8 text-center flex flex-col items-center"
      >
        <div
          class="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        >
          <span class="material-symbols-outlined text-4xl">restaurant_menu</span>
        </div>
        <h1 class="text-3xl font-black tracking-tight text-white">POS Menu</h1>
        <p class="text-slate-400 mt-2 text-sm">Sign in to manage tables and orders</p>
      </div>

      <!-- Card Body -->
      <div class="p-8 space-y-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-sm font-bold text-slate-300 mb-1.5" for="email">Email</label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined"
                >mail</span
              >
              <input
                id="email"
                v-model="email"
                type="email"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                placeholder="admin@posmenu.com"
                required
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-sm font-bold text-slate-300" for="password">Password</label>
              <a
                href="#"
                class="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                >Forgot Pwd?</a
              >
            </div>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined"
                >lock</span
              >
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-12 text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <span class="material-symbols-outlined">{{
                  showPassword ? 'visibility_off' : 'visibility'
                }}</span>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-primary text-slate-900 py-4 mt-8 rounded-xl font-bold uppercase tracking-wide hover:bg-primary-dark shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined">login</span>
            Access System
          </button>
        </form>
      </div>

      <!-- Card Footer -->
      <div class="bg-slate-900/50 p-4 border-t border-slate-700 text-center">
        <p class="text-xs text-slate-500">Secure connection via Quasar App</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  console.log('Login attempt:', email.value)
  // Logic hook for future auth
}
</script>

<style scoped>
/* Scoped css if necessary */
</style>
