"use client"

// ZeroSaver – MVP Simulation (React)
// Single-file interactive prototype to demo the core user flows for a "Too Good To Go"-style surplus food marketplace.
// Tabs: Explore (consumer), Partner, Cart/Reservations, Analytics, Admin, Docs (spec).
// Tech assumptions for real build: Next.js + Tailwind, Supabase (DB + Auth) or Auth.js/Clerk, Stripe, Resend, Mapbox, Upstash/Redis for rate limits, Cron for expiries.

import { useMemo, useState, useEffect } from "react"

// --------------------------- Mock Data & Utils ---------------------------
const CATEGORIES = ["Bento", "Bakery", "Grocer", "Café", "Restaurant", "Wholesaler"]
const DIETS = ["Vegan", "Vegetarian", "Gluten-free", "Halal"]

const nowISO = () => new Date().toISOString()
const inMinutes = (mins) => new Date(Date.now() + mins * 60000).toISOString()

const seedDeals = () => [
  {
    id: "d1",
    vendorId: "v1",
    vendor: "Sunset Sushi",
    title: "Assorted sushi box (10pc)",
    description: "Chef's selection of nigiri & maki. Pick-up chilled. Bring a cooler bag if traveling >20 min.",
    imageUrl: "",
    category: "Restaurant",
    diet: ["Halal"],
    originalPrice: 18,
    price: 7.5,
    qty: 12,
    minOrderQty: 1,
    distanceKm: 1.2,
    pickupAddress: "12 Crown St, Wollongong NSW",
    pickupNotes: "Ring bell on arrival.",
    pickupStart: inMinutes(30),
    pickupEnd: inMinutes(150),
    bestBefore: inMinutes(240),
    createdAt: nowISO(),
    expiresAt: inMinutes(180),
    allergens: ["Soy", "Fish", "Gluten"],
    coldChain: true,
    b2b: false,
    rating: 4.6,
    tags: ["End-of-day", "Cold"],
  },
  {
    id: "d2",
    vendorId: "v2",
    vendor: "Daily Bakery",
    title: "Mystery pastry bag",
    description: "A surprise mix of croissants, danishes & buns. Best the same day.",
    imageUrl: "",
    category: "Bakery",
    diet: ["Vegetarian"],
    originalPrice: 16,
    price: 6,
    qty: 8,
    minOrderQty: 1,
    distanceKm: 0.6,
    pickupAddress: "5 Market Ln, Wollongong NSW",
    pickupNotes: "Ask for ZeroSaver bag at counter.",
    pickupStart: inMinutes(10),
    pickupEnd: inMinutes(90),
    bestBefore: inMinutes(120),
    createdAt: nowISO(),
    expiresAt: inMinutes(120),
    allergens: ["Gluten", "Dairy"],
    coldChain: false,
    b2b: false,
    rating: 4.4,
    tags: ["End-of-day"],
  },
  {
    id: "d3",
    vendorId: "v3",
    vendor: "Green Grocer",
    title: "Fruit & veg mixed box (3kg)",
    description: "Seasonal seconds. Great for juicing & soups. Mix varies.",
    imageUrl: "",
    category: "Grocer",
    diet: ["Vegan", "Vegetarian", "Gluten-free"],
    originalPrice: 25,
    price: 10,
    qty: 20,
    minOrderQty: 1,
    distanceKm: 3.4,
    pickupAddress: "88 Keira St, Wollongong NSW",
    pickupNotes: "Loading bay pick-up at rear.",
    pickupStart: inMinutes(60),
    pickupEnd: inMinutes(300),
    bestBefore: inMinutes(360),
    createdAt: nowISO(),
    expiresAt: inMinutes(360),
    allergens: [],
    coldChain: false,
    b2b: false,
    rating: 4.2,
    tags: ["Family size"],
  },
  {
    id: "d4",
    vendorId: "v4",
    vendor: "Bean Scene Café",
    title: "Sandwich + coffee combo",
    description: "Any display sandwich + medium coffee voucher. Collect before 3pm.",
    imageUrl: "",
    category: "Café",
    diet: ["Vegetarian"],
    originalPrice: 19,
    price: 8.5,
    qty: 10,
    minOrderQty: 1,
    distanceKm: 2.1,
    pickupAddress: "21 Crown St, Wollongong NSW",
    pickupNotes: "Show QR at barista.",
    pickupStart: inMinutes(20),
    pickupEnd: inMinutes(160),
    bestBefore: inMinutes(200),
    createdAt: nowISO(),
    expiresAt: inMinutes(200),
    allergens: ["Gluten", "Dairy"],
    coldChain: false,
    b2b: false,
    rating: 4.7,
    tags: ["Lunch"],
  },
  {
    id: "d5",
    vendorId: "v5",
    vendor: "Aussie Foods Wholesale",
    title: "B2B – surplus chicken (5kg)",
    description: "Frozen MD packs, mixed cuts. For licensed businesses only.",
    imageUrl: "",
    category: "Wholesaler",
    diet: ["Halal", "Gluten-free"],
    originalPrice: 45,
    price: 19.9,
    qty: 6,
    minOrderQty: 2,
    distanceKm: 8.7,
    pickupAddress: "2 Industrial Rd, Unanderra NSW",
    pickupNotes: "Dock 3. Bring ABN.",
    pickupStart: inMinutes(120),
    pickupEnd: inMinutes(540),
    bestBefore: inMinutes(600),
    createdAt: nowISO(),
    expiresAt: inMinutes(600),
    allergens: [],
    coldChain: true,
    b2b: true,
    rating: 4.1,
    tags: ["Cold chain", "B2B"],
  },
]

const currency = (n) => `$${(n || 0).toFixed(2)}`
const minutesLeft = (iso) => Math.max(0, Math.round((new Date(iso) - Date.now()) / 60000))
const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

// Emissions estimate: 1kg food waste ≈ 2.5kg CO2e (rough avg, demo only)
const co2eSaved = (orders) => {
  let kg = 0
  orders.forEach((o) => {
    // rough proxy: each item ≈ 0.4kg; B2B 5kg
    const perItemKg = /5kg/.test(o.title) ? 5 : 0.4
    kg += perItemKg * o.qty
  })
  return kg * 2.5
}

// ----------------及ひRoot App ---------------------------
export default function ZeroSaverMVP() {
  const [activeTab, setActiveTab] = useState("explore")
  const [userRole, setUserRole] = useState("admin")
  const [cart, setCart] = useState([])
  const [deals, setDeals] = useState(seedDeals())
  const [partners, setPartners] = useState([
    { id: "v1", name: "Sunset Sushi", approved: true, type: "Restaurant" },
    { id: "v2", name: "Daily Bakery", approved: true, type: "Bakery" },
    { id: "v3", name: "Green Grocer", approved: true, type: "Grocer" },
    { id: "v4", name: "Bean Scene Café", approved: true, type: "Café" },
    { id: "v5", name: "Aussie Foods Wholesale", approved: false, type: "Wholesaler" },
  ])
  const [orders, setOrders] = useState([])
  const [feedback, setFeedback] = useState([
    {
      id: 1,
      orderId: "ord1",
      dealId: "d1",
      customerId: "customer1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      partnerId: "v1",
      partnerName: "Sunset Sushi",
      dealTitle: "Sushi Combo Deal",
      rating: 5,
      comment: "Amazing fresh sushi! Great value and helped reduce waste.",
      date: "2024-01-15T10:30:00Z",
      response: null,
    },
    {
      id: 2,
      orderId: "ord2",
      dealId: "d2",
      customerId: "customer2",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      partnerId: "v2",
      partnerName: "Green Grocer",
      dealTitle: "Fresh Produce Box",
      rating: 4,
      comment: "Good quality vegetables, though some were close to expiry. Still happy to help reduce waste!",
      date: "2024-01-14T15:45:00Z",
      response: "Thank you for the feedback! We're working on better timing for our produce boxes.",
    },
    {
      id: 3,
      orderId: "ord3",
      dealId: "d3",
      customerId: "customer3",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      partnerId: "v1",
      partnerName: "Sunset Sushi",
      dealTitle: "Bento Box Special",
      rating: 3,
      comment: "Food was okay but pickup process was confusing. Could use better instructions.",
      date: "2024-01-13T12:20:00Z",
      response: null,
    },
  ])

  const [filters, setFilters] = useState({ q: "", cat: "All", diet: "All", maxKm: 10 })

  // expire deals in real-time (demo)
  useEffect(() => {
    const id = setInterval(() => {
      setDeals((prev) => prev.filter((d) => minutesLeft(d.expiresAt) > 0 && d.qty > 0))
    }, 10000)
    return () => clearInterval(id)
  }, [])

  const addToCart = (deal, qty = 1) => {
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

  const removeFromCart = (dealId) => {
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

  const ordersMemo = useMemo(() => {
    // In this demo, each checkout clears the cart; simulate orders as difference between seed and current qty
    const seeded = seedDeals()
    const out = []
    seeded.forEach((sd) => {
      const current = deals.find((d) => d.id === sd.id)
      const sold = current ? sd.qty - current.qty : sd.qty // if expired/removed, assume sold
      if (sold > 0) out.push({ dealId: sd.id, title: sd.title, qty: sold })
    })
    return out
  }, [deals])

  const submitFeedback = (feedbackData) => {
    const newFeedback = {
      id: Date.now(),
      ...feedbackData,
      date: new Date().toISOString(),
      response: null,
    }
    setFeedback([newFeedback, ...feedback])
  }

  const respondToFeedback = (feedbackId, response) => {
    setFeedback(feedback.map((f) => (f.id === feedbackId ? { ...f, response } : f)))
  }

  // --------------------------- UI ---------------------------
  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return <Explore deals={filteredDeals} filters={filters} setFilters={setFilters} onReserve={addToCart} />
      case "partner":
        return (
          <PartnerDashboard
            partners={partners}
            setPartners={setPartners}
            addDeal={addToCart}
            feedback={feedback}
            respondToFeedback={respondToFeedback}
          />
        )
      case "cart":
        return <Cart cart={cart} removeItem={removeFromCart} checkout={checkout} submitFeedback={submitFeedback} />
      case "analytics":
        return <Analytics orders={ordersMemo} />
      case "admin":
        return <Admin partners={partners} setPartners={setPartners} feedback={feedback} />
      case "docs":
        return <Docs />
      default:
        return <Explore deals={filteredDeals} filters={filters} setFilters={setFilters} onReserve={addToCart} />
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

function Header({ activeTab, setActiveTab, role, setRole, cartCount }) {
  return (
    <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-3 p-3 md:p-4">
        <div className="flex items-center gap-3">
          <img src="/images/zerosaver-logo.png" alt="ZeroSaver Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <div className="font-black text-xl md:text-2xl tracking-tight">
            <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-xl">Zero</span>
            <span className="ml-1">Saver</span>
            <span className="text-xs ml-2 text-muted-foreground font-normal">🌱 Save food, save earth!</span>
          </div>
        </div>
        <nav className="ml-4 flex gap-2 md:gap-3 text-sm">
          {[
            { key: "explore", label: "🍎 Explore Goodies" },
            { key: "partner", label: "🏪 Partner Hub" },
            { key: "cart", label: "🛒 My Basket" },
            { key: "analytics", label: "📊 Impact Stats" },
            { key: "admin", label: "⚙️ Admin Magic" },
            { key: "docs", label: "📚 How It Works" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full border transition-all ${
                activeTab === t.key
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card hover:bg-secondary border-border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden md:inline text-muted-foreground">You're a:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 bg-card"
          >
            <option value="guest">🌟 Guest Explorer</option>
            <option value="consumer">🍽️ Food Saver</option>
            <option value="partner">🏪 Food Hero</option>
            <option value="admin">👑 Super Admin</option>
          </select>
          <div className="relative">
            <button
              className="px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors"
              onClick={() => setActiveTab("cart")}
            >
              🛒 My Basket
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Explore({ deals, filters, setFilters, onReserve }) {
  const [selected, setSelected] = useState(null)

  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 text-center border border-primary/20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-3">
          🎉 Who knew saving the planet could be this delicious?
        </h1>
        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
          Starting with a chuckle... Who would've thought the ticket to saving our planet was hidden in our pantries!
          Sounds a bit nuts, doesn't it? Let's rescue some amazing food together! 🌍✨
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-serif font-bold mb-4 text-center">🔍 Find Your Perfect Food Match!</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 What's making your tummy rumble?"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="border border-border rounded-xl px-4 py-3 bg-background focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <select
            value={filters.cat}
            onChange={(e) => setFilters({ ...filters, cat: e.target.value })}
            className="border border-border rounded-xl px-4 py-3 bg-background focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="All">🍽️ All Yummy Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "Restaurant"
                  ? "🍽️ "
                  : c === "Bakery"
                    ? "🥐 "
                    : c === "Café"
                      ? "☕ "
                      : c === "Grocer"
                        ? "🥬 "
                        : "🏪 "}
                {c}
              </option>
            ))}
          </select>
          <select
            value={filters.diet}
            onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
            className="border border-border rounded-xl px-4 py-3 bg-background focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="All">🌱 All Diet Friends</option>
            {DIETS.map((d) => (
              <option key={d} value={d}>
                {d === "Vegan" ? "🌱 " : d === "Vegetarian" ? "🥕 " : d === "Gluten-free" ? "🌾 " : "🥗 "}
                {d}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">🚶 Max distance:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={filters.maxKm}
              onChange={(e) => setFilters({ ...filters, maxKm: Number.parseInt(e.target.value) })}
              className="flex-1 accent-primary"
            />
            <span className="text-sm font-medium text-primary">{filters.maxKm}km</span>
          </div>
        </div>
      </div>

      {deals.length === 0 && (
        <div className="p-8 bg-card rounded-2xl border border-border text-center">
          <div className="text-6xl mb-4">🕵️‍♀️</div>
          <h3 className="text-xl font-serif font-bold mb-2">Oops! No tasty treasures found</h3>
          <p className="text-muted-foreground">
            Don't worry, let's try tweaking those filters to uncover some delicious deals! 🎯
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((d) => (
          <div
            key={d.id}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <div
              className="h-36 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4 flex items-center justify-center text-4xl"
              style={
                d.imageUrl
                  ? { backgroundImage: `url(${d.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : {}
              }
            >
              {!d.imageUrl &&
                (d.category === "Restaurant"
                  ? "🍽️"
                  : d.category === "Bakery"
                    ? "🥐"
                    : d.category === "Café"
                      ? "☕"
                      : d.category === "Grocer"
                        ? "🥬"
                        : "🏪")}
            </div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="font-serif font-bold text-balance text-lg">{d.title}</div>
                <div className="text-sm text-muted-foreground">
                  {d.vendor} • {d.category} • {d.distanceKm}km away
                </div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground line-through text-xs">{currency(d.originalPrice)}</div>
                <div className="text-xl font-bold text-green-700">{currency(d.price)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 text-xs flex-wrap">
              <span className="px-3 py-1 bg-green-600 text-white rounded-full font-medium">{d.diet[0] || "Mixed"}</span>
              {d.tags.slice(0, 2).map((t) => (
                <span key={t} className="px-3 py-1 bg-muted rounded-full text-muted-foreground">
                  {t}
                </span>
              ))}
              <span className="ml-auto px-3 py-1 rounded-full bg-green-600 text-white font-bold animate-pulse">
                ⏰ {minutesLeft(d.expiresAt)}m left!
              </span>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <button
                disabled={d.qty === 0}
                onClick={() => onReserve(d, d.minOrderQty || 1)}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                  d.qty === 0
                    ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {d.qty === 0 ? "😢 All Gone!" : "🎉 Rescue Me!"}
              </button>
              <button
                className="px-4 py-3 rounded-xl border border-border hover:bg-accent hover:border-accent transition-all"
                onClick={() => setSelected(d)}
              >
                👀
              </button>
            </div>
            <div className="text-xs text-muted-foreground mt-3 text-center bg-muted/30 rounded-lg py-2">
              📦 Stock: {d.qty} • 🛒 Min order: {d.minOrderQty}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-xl w-full bg-white rounded-2xl border" onClick={(e) => e.stopPropagation()}>
            <div
              className="h-40 rounded-t-2xl bg-gradient-to-br from-emerald-100 to-emerald-200"
              style={
                selected.imageUrl
                  ? {
                      backgroundImage: `url(${selected.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}
              }
            />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold">{selected.title}</div>
                  <div className="text-sm text-neutral-500">
                    {selected.vendor} • {selected.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-500 line-through text-xs">{currency(selected.originalPrice)}</div>
                  <div className="text-xl font-black text-green-700">{currency(selected.price)}</div>
                </div>
              </div>
              {selected.description && <p className="mt-2 text-sm">{selected.description}</p>}
              <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
                {(selected.diet[0] || "").length > 0 && (
                  <span className="px-2 py-0.5 bg-neutral-100 rounded-full">{selected.diet[0]}</span>
                )}
                {selected.coldChain && <span className="px-2 py-0.5 bg-neutral-100 rounded-full">Cold chain</span>}
                {selected.b2b && <span className="px-2 py-0.5 bg-neutral-100 rounded-full">B2B</span>}
                <span className="ml-auto px-2 py-0.5 rounded-full bg-green-600 text-white">
                  {minutesLeft(selected.expiresAt)}m left
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                Stock: {selected.qty} · Min order: {selected.minOrderQty}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function PartnerDashboard({ partners, setPartners, addDeal, feedback, respondToFeedback }) {
  const [form, setForm] = useState({
    vendorId: partners[0]?.id || "v1",
    title: "",
    description: "",
    imageUrl: "",
    category: "Restaurant",
    diet: [],
    originalPrice: 0,
    price: 0,
    qty: 1,
    minOrderQty: 1,
    distanceKm: 1,
    pickupAddress: "",
    pickupStart: inMinutes(30),
    pickupEnd: inMinutes(180),
    expiresAt: inMinutes(200),
    bestBefore: inMinutes(240),
    allergens: [],
    coldChain: false,
    b2b: false,
    tags: [],
    pickupNotes: "",
  })

  const [activePartnerTab, setActivePartnerTab] = useState("create")
  const [responseText, setResponseText] = useState("")
  const [respondingTo, setRespondingTo] = useState(null)

  const vendor = partners.find((p) => p.id === form.vendorId)
  const descLimit = 240

  const partnerFeedback = feedback.filter((f) => f.partnerId === form.vendorId)

  const create = () => {
    if (!vendor?.approved) return alert("Your partner account is pending approval.")
    if (!form.title || form.price <= 0) return alert("Please fill in a title and price.")
    const id = Math.random().toString(36).slice(2, 8)
    const combinedTags = Array.from(
      new Set([...form.tags, ...(form.b2b ? ["B2B"] : []), ...(form.coldChain ? ["Cold chain"] : [])]),
    )
    addDeal({
      id,
      vendorId: form.vendorId,
      vendor: vendor.name,
      rating: 4.3,
      createdAt: nowISO(),
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      category: form.category,
      diet: form.diet,
      originalPrice: form.originalPrice,
      price: form.price,
      qty: form.qty,
      minOrderQty: form.minOrderQty,
      distanceKm: form.distanceKm,
      pickupAddress: form.pickupAddress,
      pickupNotes: form.pickupNotes,
      pickupStart: form.pickupStart,
      pickupEnd: form.pickupEnd,
      bestBefore: form.bestBefore,
      expiresAt: form.expiresAt,
      allergens: form.allergens,
      coldChain: form.coldChain,
      b2b: form.b2b,
      tags: combinedTags,
    })
    alert("Deal published! It will auto-expire at the selected time.")
    setForm({ ...form, title: "", description: "", imageUrl: "", price: 0, originalPrice: 0, qty: 1 })
  }

  const handleResponse = (feedbackId) => {
    if (!responseText.trim()) return
    respondToFeedback(feedbackId, responseText)
    setResponseText("")
    setRespondingTo(null)
    alert("Response sent!")
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1">
        <button
          onClick={() => setActivePartnerTab("create")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePartnerTab === "create" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600"
          }`}
        >
          Create Listing
        </button>
        <button
          onClick={() => setActivePartnerTab("feedback")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePartnerTab === "feedback" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600"
          }`}
        >
          Customer Feedback ({partnerFeedback.length})
        </button>
      </div>

      {activePartnerTab === "create" ? (
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-2xl p-4">
            <div className="font-semibold mb-3">Manual listing editor (for sellers)</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="col-span-2">
                <span className="text-xs text-neutral-500">Vendor</span>
                <select
                  value={form.vendorId}
                  onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.approved ? "" : "(Pending)"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="col-span-2">
                <span className="text-xs text-neutral-500">Title</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., 2x chicken burrito bowls"
                  className="w-full border rounded px-3 py-2"
                />
              </label>
              <label className="col-span-2">
                <span className="text-xs text-neutral-500">
                  Description <span className="text-neutral-400">(max {descLimit} chars)</span>
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, descLimit) })}
                  placeholder="What's inside, portion size, storage, any caveats..."
                  className="w-full border rounded px-3 py-2 h-20 resize-none"
                />
                <div className="text-xs text-neutral-400 text-right">
                  {form.description.length}/{descLimit}
                </div>
              </label>
              {/* ... existing form fields ... */}
              <label className="col-span-2">
                <span className="text-xs text-neutral-500">
                  Image URL <span className="text-neutral-400">(optional)</span>
                </span>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border rounded px-3 py-2"
                />
              </label>
              <label>
                <span className="text-xs text-neutral-500">Category</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Cafe">Cafe</option>
                </select>
              </label>
              <label>
                <span className="text-xs text-neutral-500">Dietary tags</span>
                <input
                  value={form.diet.join(", ")}
                  onChange={(e) => setForm({ ...form, diet: e.target.value.split(", ").filter(Boolean) })}
                  placeholder="Vegan, Gluten-free"
                  className="w-full border rounded px-3 py-2"
                />
              </label>
              <label>
                <span className="text-xs text-neutral-500">Qty</span>
                <input
                  type="number"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: Number.parseInt(e.target.value) || 1 })}
                  className="w-full border rounded px-3 py-2"
                />
              </label>
              <label>
                <span className="text-xs text-neutral-500">Min order qty</span>
                <input
                  type="number"
                  value={form.minOrderQty}
                  onChange={(e) => setForm({ ...form, minOrderQty: Number.parseInt(e.target.value) || 1 })}
                  className="w-full border rounded px-3 py-2"
                />
              </label>
              <label>
                <span className="text-xs text-neutral-500">Original price</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: Number.parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2"
                />
              </label>
              <label>
                <span className="text-xs text-neutral-500">ZeroSaver price</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number.parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2"
                />
              </label>
            </div>
            <button onClick={create} className="w-full mt-4 px-4 py-2 rounded-xl border bg-neutral-900 text-white">
              Publish deal
            </button>
          </div>

          {/* ... existing preview section ... */}
          <div className="bg-white border rounded-2xl p-4">
            <div className="font-semibold mb-3">Listing preview</div>
            <div className="border rounded-2xl overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold">{form.title || "Listing title"}</div>
                  <div className="font-bold">{currency(form.price)}</div>
                </div>
                <div className="text-xs text-neutral-500 mb-2">
                  {vendor?.name || "Vendor"} • {form.category} • {form.distanceKm}km
                </div>
                <div className="text-xs text-green-700 mb-3">
                  {Math.max(0, Math.round((new Date(form.expiresAt) - new Date()) / 60000))}m left
                </div>
                <div className="text-xs text-neutral-500">
                  Stock: {form.qty} • Min order: {form.minOrderQty}
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-neutral-50 rounded-xl">
              <div className="font-medium text-sm mb-2">Partner health</div>
              <div className="text-xs space-y-1">
                <div>
                  • Approval status: <span className="text-emerald-600">Approved</span>
                </div>
                <div>• Suggested discount range: 50–70% off</div>
                <div>• Auto-expiry enabled; items will be hidden after expiry</div>
                <div>• QR pickup verification built-in (demo in Cart)</div>
                <div>• B2B offers & cold-chain flag supported</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
            {partnerFeedback.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No customer feedback yet</p>
                <p className="text-sm">Feedback will appear here when customers review your deals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {partnerFeedback.map((review) => (
                  <div key={review.id} className="border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium">{review.customerName}</div>
                        <div className="text-sm text-neutral-500">{review.dealTitle}</div>
                        <div className="text-xs text-neutral-400">{new Date(review.date).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-neutral-300"}>
                            ⭐
                          </span>
                        ))}
                        <span className="ml-1 text-sm text-neutral-600">({review.rating}/5)</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 mb-3">{review.comment}</p>

                    {review.response ? (
                      <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
                        <div className="text-xs text-blue-600 font-medium mb-1">Your Response:</div>
                        <p className="text-sm text-blue-800">{review.response}</p>
                      </div>
                    ) : (
                      <div className="border-t pt-3">
                        {respondingTo === review.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Write your response to this customer..."
                              className="w-full p-3 border rounded-lg text-sm"
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleResponse(review.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                              >
                                Send Response
                              </button>
                              <button
                                onClick={() => {
                                  setRespondingTo(null)
                                  setResponseText("")
                                }}
                                className="px-4 py-2 border rounded-lg text-sm text-neutral-600 hover:bg-neutral-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRespondingTo(review.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Respond to Customer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Cart({ cart, removeItem, checkout, submitFeedback }) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    dealId: "",
    dealTitle: "",
    partnerId: "",
    partnerName: "",
    rating: 5,
    comment: "",
  })

  const total = cart.reduce((s, x) => s + x.qty * x.price, 0)

  const openFeedbackForm = (item) => {
    setFeedbackForm({
      dealId: item.dealId,
      dealTitle: item.title,
      partnerId: item.vendorId,
      partnerName: item.vendor,
      rating: 5,
      comment: "",
    })
    setShowFeedbackForm(true)
  }

  const handleSubmitFeedback = () => {
    if (!feedbackForm.comment.trim()) {
      alert("Please write a comment")
      return
    }

    const feedbackData = {
      orderId: `ord${Date.now()}`,
      dealId: feedbackForm.dealId,
      customerId: "current_user",
      customerName: "Current User",
      customerEmail: "user@example.com",
      partnerId: feedbackForm.partnerId,
      partnerName: feedbackForm.partnerName,
      dealTitle: feedbackForm.dealTitle,
      rating: feedbackForm.rating,
      comment: feedbackForm.comment,
    }

    submitFeedback(feedbackData)
    setShowFeedbackForm(false)
    setFeedbackForm({
      dealId: "",
      dealTitle: "",
      partnerId: "",
      partnerName: "",
      rating: 5,
      comment: "",
    })
    alert("Thank you for your feedback!")
  }

  return (
    <section className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white border rounded-2xl p-4">
        <div className="font-semibold mb-3">Your reservations</div>
        {cart.length === 0 ? (
          <div className="text-sm text-neutral-500">No items yet. Add deals from Explore.</div>
        ) : (
          <div className="space-y-3">
            {cart.map((it) => (
              <div key={it.dealId} className="flex items-center justify-between border rounded-xl p-3">
                <div className="flex-1">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-neutral-500">
                    {it.vendor} • Qty {it.qty}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currency(it.qty * it.price)}</div>
                  <div className="flex space-x-2 mt-1">
                    <button className="text-xs underline text-neutral-500" onClick={() => removeItem(it.dealId)}>
                      Remove
                    </button>
                    <button className="text-xs underline text-blue-600" onClick={() => openFeedbackForm(it)}>
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white border rounded-2xl p-4 h-fit">
        <div className="font-semibold mb-2">Summary</div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Subtotal</span>
          <span>{currency(total)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-emerald-700">
          <span>Waste saved est.</span>
          <span>{Math.round((co2eSaved(cart) / 2.5) * 10) / 10} kg food</span>
        </div>
        <div className="flex items-center justify-between text-sm text-emerald-700 mb-3">
          <span>CO₂e avoided est.</span>
          <span>{Math.round(co2eSaved(cart))} kg</span>
        </div>
        <button onClick={checkout} className="w-full px-4 py-2 rounded-xl border bg-neutral-900 text-white">
          Confirm reservation
        </button>
        <div className="text-xs text-neutral-500 mt-2">You'll receive a QR code via email/SMS. Show it at pickup.</div>
      </div>

      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Leave Feedback</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Deal</label>
                <p className="text-sm text-neutral-600">{feedbackForm.dealTitle}</p>
                <p className="text-xs text-neutral-500">{feedbackForm.partnerName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Rating</label>
                <div className="flex space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      className={`text-2xl ${star <= feedbackForm.rating ? "text-yellow-400" : "text-neutral-300"}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Comment</label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                  placeholder="Share your experience with this deal..."
                  className="w-full p-3 border rounded-lg text-sm mt-1"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function Admin({ partners, setPartners, feedback }) {
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [showAddPartner, setShowAddPartner] = useState(false)
  const [activeAdminTab, setActiveAdminTab] = useState("partners")
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const [newPartner, setNewPartner] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "Restaurant",
    status: "pending",
  })

  const handleApprovePartner = (partnerId) => {
    setPartners(partners.map((p) => (p.id === partnerId ? { ...p, status: "approved" } : p)))
  }

  const handleRejectPartner = (partnerId) => {
    setPartners(partners.map((p) => (p.id === partnerId ? { ...p, status: "rejected" } : p)))
  }

  const handleAddPartner = () => {
    const partner = {
      ...newPartner,
      id: Date.now(),
      joinDate: new Date().toISOString(),
      totalDeals: 0,
      rating: 0,
    }
    setPartners([...partners, partner])
    setNewPartner({
      name: "",
      email: "",
      phone: "",
      address: "",
      category: "Restaurant",
      status: "pending",
    })
    setShowAddPartner(false)
  }

  const pendingPartners = partners.filter((p) => p.status === "pending")
  const approvedPartners = partners.filter((p) => p.status === "approved")
  const rejectedPartners = partners.filter((p) => p.status === "rejected")

  const avgRating =
    feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : 0
  const recentFeedback = feedback.slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1">
        <button
          onClick={() => setActiveAdminTab("partners")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeAdminTab === "partners" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600"
          }`}
        >
          Partner Management
        </button>
        <button
          onClick={() => setActiveAdminTab("feedback")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeAdminTab === "feedback" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600"
          }`}
        >
          Customer Feedback ({feedback.length})
        </button>
      </div>

      {activeAdminTab === "partners" ? (
        <>
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Partners</p>
                  <p className="text-2xl font-bold text-neutral-900">{partners.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🏪</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Pending Approval</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingPartners.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedPartners.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedPartners.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">❌</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Partner Management</h2>
            <button
              onClick={() => setShowAddPartner(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Add Partner
            </button>
          </div>

          {/* ... existing partner management code ... */}
          {/* Partners Table */}
          <div className="bg-white border rounded-2xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Partner</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Category</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Total Deals</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Rating</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Join Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-b border-neutral-50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-sm font-medium">{partner.name}</p>
                          <p className="text-xs text-neutral-500">{partner.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm">{partner.category}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            partner.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : partner.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {partner.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm">{partner.totalDeals || 0}</td>
                      <td className="py-3 px-2 text-sm">
                        {partner.rating ? `${partner.rating.toFixed(1)} ⭐` : "No ratings"}
                      </td>
                      <td className="py-3 px-2 text-sm text-neutral-500">
                        {new Date(partner.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex space-x-2">
                          {partner.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprovePartner(partner.id)}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectPartner(partner.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedPartner(partner)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Feedback Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Reviews</p>
                  <p className="text-2xl font-bold text-neutral-900">{feedback.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">📝</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{avgRating} ⭐</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⭐</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Responded</p>
                  <p className="text-2xl font-bold text-green-600">{feedback.filter((f) => f.response).length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">💬</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Pending Response</p>
                  <p className="text-2xl font-bold text-orange-600">{feedback.filter((f) => !f.response).length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">⏰</span>
                </div>
              </div>
            </div>
          </div>

          {/* All Feedback */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">All Customer Feedback</h3>
            {feedback.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No customer feedback yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((review) => (
                  <div key={review.id} className="border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{review.customerName}</span>
                          <span className="text-sm text-neutral-500">•</span>
                          <span className="text-sm text-neutral-600">{review.partnerName}</span>
                        </div>
                        <div className="text-sm text-neutral-600">{review.dealTitle}</div>
                        <div className="text-xs text-neutral-400">
                          {new Date(review.date).toLocaleDateString()} • Order #{review.orderId}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-neutral-300"}>
                            ⭐
                          </span>
                        ))}
                        <span className="ml-1 text-sm text-neutral-600">({review.rating}/5)</span>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-700 mb-3">{review.comment}</p>

                    {review.response && (
                      <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
                        <div className="text-xs text-blue-600 font-medium mb-1">Partner Response:</div>
                        <p className="text-sm text-blue-800">{review.response}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <div className="text-xs text-neutral-500">Customer: {review.customerEmail}</div>
                      <button
                        onClick={() => setSelectedFeedback(review)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ... existing modals ... */}
      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Partner</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Partner Name"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={newPartner.email}
                onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newPartner.phone}
                onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Address"
                value={newPartner.address}
                onChange={(e) => setNewPartner({ ...newPartner, address: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={newPartner.category}
                onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Bakery">Bakery</option>
                <option value="Grocery">Grocery</option>
                <option value="Cafe">Cafe</option>
              </select>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddPartner(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPartner}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Partner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Partner Details</h3>
              <button onClick={() => setSelectedPartner(null)} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-500">Name</label>
                  <p className="text-sm">{selectedPartner.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Category</label>
                  <p className="text-sm">{selectedPartner.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Email</label>
                  <p className="text-sm">{selectedPartner.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Phone</label>
                  <p className="text-sm">{selectedPartner.phone || "Not provided"}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-neutral-500">Address</label>
                  <p className="text-sm">{selectedPartner.address || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Status</label>
                  <p className="text-sm capitalize">{selectedPartner.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Join Date</label>
                  <p className="text-sm">{new Date(selectedPartner.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Feedback Details</h3>
              <button onClick={() => setSelectedFeedback(null)} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-500">Customer</label>
                  <p className="text-sm">{selectedFeedback.customerName}</p>
                  <p className="text-xs text-neutral-400">{selectedFeedback.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Partner</label>
                  <p className="text-sm">{selectedFeedback.partnerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Deal</label>
                  <p className="text-sm">{selectedFeedback.dealTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Order ID</label>
                  <p className="text-sm">{selectedFeedback.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Rating</label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < selectedFeedback.rating ? "text-yellow-400" : "text-neutral-300"}>
                        ⭐
                      </span>
                    ))}
                    <span className="ml-1 text-sm">({selectedFeedback.rating}/5)</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Date</label>
                  <p className="text-sm">{new Date(selectedFeedback.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-500">Customer Comment</label>
                <p className="text-sm bg-neutral-50 p-3 rounded-lg mt-1">{selectedFeedback.comment}</p>
              </div>

              {selectedFeedback.response && (
                <div>
                  <label className="text-sm font-medium text-neutral-500">Partner Response</label>
                  <p className="text-sm bg-blue-50 p-3 rounded-lg mt-1">{selectedFeedback.response}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Docs() {
  return (
    <section className="prose max-w-none">
      <h2>ZeroSaver MVP – Functional Spec (v0)</h2>
      <p>This is the shortlist of functions required to ship an end-to-end MVP. Grouped by user role.</p>

      <h3>1) Consumer (buyer)</h3>
      <ul>
        <li>
          Browse surplus deals (list + basic map later), filter by <em>category</em>, <em>dietary</em>,{" "}
          <em>distance</em>, <em>pickup window</em>, <em>price</em>.
        </li>
        <li>Deal card shows vendor, discount vs RRP, time remaining, stock, diet tags, distance, rating.</li>
        <li>
          Reserve/checkout flow (Stripe intent): pay & receive reservation <strong>QR code</strong> + pickup window by
          email/SMS (Resend/Twilio).
        </li>
        <li>Order history with status: Reserved → Picked up → Refunded/Expired.</li>
        <li>
          Account basics: sign in with email/Google/Apple; manage notifications, dietary prefs, default radius; save
          favourites.
        </li>
        <li>Per-pickup rating + report issue (goes to Ops/Admin).</li>
      </ul>

      <h3>2) Supplier / Partner</h3>
      <ul>
        <li>Onboarding form: ABN, category, pickup location, bank details (Stripe Connect), proof (photo).</li>
        <li>
          <strong>Manual listing editor:</strong> title, rich description (short), image URL/upload, qty &amp; min
          order, price &amp; RRP, diet/allergens, tags, <em>pickup address</em>, pickup window, best-before, pickup
          notes, B2B-only toggle, cold-chain flag.
        </li>
        <li>Stock &amp; expiry: live stock decrement on reservation; auto-hide at expiry; pause/resume.</li>
        <li>
          Pickup verification: scan customer QR → mark <em>Picked up</em>; auto-refund if expired &amp; uncollected
          (policy).
        </li>
        <li>Payouts dashboard (Stripe): balance, upcoming payout, fees, invoices.</li>
        <li>Basic analytics: sold qty, revenue, waste avoided (kg), top pickup slots.</li>
        <li>(Later) Bulk CSV upload &amp; templates; schedule recurring drops; API for POS integration.</li>
      </ul>

      <h3>3) Admin / Ops</h3>
      <ul>
        <li>Review/approve partners; KYB checks; flag risky categories.</li>
        <li>Content moderation: reported deals, takedown, audit log.</li>
        <li>Refund & dispute tooling; manual comp credits.</li>
        <li>Fees config: platform fee %, Stripe fees pass-through; promo codes.</li>
        <li>ESG reporting: total food saved (kg), CO₂e avoided, partner league board, monthly CSV export.</li>
      </ul>

      <h3>4) Notifications</h3>
      <ul>
        <li>Email/SMS on reservation, reminder 30 mins before pickup, and when partner updates time window.</li>
        <li>Push (later): opt-in web push for favourites or nearby drops.</li>
      </ul>

      <h3>5) Non-functional (MVP bar)</h3>
      <ul>
        <li>Performance: p95 page TTFB &lt; 500ms (edge caching); API p95 &lt; 300ms.</li>
        <li>Accessibility: WCAG AA for consumer flows; keyboard nav; alt text.</li>
        <li>Data privacy: AU-hosted data (Supabase Sydney); GDPR-like consents.</li>
        <li>Reliability: graceful expiry jobs; rate limits; audit logging.</li>
      </ul>

      <h3>6) Suggested tech stack (v0 friendly)</h3>
      <ul>
        <li>
          <strong>Frontend:</strong> Next.js App Router, Tailwind, shadcn/ui, TanStack Query.
        </li>
        <li>
          <strong>Auth:</strong> Supabase Auth or Auth.js; roles: consumer, partner, admin.
        </li>
        <li>
          <strong>DB:</strong> Supabase (Postgres) schemas below; RLS policies by role.
        </li>
        <li>
          <strong>Payments:</strong> Stripe Checkout + Connect (Express) for partner payouts.
        </li>
        <li>
          <strong>Maps/Geo:</strong> Mapbox; store lat/lng; Haversine search within N km.
        </li>
        <li>
          <strong>Emails:</strong> Resend; <code>reservation_created</code>, <code>pickup_reminder</code>,{" "}
          <code>payout_notification</code>.
        </li>
        <li>
          <strong>Background jobs:</strong> Vercel Cron or Supabase Scheduler for expiries/refunds.
        </li>
      </ul>

      <h3>7) Minimal schema (Postgres)</h3>
      <pre className="whitespace-pre-wrap text-xs bg-neutral-50 p-3 rounded-xl border">{`
  users(id, email, role, diet_prefs text[], radius_km int, created_at)
  partners(id, owner_user_id, name, abn, type, lat, lng, approved bool, stripe_account_id)
  deals(id, partner_id, title, category, diet text[], rrp_cents int, price_cents int, qty int,
        pickup_start timestamptz, pickup_end timestamptz, expires_at timestamptz, tags text[], created_at)
  orders(id, user_id, deal_id, qty, amount_cents, status enum('reserved','picked_up','refunded','expired'),
         qr_code, created_at, picked_up_at)
  reports(id, order_id, user_id, reason, details, created_at)
  payouts(id, partner_id, amount_cents, period_start, period_end, status)
`}</pre>

      <h3>8) Key API endpoints (REST)</h3>
      <ul>
        <li>
          <code>POST /api/partners/apply</code> – create partner; admin review.
        </li>
        <li>
          <code>POST /api/deals</code> – partner creates deal; <code>PATCH /api/deals/:id</code>.
        </li>
        <li>
          <code>POST /api/checkout</code> – Stripe Checkout session; returns URL.
        </li>
        <li>
          <code>POST /api/webhooks/stripe</code> – on <em>payment_succeeded</em>, create order + QR.
        </li>
        <li>
          <code>POST /api/orders/:id/verify</code> – partner scans QR to mark picked up.
        </li>
        <li>
          <code>POST /api/orders/:id/refund</code> – admin/auto on expiry per policy.
        </li>
      </ul>

      <h3>9) Success metrics (MVP)</h3>
      <ul>
        <li>GMV, take rate, orders/week, item sell-through %, avg discount %.</li>
        <li>Food saved (kg), CO₂e avoided (kg), active partners, repeat rate.</li>
      </ul>

      <h3>10) Roadmap next</h3>
      <ul>
        <li>Simple map view & clustering; real-time drops; referral program.</li>
        <li>Cold-chain flag + pickup SLA, partner compliance checklist.</li>
        <li>B2B marketplace lane with minimum order qty & delivery quotes.</li>
      </ul>

      <p>
        <em>Tip:</em> Use this prototype to walk judges/investors through: discover → reserve → pickup verification →
        impact analytics.
      </p>
    </section>
  )
}

function Analytics({ orders }) {
  const totalOrders = orders.length
  const totalFoodSaved = Math.round((co2eSaved(orders) / 2.5) * 10) / 10
  const totalCO2eAvoided = Math.round(co2eSaved(orders))

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Orders</p>
              <p className="text-2xl font-bold text-neutral-900">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">🛒</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Food Saved (est.)</p>
              <p className="text-2xl font-bold text-green-600">{totalFoodSaved} kg</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🥗</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">CO₂e Avoided (est.)</p>
              <p className="text-2xl font-bold text-emerald-600">{totalCO2eAvoided} kg</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 text-xl">🌍</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Deal</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.dealId} className="border-b border-neutral-50">
                    <td className="py-3 px-2 text-sm">{order.title}</td>
                    <td className="py-3 px-2 text-sm">{order.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
