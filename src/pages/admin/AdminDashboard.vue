<template>
  <q-page>
    <div class="h-screen overflow-hidden bg-background-light flex">
      <div class="flex h-screen overflow-hidden w-full">

        <!-- ── SIDEBAR ── -->
        <aside class="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          <div class="p-6 flex items-center gap-3">
            <div class="bg-primary rounded-lg p-1.5 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-slate-900">point_of_sale</span>
            </div>
            <div>
              <h1 class="font-bold text-lg leading-tight">POS SaaS</h1>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Super Admin</p>
            </div>
          </div>

          <nav class="flex-1 px-4 py-4 space-y-1">
            <button
              v-for="item in navItems"
              :key="item.key"
              @click="activeSection = item.key"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                activeSection === item.key
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              ]"
            >
              <span class="material-symbols-outlined text-[22px]">{{ item.icon }}</span>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </button>
          </nav>

          <!-- User info + logout -->
          <div class="p-4 border-t border-slate-200">
            <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
              <div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {{ avatarInitial }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate">{{ authStore.userProfile?.full_name ?? 'Super Admin' }}</p>
                <p class="text-xs text-slate-500 truncate">{{ authStore.currentUser?.email }}</p>
              </div>
              <button @click="handleLogout" title="Cerrar sesión"
                class="text-slate-400 hover:text-red-500 transition-colors">
                <span class="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- ── MAIN ── -->
        <main class="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden">

          <!-- Header -->
          <header class="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 z-10 shrink-0">
            <div class="max-w-md w-full">
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input
                  v-model="globalSearch"
                  class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all"
                  :placeholder="activeSection === 'companies' ? 'Buscar empresa...' : 'Buscar usuario...'"
                />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                v-if="activeSection === 'companies'"
                @click="openCompanyDialog()"
                class="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark shadow-sm transition-all"
              >
                <span class="material-symbols-outlined text-xl">add_business</span>
                Nueva empresa
              </button>
              <button
                v-if="activeSection === 'users'"
                @click="openUserDialog()"
                class="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark shadow-sm transition-all"
              >
                <span class="material-symbols-outlined text-xl">person_add</span>
                Nuevo usuario
              </button>
            </div>
          </header>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-8 space-y-6">

            <!-- ── SECTION: COMPANIES ── -->
            <template v-if="activeSection === 'companies'">
              <div class="flex flex-col gap-1 mb-2">
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Empresas</h2>
                <p class="text-slate-500 font-medium">Gestión de empresas y licencias del sistema.</p>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-primary/10 rounded-lg text-primary">
                      <span class="material-symbols-outlined">corporate_fare</span>
                    </div>
                  </div>
                  <p class="text-slate-500 text-sm font-medium mb-1">Total Empresas</p>
                  <h3 class="text-2xl font-bold">{{ companyStore.totalCompanies }}</h3>
                </div>
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                      <span class="material-symbols-outlined">domain_verification</span>
                    </div>
                  </div>
                  <p class="text-slate-500 text-sm font-medium mb-1">Activas</p>
                  <h3 class="text-2xl font-bold">{{ companyStore.activeCompanies.length }}</h3>
                </div>
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-slate-100 rounded-lg text-slate-500">
                      <span class="material-symbols-outlined">block</span>
                    </div>
                  </div>
                  <p class="text-slate-500 text-sm font-medium mb-1">Inactivas</p>
                  <h3 class="text-2xl font-bold">{{ companyStore.totalCompanies - companyStore.activeCompanies.length }}</h3>
                </div>
              </div>

              <!-- Companies table -->
              <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                  <h4 class="font-bold text-lg">Registro de Empresas</h4>
                  <p class="text-sm text-slate-400">{{ filteredCompanies.length }} empresa(s)</p>
                </div>

                <!-- Loading -->
                <div v-if="companyStore.loading" class="flex items-center justify-center py-16">
                  <span class="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
                </div>

                <!-- Empty -->
                <div v-else-if="filteredCompanies.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
                  <span class="material-symbols-outlined text-5xl mb-3">business_center</span>
                  <p class="font-medium">No hay empresas registradas</p>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                      <tr>
                        <th class="px-6 py-4">Empresa</th>
                        <th class="px-6 py-4">Email</th>
                        <th class="px-6 py-4">Teléfono</th>
                        <th class="px-6 py-4">Estado</th>
                        <th class="px-6 py-4">Creada</th>
                        <th class="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr
                        v-for="company in filteredCompanies"
                        :key="company.id"
                        class="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {{ company.name?.charAt(0)?.toUpperCase() ?? '?' }}
                            </div>
                            <div class="flex flex-col">
                              <span class="font-semibold text-sm">{{ company.name }}</span>
                              <span class="text-xs text-slate-500">{{ company.address ?? '—' }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-slate-500">{{ company.email ?? '—' }}</td>
                        <td class="px-6 py-4 text-sm text-slate-500">{{ company.phone ?? '—' }}</td>
                        <td class="px-6 py-4">
                          <span :class="company.is_active
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-400 bg-slate-100'"
                            class="flex items-center gap-1.5 text-xs font-bold uppercase w-fit px-2.5 py-1 rounded-full">
                            <span :class="company.is_active ? 'bg-emerald-500' : 'bg-slate-400'" class="size-1.5 rounded-full"></span>
                            {{ company.is_active ? 'Activa' : 'Inactiva' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-slate-400">{{ formatDate(company.created_at) }}</td>
                        <td class="px-6 py-4 text-right">
                          <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click="filterByCompany(company)"
                              class="p-2 text-slate-400 hover:text-primary transition-colors" title="Ver usuarios">
                              <span class="material-symbols-outlined text-[20px]">group</span>
                            </button>
                            <button @click="openCompanyDialog(company)"
                              class="p-2 text-slate-400 hover:text-primary transition-colors" title="Editar">
                              <span class="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button @click="confirmDelete('company', company)"
                              class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar">
                              <span class="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

            <!-- ── SECTION: USERS ── -->
            <template v-if="activeSection === 'users'">
              <div class="flex flex-col gap-1 mb-2">
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Usuarios</h2>
                <p class="text-slate-500 font-medium">Gestión de perfiles, roles y accesos.</p>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div class="p-2 bg-violet-50 rounded-lg text-violet-500">
                    <span class="material-symbols-outlined">manage_accounts</span>
                  </div>
                  <div>
                    <p class="text-slate-500 text-xs font-medium">Total</p>
                    <h3 class="text-xl font-bold">{{ companyStore.totalProfiles }}</h3>
                  </div>
                </div>
                <div v-for="(role, id) in ROLES" :key="id" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div :class="role.bg" class="p-2 rounded-lg">
                    <span :class="role.text" class="material-symbols-outlined">{{ role.icon }}</span>
                  </div>
                  <div>
                    <p class="text-slate-500 text-xs font-medium">{{ role.label }}</p>
                    <h3 class="text-xl font-bold">{{ companyStore.profiles.filter(p => p.roles_id === Number(id)).length }}</h3>
                  </div>
                </div>
              </div>

              <!-- Filter bar -->
              <div class="flex items-center gap-3">
                <select v-model="filterCompanyId"
                  class="bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                  <option value="">Todas las empresas</option>
                  <option v-for="c in companyStore.companies" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <button v-if="filterCompanyId" @click="filterCompanyId = ''"
                  class="text-xs text-slate-400 hover:text-primary flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px]">close</span>
                  Limpiar filtro
                </button>
              </div>

              <!-- Users table -->
              <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                  <h4 class="font-bold text-lg">Perfiles de Usuario</h4>
                  <p class="text-sm text-slate-400">{{ filteredProfiles.length }} usuario(s)</p>
                </div>

                <!-- Loading -->
                <div v-if="companyStore.loadingProfile" class="flex items-center justify-center py-16">
                  <span class="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
                </div>

                <!-- Empty -->
                <div v-else-if="filteredProfiles.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
                  <span class="material-symbols-outlined text-5xl mb-3">manage_accounts</span>
                  <p class="font-medium">No hay usuarios</p>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                      <tr>
                        <th class="px-6 py-4">Usuario</th>
                        <th class="px-6 py-4">Empresa</th>
                        <th class="px-6 py-4">Rol</th>
                        <th class="px-6 py-4">Estado</th>
                        <th class="px-6 py-4">Creado</th>
                        <th class="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr
                        v-for="profile in filteredProfiles"
                        :key="profile.id"
                        class="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {{ (profile.full_name ?? profile.email ?? '?').charAt(0).toUpperCase() }}
                            </div>
                            <div class="flex flex-col">
                              <span class="font-semibold text-sm">{{ profile.full_name ?? '—' }}</span>
                              <span class="text-xs text-slate-500">{{ profile.email ?? '' }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-slate-500">{{ profile.companies?.name ?? '—' }}</td>
                        <td class="px-6 py-4">
                          <span :class="[roleInfo(profile.roles_id).badge, 'text-xs font-bold px-2.5 py-1 rounded-full uppercase']">
                            {{ roleInfo(profile.roles_id).label }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span :class="profile.is_active
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-400 bg-slate-100'"
                            class="flex items-center gap-1.5 text-xs font-bold uppercase w-fit px-2.5 py-1 rounded-full">
                            <span :class="profile.is_active ? 'bg-emerald-500' : 'bg-slate-400'" class="size-1.5 rounded-full"></span>
                            {{ profile.is_active ? 'Activo' : 'Inactivo' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-slate-400">{{ formatDate(profile.created_at) }}</td>
                        <td class="px-6 py-4 text-right">
                          <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click="openUserDialog(profile)"
                              class="p-2 text-slate-400 hover:text-primary transition-colors" title="Editar">
                              <span class="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button @click="confirmDelete('profile', profile)"
                              class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar">
                              <span class="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

          </div>
        </main>
      </div>
    </div>

    <!-- ════════════════════════════════════════ -->
    <!-- DIALOG: COMPANY FORM                    -->
    <!-- ════════════════════════════════════════ -->
    <q-dialog v-model="companyDialog" persistent>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-800">
              {{ editingCompany ? 'Editar empresa' : 'Nueva empresa' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ editingCompany ? 'Modifica los datos de la empresa' : 'Completa los datos para registrar' }}
            </p>
          </div>
          <button @click="companyDialog = false" class="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="submitCompany" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre *</label>
            <input v-model="companyForm.name" type="text" required placeholder="Nombre de la empresa"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input v-model="companyForm.email" type="email" placeholder="correo@empresa.com"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Teléfono</label>
              <input v-model="companyForm.phone" type="text" placeholder="+1 000 000 0000"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Dirección</label>
            <input v-model="companyForm.address" type="text" placeholder="Dirección de la empresa"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
          </div>

          <!-- Toggle activa -->
          <div class="flex items-center gap-3 pt-1">
            <button type="button" @click="companyForm.is_active = !companyForm.is_active"
              :class="companyForm.is_active ? 'bg-primary' : 'bg-slate-200'"
              class="relative w-10 h-6 rounded-full transition-colors focus:outline-none shrink-0">
              <span :class="companyForm.is_active ? 'translate-x-4' : 'translate-x-0.5'"
                class="absolute top-0.5 size-5 bg-white rounded-full shadow transition-transform block"></span>
            </button>
            <span class="text-sm font-medium text-slate-600">Empresa activa</span>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="companyDialog = false"
              class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" :disabled="companyStore.loading"
              class="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60">
              {{ companyStore.loading ? 'Guardando...' : (editingCompany ? 'Guardar cambios' : 'Crear empresa') }}
            </button>
          </div>
        </form>
      </div>
    </q-dialog>

    <!-- ════════════════════════════════════════ -->
    <!-- DIALOG: USER FORM                       -->
    <!-- ════════════════════════════════════════ -->
    <q-dialog v-model="userDialog" persistent>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-800">
              {{ editingUser ? 'Editar usuario' : 'Nuevo usuario' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ editingUser ? 'Modifica rol, empresa o datos' : 'Crea un nuevo usuario en el sistema' }}
            </p>
          </div>
          <button @click="userDialog = false" class="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="submitUser" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre completo</label>
            <input v-model="userForm.full_name" type="text" placeholder="Juan Pérez"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
          </div>

          <template v-if="!editingUser">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
              <input v-model="userForm.email" type="email" required placeholder="usuario@empresa.com"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña *</label>
              <input v-model="userForm.password" type="password" required placeholder="••••••••" minlength="6"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
            </div>
          </template>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Rol *</label>
              <select v-model.number="userForm.roles_id" required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                <option :value="1">Super Admin</option>
                <option :value="2">Manager</option>
                <option :value="3">Mesero</option>
                <option :value="4">Tienda</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Empresa</label>
              <select v-model="userForm.company_id"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                <option value="">Sin empresa</option>
                <option v-for="c in companyStore.companies" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-1">
            <button type="button" @click="userForm.is_active = !userForm.is_active"
              :class="userForm.is_active ? 'bg-primary' : 'bg-slate-200'"
              class="relative w-10 h-6 rounded-full transition-colors focus:outline-none shrink-0">
              <span :class="userForm.is_active ? 'translate-x-4' : 'translate-x-0.5'"
                class="absolute top-0.5 size-5 bg-white rounded-full shadow transition-transform block"></span>
            </button>
            <span class="text-sm font-medium text-slate-600">Usuario activo</span>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="userDialog = false"
              class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" :disabled="companyStore.loadingProfile"
              class="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60">
              {{ companyStore.loadingProfile ? 'Guardando...' : (editingUser ? 'Guardar cambios' : 'Crear usuario') }}
            </button>
          </div>
        </form>
      </div>
    </q-dialog>

    <!-- ════════════════════════════════════════ -->
    <!-- DIALOG: CONFIRMAR ELIMINACIÓN           -->
    <!-- ════════════════════════════════════════ -->
    <q-dialog v-model="deleteDialog">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="bg-red-50 text-red-500 size-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">
          ¿Eliminar {{ deleteTarget?.type === 'company' ? 'empresa' : 'usuario' }}?
        </h3>
        <p class="text-sm text-slate-500 mb-6">
          Se eliminará permanentemente
          <span class="font-semibold text-slate-700">
            {{ deleteTarget?.type === 'company'
              ? deleteTarget.item.name
              : (deleteTarget?.item?.full_name ?? deleteTarget?.item?.email) }}
          </span>.
          Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button @click="deleteDialog = false"
            class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            Cancelar
          </button>
          <button @click="executeDelete"
            :disabled="companyStore.loading || companyStore.loadingProfile"
            class="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-60">
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
import { useCompanyStore } from 'stores/companyStore'
import { useAuthStore } from 'stores/authStore'

defineOptions({ name: 'AdminDashboard' })

const router = useRouter()
const companyStore = useCompanyStore()
const authStore = useAuthStore()

// ── Nav ──
const navItems = [
  { key: 'companies', label: 'Empresas', icon: 'business' },
  { key: 'users', label: 'Usuarios', icon: 'group' },
]
const activeSection = ref('companies')
const globalSearch = ref('')
const filterCompanyId = ref('')

const avatarInitial = computed(() => {
  const name = authStore.userProfile?.full_name ?? authStore.currentUser?.email ?? 'A'
  return name.charAt(0).toUpperCase()
})

// ── Roles config ──
const ROLES = {
  1: { label: 'Super Admin', badge: 'bg-violet-50 text-violet-600', bg: 'bg-violet-50', text: 'text-violet-500', icon: 'admin_panel_settings' },
  2: { label: 'Manager', badge: 'bg-blue-50 text-blue-600', bg: 'bg-blue-50', text: 'text-blue-500', icon: 'manage_accounts' },
  3: { label: 'Mesero', badge: 'bg-amber-50 text-amber-600', bg: 'bg-amber-50', text: 'text-amber-500', icon: 'table_restaurant' },
  4: { label: 'Tienda', badge: 'bg-emerald-50 text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-500', icon: 'storefront' },
}
const roleInfo = (id) => ROLES[id] ?? { label: 'Sin rol', badge: 'bg-slate-100 text-slate-500', bg: 'bg-slate-100', text: 'text-slate-400', icon: 'person' }

// ── Filtered lists ──
const filteredCompanies = computed(() => {
  const q = globalSearch.value.toLowerCase()
  return companyStore.companies.filter(
    (c) => !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q),
  )
})

const filteredProfiles = computed(() => {
  let list = companyStore.profiles
  if (filterCompanyId.value) list = list.filter((p) => p.company_id === filterCompanyId.value)
  const q = globalSearch.value.toLowerCase()
  if (q) list = list.filter(
    (p) => p.full_name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q),
  )
  return list
})

// ── Helpers ──
const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const filterByCompany = (company) => {
  filterCompanyId.value = company.id
  activeSection.value = 'users'
}

// ── Company dialog ──
const companyDialog = ref(false)
const editingCompany = ref(null)
const companyForm = ref({})

const openCompanyDialog = (company = null) => {
  editingCompany.value = company
  companyForm.value = company
    ? { name: company.name, email: company.email ?? '', phone: company.phone ?? '', address: company.address ?? '', is_active: company.is_active ?? true }
    : { name: '', email: '', phone: '', address: '', is_active: true }
  companyDialog.value = true
}

const submitCompany = async () => {
  const result = editingCompany.value
    ? await companyStore.updateCompany(editingCompany.value.id, companyForm.value)
    : await companyStore.createCompany(companyForm.value)
  if (result.success) companyDialog.value = false
}

// ── User dialog ──
const userDialog = ref(false)
const editingUser = ref(null)
const userForm = ref({})

const openUserDialog = (profile = null) => {
  editingUser.value = profile
  userForm.value = profile
    ? { full_name: profile.full_name ?? '', roles_id: profile.roles_id, company_id: profile.company_id ?? '', is_active: profile.is_active ?? true }
    : { full_name: '', email: '', password: '', roles_id: 3, company_id: '', is_active: true }
  userDialog.value = true
}

const submitUser = async () => {
  let result
  if (editingUser.value) {
    const { full_name, roles_id, company_id, is_active } = userForm.value
    result = await companyStore.updateProfile(editingUser.value.id, {
      full_name,
      roles_id,
      company_id: company_id || null,
      is_active,
    })
  } else {
    const { email, password, full_name, roles_id, company_id, is_active } = userForm.value
    result = await companyStore.createUser(email, password, { full_name, roles_id, company_id: company_id || null, is_active })
  }
  if (result.success) {
    userDialog.value = false
    await companyStore.fetchProfiles()
  }
}

// ── Delete ──
const deleteDialog = ref(false)
const deleteTarget = ref(null)

const confirmDelete = (type, item) => {
  deleteTarget.value = { type, item }
  deleteDialog.value = true
}

const executeDelete = async () => {
  const { type, item } = deleteTarget.value
  const result = type === 'company'
    ? await companyStore.deleteCompany(item.id)
    : await companyStore.deleteProfile(item.id)
  if (result.success) deleteDialog.value = false
}

// ── Logout ──
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// ── Init ──
onMounted(async () => {
  await Promise.all([companyStore.fetchCompanies(), companyStore.fetchProfiles()])
})
</script>
