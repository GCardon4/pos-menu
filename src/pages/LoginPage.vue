<template>
  <q-layout view="hHh LpR lFf">
    <q-page-container>
      <q-page class="bg-background-light dark:bg-background-dark font-display">
        <div
          class="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden"
        >
          <!-- Subtle Gradient Background Element -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"
          ></div>
          <!-- Top App Bar / Back Navigation -->
          <div class="flex items-center p-4 pb-2 justify-between z-10">
            <div
              class="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center cursor-pointer"
              data-icon="ArrowLeft"
            >
              <span class="material-symbols-outlined text-2xl">arrow_back_ios</span>
            </div>
            <h2
              class="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12"
            >
              Iniciar Sesión
            </h2>
          </div>
          <div class="flex flex-col flex-1 justify-center px-6 max-w-[480px] mx-auto w-full z-10">
            <!-- Logo Section -->
            <div class="flex justify-center mb-10">
              <div
                class="size-24 rounded-2xlflex items-center justify-center shadow-lg shadow-primary/30 overflow-hidden"
              >
                <div
                  class="w-full h-full bg-cover bg-center"
                  data-alt="Modern abstract minimalist app logo icon"
                  style="
                    background-image: url('/src/assets/icon-menu-pos.png');
                  "
                ></div>
              </div>
            </div>
            <div class="text-center mb-8">
              <h1
                class="text-slate-900 dark:text-slate-100 tracking-tight text-[32px] font-bold leading-tight pb-2"
              >
               Bienvenidos
              </h1>
              <p class="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                Ingresa los datos para acceder a tu cuenta
              </p>
            </div>
            <!-- Input Fields -->
            <div class="space-y-4">
              <label class="flex flex-col w-full">
                <p
                  class="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2 px-1"
                >
                  Email
                </p>
                <div
                  class="flex w-full items-stretch rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden focus-within:border-primary transition-colors"
                >
                  <div
                    class="text-slate-400 flex items-center justify-center pl-4 pr-2"
                    data-icon="Mail"
                  >
                    <span class="material-symbols-outlined">mail</span>
                  </div>
                  <input
                    v-model="email"
                    class="form-input flex w-full min-w-0 flex-1 border-none bg-transparent h-14 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 text-base font-normal px-2"
                    placeholder="name@example.com"
                    type="email"
                    @keyup.enter="handleLogin"
                  />
                </div>
              </label>
              <label class="flex flex-col w-full">
                <p
                  class="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2 px-1"
                >
                  Contraseña
                </p>
                <div
                  class="flex w-full items-stretch rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden focus-within:border-primary transition-colors"
                >
                  <div
                    class="text-slate-400 flex items-center justify-center pl-4 pr-2"
                    data-icon="Lock"
                  >
                    <span class="material-symbols-outlined">lock</span>
                  </div>
                  <input
                    v-model="password"
                    class="form-input flex w-full min-w-0 flex-1 border-none bg-transparent h-14 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 text-base font-normal px-2"
                    placeholder="••••••••"
                    :type="showPassword ? 'text' : 'password'"
                    @keyup.enter="handleLogin"
                  />
                  <div
                    class="text-slate-400 flex items-center justify-center pr-4 pl-2 cursor-pointer hover:text-primary transition-colors"
                    @click="showPassword = !showPassword"
                  >
                    <span class="material-symbols-outlined">{{
                      showPassword ? 'visibility_off' : 'visibility'
                    }}</span>
                  </div>
                </div>
              </label>
            </div>
            <!-- Forgot Password Link -->
            <div class="flex justify-end mt-3">
              <a class="text-primary text-sm font-medium hover:underline" href="#"
                >¿Olvidaste tu contraseña?</a
              >
            </div>
            <!-- Action Button -->
            <div class="mt-8">
              <button
                class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="authStore.loading"
                @click="handleLogin"
              >
                {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </div>

    

          </div>

        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const ROLE_ROUTES = {
  1: '/admin',
  2: '/dashboard',
  3: '/mesas',
  4: '/store',
}

const handleLogin = async () => {
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    const target = ROLE_ROUTES[authStore.userRole] ?? '/'
    router.push(target)
  }
}
</script>
