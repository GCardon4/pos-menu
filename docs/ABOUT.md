# APP POS MENU - Aplicación para sistemas POS, para apoyo de restaurantes y bares

Proyecto Realizado por Gustavo Cardona para un apoyo de restaurantes y bares para agilizar con el proceso de ventas, cargando mesas por negocio con un menú digital el cual podemos interactuar con las mesas y pedidos de las cocinas, teniendo en cuenta estadísticas y analisis de ventas para los administradores y dueños de los negocios.

## 🚀 Características Implementadas

### ✅ Funcionalidades Principales

- **Autenticación y gestión de usuarios** Autenticación de Usuarios
- **Gestión de Empresas** con CRUD Completo para usuario super Admin /roles_id = 1
- **Gestión de Usuarios** con CRUD Completo para usuario super Admin /roles_id = 1
- **Gestión de Productos** con CRUD Completo para usuario manager /roles_id = 2
- **Gestión de Mesas** con CRUD Completo para usuario manager /roles_id = 2
- **Analisis y Balance de Ventas** con CRUD Completo para usuario manager /roles_id = 2
- **Gestión de Pedidos** con CRUD Completo para usuario caja /roles_id = 3
- **Gestión de Transacciones** con CRUD Completo para usuario caja /roles_id = 3
- **Gestión de Carritos** con CRUD Completo para usuario caja /roles_id = 3
- **Analisis de Inventarios** Productos por empresa, y stock para usuario bodega /roles_id = 4
- **Funcionalidad offline** con IndexedDB y sincronización automática

### Funcionalidades Especificas

- **Usuario Super Admin (role_id: 1)**
  -- Crea usuarios con todos los roles
  -- Limita creación de empresas en los usuarios manager
  -- Listado de TODAS las Empresas del sistema
  -- Listado de TODOS los usuarios del sistema
  -- Panel administrativo completo
- **Usuario Manager (role_id: 2)**
  -- CRUD completo de usuarios Bodega y Caja
  -- CRUD completo de productos
  -- CRUD completo de mesas
  -- CRUD completo de proveedores
  -- Dashobar Principal con analisis de ventas diarias y ventas de las mesas
  --

- **Usuario Caja (role_id: 3)**
  -- Listado completo de Mesas
  -- Listado completo de Productos
  -- Asignación de productos a las mesas y realización de ventas
  -- Cierres de Cajas

- **Usuario Bodega (role_id: 4)**
  -- Gestión completa de productos
  -- Ingreso de productos con nombre, SKU, costo y stock
  -- Asignación de proveedor a productos (opcional)
  -- Cálculo automático de precio de venta basado en porcentaje de ganancia
  -- Todos los campos editables (costo, porcentaje, precio venta)
  -- Componente de audio para ingresar costo y stock
  -- Escaneo de códigos de barras con cámara (usando @zxing/library)
  -- Si el SKU existe, incrementa stock automáticamente
  -- Si el SKU no existe, abre formulario para crear producto
  -- Visualización de estadísticas: total productos, stock total, valor inventario
  -- Búsqueda y filtrado de productos
  -- Visualización de productos con información de proveedor

### Módulos Implementados

1. **Autenticación** - Login
2. **Dashboard** - Panel principal con estadísticas diarias y mensuales
3. **Estadísticas Mensuales** Egresos, Ingresos, Ganancias
4. **Gestión de de Ingresos** con CRUD completo
5. **Gestión de de Egresos** con CRUD completo
6. **Gestión de mesas** con CRUD completo
7. **Gestión de productos** con CRUD completo
8. **Gestión de proveedores** con CRUD completo
9. **Gestión de usuarios** con CRUD completo
10. **Gestión de roles** con CRUD completo
11. **Gestión de empresas** con CRUD completo
12. **Gestión de transacciones** con CRUD completo
13. **Gestión de carritos** con CRUD completo

## 📊 Estadísticas Mensuales

- **Ingresos** - Total de ingresos registrados
- **Egresos** - Total de egresos registrados
- **Ganancias** - Total de ganancias registradas

## 📊 Estadísticas Diarias

- **Ingresos** - Total de ingresos registrados
- **Egresos** - Total de egresos registrados

## Stack Tecnológico

- **Frontend**: Vue 3 + Quasar Framework
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Base de Datos Local**: IndexedDB
- **PWA**: Workbox (configurado)
- **Base de Datos Remota**: Supabase
