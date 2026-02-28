<template>
  <q-layout>
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
              Sign In
            </h2>
          </div>
          <div class="flex flex-col flex-1 justify-center px-6 max-w-[480px] mx-auto w-full z-10">
            <!-- Logo Section -->
            <div class="flex justify-center mb-10">
              <div
                class="size-24 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 overflow-hidden"
              >
                <div
                  class="w-full h-full bg-cover bg-center"
                  data-alt="Modern abstract minimalist app logo icon"
                  style="
                    background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6Yv6GNSutlUAOudPywfoFcf1cSex3DZ8ldwhncRGWISyE-rSMQxxmfLWityGu9VDzUDE6hVrw_z-oWvuXTcnHnF-1500mmp7aDoGNTJCfsy_Ru9GGwrGZIPRT5zOAMXmbusrpF-fqsg_7zovQ1F5ZlMai-NpEXXvIvrQ9e6hsrPaJZCXr9xu8KUcMMDhU2x_MVJqeguC260IRoGLRwo--4yQtogzntigWlHl6tyYcunfzj7KQf5sdDxCgE9ktGAiO6cJXYYjvIN0');
                  "
                ></div>
              </div>
            </div>
            <div class="text-center mb-8">
              <h1
                class="text-slate-900 dark:text-slate-100 tracking-tight text-[32px] font-bold leading-tight pb-2"
              >
                Welcome Back
              </h1>
              <p class="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                Enter your credentials to access your account
              </p>
            </div>
            <!-- Input Fields -->
            <div class="space-y-4">
              <label class="flex flex-col w-full">
                <p
                  class="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2 px-1"
                >
                  Email or Username
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
                  />
                </div>
              </label>
              <label class="flex flex-col w-full">
                <p
                  class="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2 px-1"
                >
                  Password
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
                >Forgot Password?</a
              >
            </div>
            <!-- Action Button -->
            <div class="mt-8">
              <button
                class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="authStore.loading"
                @click="handleLogin"
              >
                {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
              </button>
            </div>
            <!-- Social Login Divider -->
            <div class="flex items-center my-8">
              <div class="flex-grow h-px bg-slate-200 dark:bg-slate-800"></div>
              <span class="px-4 text-slate-400 text-xs font-medium uppercase tracking-wider"
                >Or continue with</span
              >
              <div class="flex-grow h-px bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <!-- Social Buttons -->
            <div class="flex gap-4">
              <button
                class="flex-1 flex items-center justify-center h-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  class="size-6"
                  data-alt="Google authentication logo icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI-2JrKZqN3btxertld8FBe6kqvK3e5iiWLreLfdJ_hn5V1HefadMGH2jPHT-ThxSbOm5Pr4XQyBlVOocN_BwZSkFrTdAitPskWnIWqHsV6jTGYtlGjpYScffwIR1xFpLS1hURwLTjfBAgsP8zlFj_zVUVjTceDcbcjralD4N8o2IFvQCxkL6A75SoVr5k91wvuuY2zvsUCq0jnVPK2q5rsZsmCrihQDwEQQR6OQVKicpRZqMp8jU0SJOAojKW-tuh_jMJcZ7WQ9k"
                />
              </button>
              <button
                class="flex-1 flex items-center justify-center h-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  class="size-6"
                  data-alt="Apple authentication logo icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_GOYBvOFpyx05F3f7xWzCqP7PEhx9yhe6CLuzN2iRxD7r6TOvQCsFlX2bXocPzQwWAuPeSotdZaLu_mruXj3tjI6w9U8C0HtCIglAHPXom8w3NoA97RFYBcerLhwKAnSj_AoiiXRTbYFC9kg8OdUKpkcC_oUuPZLv1QrcPEcBdxfA1Dtiq2ZFJFbj_GLPNIDKDsEkb6Tt7zb2hIUl5c05XRWSZs5N4O4i_sixt5r0Lyblb3dfUef-tXh4wuUK2qCN3bZ3VGHUyJU"
                />
              </button>
            </div>
          </div>
          <!-- Sign Up Link -->
          <div class="mt-auto py-8 text-center z-10">
            <p class="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account?
              <a class="text-primary font-bold hover:underline ml-1" href="#">Sign Up</a>
            </p>
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
