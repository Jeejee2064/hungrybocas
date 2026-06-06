import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const STATUS_STEPS = [
  { key: 'received',   label: 'Order received',        emoji: '✅', minutes: 0  },
  { key: 'preparing',  label: 'Kitchen is preparing',  emoji: '👨‍🍳', minutes: 2  },
  { key: 'on_the_way', label: 'On the way!',            emoji: '🛵', minutes: 8  },
  { key: 'delivered',  label: 'Delivered! Enjoy 🎉',   emoji: '🎉', minutes: 20 },
]

export function computeStatus(placedAt) {
  const minElapsed = (Date.now() - placedAt) / 60_000
  let current = STATUS_STEPS[0]
  for (const step of STATUS_STEPS) {
    if (minElapsed >= step.minutes) current = step
  }
  return current
}

export const useOrderStore = create(
  persist(
    (set) => ({
      activeOrder: null,

      placeOrder: ({ restaurantName, restaurantId, items, total, customer }) =>
        set({
          activeOrder: {
            id: Date.now(),
            placedAt: Date.now(),
            restaurantName,
            restaurantId,
            items,
            total,
            customer,
          },
        }),

      clearOrder: () => set({ activeOrder: null }),
    }),
    { name: 'bocas-active-order' }
  )
)
