import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/authStore'
import { Notify } from 'quasar'

export const usePosStore = defineStore('pos', {
  state: () => ({
    products: [],
    cart: [], // [{ product, qty, subtotal }]
    loading: false,
    loadingProduct: false,
  }),

  getters: {
    cartTotal: (state) => state.cart.reduce((sum, item) => sum + item.subtotal, 0),
    cartItemCount: (state) => state.cart.reduce((sum, item) => sum + item.qty, 0),
  },

  actions: {
    // ─────────────────────────────────────────
    // PRODUCTS FETCH
    // ─────────────────────────────────────────

    async fetchProducts() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name', { ascending: true })
        if (error) throw error
        this.products = data ?? []
      } catch (err) {
        console.error('posStore.fetchProducts:', err)
        this.products = []
      } finally {
        this.loading = false
      }
    },

    // ─────────────────────────────────────────
    // CART
    // ─────────────────────────────────────────

    addToCart(product, qty = 1) {
      const existing = this.cart.find((item) => item.product.id === product.id)
      if (existing) {
        existing.qty += qty
        existing.subtotal = existing.qty * existing.product.price
      } else {
        this.cart.push({ product, qty, subtotal: qty * product.price })
      }
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter((item) => item.product.id !== productId)
    },

    updateQty(productId, qty) {
      const item = this.cart.find((i) => i.product.id === productId)
      if (!item) return
      if (qty <= 0) {
        this.removeFromCart(productId)
        return
      }
      item.qty = qty
      item.subtotal = qty * item.product.price
    },

    clearCart() {
      this.cart = []
    },

    async createTransaction(mesaId) {
      const authStore = useAuthStore()
      const companyId = authStore.userProfile?.company_id
      try {
        const total = this.cartTotal
        const { data, error } = await supabase
          .from('transactions')
          .insert({
            total,
            company_id: companyId,
            table_id: mesaId || null,
            payment_method: 'cash',
          })
          .select()
          .single()
        if (error) throw error
        Notify.create({ type: 'positive', message: 'Orden enviada exitosamente', position: 'top' })
        this.clearCart()
        return { success: true, data }
      } catch (err) {
        console.error('posStore.createTransaction:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al enviar orden',
          position: 'top',
        })
        return { success: false, error: err }
      }
    },

    // ─────────────────────────────────────────
    // PRODUCTS CRUD (Admin)
    // ─────────────────────────────────────────

    async createProduct(payload) {
      this.loadingProduct = true
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        this.products.push(data)
        this.products.sort((a, b) => a.name.localeCompare(b.name))
        Notify.create({ type: 'positive', message: 'Producto creado', position: 'top' })
        return { success: true, data }
      } catch (err) {
        console.error('posStore.createProduct:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al crear producto',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loadingProduct = false
      }
    },

    async updateProduct(id, payload) {
      this.loadingProduct = true
      try {
        const { data, error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        const idx = this.products.findIndex((p) => p.id === id)
        if (idx !== -1) this.products[idx] = data
        Notify.create({ type: 'positive', message: 'Producto actualizado', position: 'top' })
        return { success: true, data }
      } catch (err) {
        console.error('posStore.updateProduct:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al actualizar producto',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loadingProduct = false
      }
    },

    async adjustStock(id, delta) {
      const product = this.products.find((p) => p.id === id)
      if (!product) return { success: false }
      const newStock = Math.max(0, (product.stock ?? 0) + delta)
      return await this.updateProduct(id, { stock: newStock })
    },

    async deleteProduct(id) {
      this.loadingProduct = true
      try {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) throw error
        this.products = this.products.filter((p) => p.id !== id)
        Notify.create({ type: 'positive', message: 'Producto eliminado', position: 'top' })
        return { success: true }
      } catch (err) {
        console.error('posStore.deleteProduct:', err)
        Notify.create({
          type: 'negative',
          message: err.message || 'Error al eliminar producto',
          position: 'top',
        })
        return { success: false, error: err }
      } finally {
        this.loadingProduct = false
      }
    },
  },
})
