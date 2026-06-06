export const restaurants = [
  {
    id: 'reef-kitchen',
    slug: 'reef-kitchen',
    name: 'Reef Kitchen',
    category: 'Seafood & Tropical',
    description: 'Fresh catch daily, tropical flavors straight from the Caribbean',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: 2,
    headerColor: '#0E7490',
    emoji: '🐠',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=420&fit=crop&auto=format&q=80',
    menu: {
      Starters: [
        { id: 'rk-1', name: 'Ceviche', price: 12, description: 'Fresh local fish marinated in lime, red onion & ají amarillo' },
        { id: 'rk-2', name: 'Coconut Shrimp', price: 11, description: 'Crispy coconut-battered shrimp with mango dipping sauce' },
        { id: 'rk-3', name: 'Plantain Chips', price: 5, description: 'House-fried with sea salt and a squeeze of lime' },
      ],
      'Main Dishes': [
        { id: 'rk-4', name: 'Grilled Lobster', price: 28, description: 'Half Caribbean lobster, garlic butter & fresh herbs' },
        { id: 'rk-5', name: 'Fish Tacos', price: 14, description: '3 corn tortillas, grilled mahi-mahi, slaw & chipotle crema' },
        { id: 'rk-6', name: 'Seafood Rice', price: 16, description: 'Arroz con mariscos in saffron broth, local catch of the day' },
      ],
      Drinks: [
        { id: 'rk-7', name: 'Tropical Smoothie', price: 6, description: 'Mango, pineapple, coconut milk & a squeeze of lime' },
        { id: 'rk-8', name: 'Local Beer', price: 4, description: 'Cold Balboa or Panama, served on ice' },
        { id: 'rk-9', name: 'Fresh Lemonade', price: 5, description: 'Squeezed to order with mint & cane sugar' },
      ],
    },
  },
  {
    id: 'bocas-burger',
    slug: 'bocas-burger',
    name: 'Bocas Burger Co',
    category: 'Burgers & Grills',
    description: 'Handcrafted burgers, crispy fries, good vibes',
    rating: 4.6,
    deliveryTime: '20-30 min',
    deliveryFee: 1.5,
    headerColor: '#B45309',
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=420&fit=crop&auto=format&q=80',
    menu: {
      Burgers: [
        { id: 'bb-1', name: 'Classic Burger', price: 10, description: 'Beef patty, cheddar, lettuce, tomato, pickles & secret sauce' },
        { id: 'bb-2', name: 'BBQ Bacon Burger', price: 13, description: 'Smoky bacon, BBQ glaze, crispy onions & sharp cheddar' },
        { id: 'bb-3', name: 'Veggie Burger', price: 11, description: 'House black bean patty, avocado & pickled jalapeños' },
        { id: 'bb-4', name: 'Double Smash', price: 15, description: 'Two smash patties, American cheese, caramelized onions' },
      ],
      Sides: [
        { id: 'bb-5', name: 'Crispy Fries', price: 4, description: 'Skin-on, seasoned with sea salt & smoked paprika' },
        { id: 'bb-6', name: 'Onion Rings', price: 5, description: 'Beer-battered, golden, with ranch dipping sauce' },
        { id: 'bb-7', name: 'Coleslaw', price: 3, description: 'Creamy & tangy, housemade daily' },
      ],
      Drinks: [
        { id: 'bb-8', name: 'Milkshake', price: 7, description: 'Thick & creamy — chocolate, vanilla or strawberry' },
        { id: 'bb-9', name: 'Soft Drink', price: 3, description: 'Coke, Sprite or Fanta, served cold' },
        { id: 'bb-10', name: 'Water', price: 1.5, description: 'Still or sparkling' },
      ],
    },
  },
  {
    id: 'tropical-bites',
    slug: 'tropical-bites',
    name: 'Tropical Bites',
    category: 'Caribbean & Local',
    description: 'Authentic Caribbean flavors, homemade recipes from the islands',
    rating: 4.9,
    deliveryTime: '30-40 min',
    deliveryFee: 2,
    headerColor: '#065F46',
    emoji: '🌴',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=420&fit=crop&auto=format&q=80',
    menu: {
      'Rice & Beans': [
        { id: 'tb-1', name: 'Rice & Red Beans with Chicken', price: 9, description: 'Classic Caribbean stew rice in coconut milk, slow-braised chicken' },
        { id: 'tb-2', name: 'Vegetarian Bowl', price: 8, description: 'Rice, black beans, sweet plantains & pickled cabbage' },
      ],
      Grills: [
        { id: 'tb-3', name: 'Grilled Fish Plate', price: 16, description: 'Market fish of the day, rice & beans, patacones & salad' },
        { id: 'tb-4', name: 'Ropa Vieja', price: 13, description: 'Slow-cooked shredded beef, sofrito, peppers & olives' },
        { id: 'tb-5', name: 'Patacones con Todo', price: 10, description: 'Double-fried plantains loaded with beans, cheese & hogao' },
      ],
      'Desserts & Drinks': [
        { id: 'tb-6', name: 'Tres Leches', price: 6, description: 'Light sponge soaked in three milks, dusted with cinnamon' },
        { id: 'tb-7', name: 'Fresh Coconut Water', price: 4, description: 'Cracked on site, served ice cold' },
        { id: 'tb-8', name: 'Agua de Pipa', price: 3, description: 'Fresh young coconut water — pure island refreshment' },
      ],
    },
  },
]

export function getRestaurantBySlug(slug) {
  return restaurants.find((r) => r.slug === slug)
}
