import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,
  deliveryFee: 0,
  isOpen: false,

  setIsOpen: (open) => set({ isOpen: open }),

  addItem: ({ item, restaurantId, restaurantName, deliveryFee }) => {
    const state = get()
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      return false
    }
    const existing = state.items.find((i) => i.id === item.id)
    if (existing) {
      set({ items: state.items.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) })
    } else {
      set({
        items: [...state.items, { ...item, qty: 1, notes: '' }],
        restaurantId,
        restaurantName,
        deliveryFee,
      })
    }
    return true
  },

  incrementItem: (id) => {
    const { items } = get()
    set({ items: items.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i) })
  },

  decrementItem: (id) => {
    const state = get()
    const item = state.items.find((i) => i.id === id)
    if (!item) return
    if (item.qty === 1) {
      const newItems = state.items.filter((i) => i.id !== id)
      set({
        items: newItems,
        restaurantId: newItems.length === 0 ? null : state.restaurantId,
        restaurantName: newItems.length === 0 ? null : state.restaurantName,
        deliveryFee: newItems.length === 0 ? 0 : state.deliveryFee,
      })
    } else {
      set({ items: state.items.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i) })
    }
  },

  setItemNote: (id, note) => {
    const { items } = get()
    set({ items: items.map((i) => i.id === id ? { ...i, notes: note } : i) })
  },

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: null, deliveryFee: 0 }),

  getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  getTotal: () => get().getSubtotal() + get().deliveryFee,
  getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}))
