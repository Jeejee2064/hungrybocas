import { restaurants } from '@/lib/data'
import RestaurantList from '@/components/RestaurantList'

export default function HomePage() {
  return <RestaurantList restaurants={restaurants} />
}
