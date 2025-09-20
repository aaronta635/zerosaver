"use client"

import { useMemo, useState, useEffect } from "react"
import { Deal, Partner, CartItem, Order, Feedback, Filters } from '../types'
import Header from '../components/Header'
import Explore from '../components/Explore'

// Utility functions
const currency = (n: number) => `$${(n || 0).toFixed(2)}`
const minutesLeft = (iso: string) => Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 60000))
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

// CO2 emissions estimate: 1kg food waste ≈ 2.5kg CO2e (rough avg, demo only)
const co2eSaved = (orders: Order[]): number => {
  let kg = 0
  orders.forEach((o) => {
    // rough proxy: each item ≈ 0.4kg; B2B 5kg
    const perItemKg = /5kg/.test(o.title) ? 5 : 0.4
    kg += perItemKg * o.qty
  })
  return kg * 2.5
}

// Fetch deals from API
const fetchDeals = async (): Promise<Deal[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/deals')
    const data = await response.json()
    return data.map((deal: any) => ({
      ...deal,
      vendor: deal.restaurant_name,
      vendorId: deal.id,
      originalPrice: deal.price * 1.5, // Mock original price for display
      qty: 5, // Mock quantity
      minOrderQty: 1,
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

export default function ZeroSaverMVP() {
  const [activeTab, setActiveTab] = useState("explore")
  const [userRole, setUserRole] = useState("admin")
  const [cart, setCart] = useState<CartItem[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [partners, setPartners] = useState<Partner[]>([
    { id: "v1", name: "Sunset Sushi", approved: true, type: "Restaurant" },
    { id: "v2", name: "Daily Bakery", approved: true, type: "Bakery" },
    { id: "v3", name: "Green Grocer", approved: true, type: "Grocer" },
    { id: "v4", name: "Bean Scene Café", approved: true, type: "Café" },
    { id: "v5", name: "Aussie Foods Wholesale", approved: false, type: "Wholesaler" },
  ])
  const [filters, setFilters] = useState<Filters>({ q: "", cat: "All", diet: "All", maxKm: 10 })

  // Fetch deals from API on component mount
  useEffect(() => {
    const loadDeals = async () => {
      const apiDeals = await fetchDeals()
      setDeals(apiDeals)
    }
    loadDeals()
  }, [])

  // Expire deals in real-time (demo)
  useEffect(() => {
    const id = setInterval(() => {
      setDeals((prev) => prev.filter((d) => minutesLeft(d.expiresAt) > 0 && d.qty > 0))
    }, 10000)
    return () => clearInterval(id)
  }, [])

  const addToCart = (deal: Deal, qty = 1) => {
    if (deal.qty < 1) return
    const take = clamp(qty, 1, deal.qty)
    setCart((c) => {
      const idx = c.findIndex((x) => x.dealId === deal.id)
      if (idx >= 0) {
        const copy = [...c]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + take }
        return copy
      }
      return [...c, { dealId: deal.id, qty: take, title: deal.title, price: deal.price, vendor: deal.vendor }]
    })
    setDeals((all) => all.map((d) => (d.id === deal.id ? { ...d, qty: d.qty - take } : d)))
  }

  const removeFromCart = (dealId: string) => {
    const item = cart.find((x) => x.dealId === dealId)
    if (!item) return
    // return stock
    setDeals((all) => all.map((d) => (d.id === dealId ? { ...d, qty: d.qty + item.qty } : d)))
    setCart((c) => c.filter((x) => x.dealId !== dealId))
  }

  const checkout = () => {
    if (cart.length === 0) return alert("Cart empty")
    alert("Reservation confirmed! (Demo) – You'll receive a QR code by email.")
    setCart([])
  }

  const filteredDeals = useMemo(() => {
    return deals
      .filter((d) => partners.find((p) => p.id === d.vendorId)?.approved)
      .filter((d) => (filters.cat === "All" ? true : d.category === filters.cat))
      .filter((d) => (filters.diet === "All" ? true : d.diet.includes(filters.diet)))
      .filter((d) => d.distanceKm <= filters.maxKm)
      .filter((d) =>
        filters.q
          ? (d.vendor + d.title + d.category + d.tags.join(" ")).toLowerCase().includes(filters.q.toLowerCase())
          : true,
      )
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }, [deals, filters, partners])

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return <Explore deals={filteredDeals} filters={filters} setFilters={setFilters} onReserve={addToCart} />
      default:
        return <div className="p-8 text-center">Coming soon!</div>
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={userRole}
        setRole={setUserRole}
        cartCount={cart.length}
      />

      <main className="max-w-6xl mx-auto p-4 md:p-6">{renderContent()}</main>

      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto p-4 text-sm text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} ZeroSaver · Save food, save money, save the planet 🌱 · Demo</div>
          <div className="italic">MVP Prototype – not production code</div>
        </div>
      </footer>
    </div>
  )
}
