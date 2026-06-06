import { getRestaurantBySlug, restaurants } from '@/lib/data'
import { notFound } from 'next/navigation'
import MenuPage from '@/components/MenuPage'

export function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const restaurant = getRestaurantBySlug(slug)
  if (!restaurant) return {}
  return { title: `${restaurant.name} — Hungry Bocas` }
}

export default async function RestaurantPage({ params }) {
  const { slug } = await params
  const restaurant = getRestaurantBySlug(slug)
  if (!restaurant) notFound()
  return <MenuPage restaurant={restaurant} />
}
