"use client"

import { useMemo, useState, useEffect } from "react"
import { Deal, Filters } from '../../types'
import Explore from '../../components/Explore'
import NavHeader from '../../components/NavHeaderCustomer'

// Utility functions
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

// Fetch deals from API
const fetchDeals = async (): Promise<Deal[]> => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${API_BASE}/api/deals`)
    const data = await response.json()
    console.log("Success!")
    console.log("Response: ", data)
    return data.map((deal: any) => ({
      ...deal,
      vendor: deal.restaurant_name,
      vendorId: deal.id,
      originalPrice: deal.price * 1.5, // Mock original price for display
      quantity: deal.quantity, // Mock quantity
      distanceKm: 2.5, // Mock distance
      pickupAddress: deal.pickup_address,
      pickupNotes: "Pick up at counter",
      pickupStart: deal.ready_time,
      pickupEnd: deal.ready_time,
      bestBefore: deal.ready_time,
      createdAt: deal.created_at,
      expiresAt: deal.ready_time,
      allergens: [],
      coldChain: false,
      b2b: false,
      category: "Restaurant",
      diet: ["Mixed"],
      rating: 4.5,
      tags: ["Fresh"],
      imageUrl: deal.image_url
    }))
  } catch (error) {
    console.error('Failed to fetch deals:', error)
    return []
  }
}

export default function ExplorePage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [filters, setFilters] = useState<Filters>({ q: "", cat: "All", diet: "All", maxKm: 10 })
  const [cartCount, setCartCount] = useState(0)

  // Fetch deals from API on component mount
  useEffect(() => {
    const loadDeals = async () => {
      const apiDeals = await fetchDeals()
      setDeals(apiDeals)
    }
    loadDeals()
  }, [])

  // Real backend cart functionality
  const addToCart = async (deal: Deal, qty = 1) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: deal.id,
          quantity: qty
        })
      })
      
      if (response.ok) {
        alert(`Added ${deal.title} to cart!`)
        // Update cart count
        setCartCount(prev => prev + qty)
        // Optionally refresh deals to update stock
        const apiDeals = await fetchDeals()
        setDeals(apiDeals)
      } else {
        const errorData = await response.json()
        console.error('Cart error:', errorData)
        alert(`Failed to add to cart: ${errorData.detail || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Network error. Please try again.')
    }
  }

  const filteredDeals = useMemo(() => {
    return deals
      .filter((d) => (filters.cat === "All" ? true : d.category === filters.cat))
      .filter((d) => (filters.diet === "All" ? true : d.diet.includes(filters.diet)))
      .filter((d) => d.distanceKm <= filters.maxKm)
      .filter((d) =>
        filters.q
          ? (d.vendor + d.title + d.category + d.tags.join(" ")).toLowerCase().includes(filters.q.toLowerCase())
          : true,
      )
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }, [deals, filters])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavHeader />
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <Explore deals={filteredDeals} filters={filters} setFilters={setFilters} onReserve={addToCart} />
      </main>
    </div>
  )
}
