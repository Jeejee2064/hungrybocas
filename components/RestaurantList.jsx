'use client'
import RestaurantCard from './RestaurantCard'

export default function RestaurantList({ restaurants }) {
  return (
    <div className="px-4 pt-5 pb-28 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
        ))}
      </div>
    </div>
  )
}
