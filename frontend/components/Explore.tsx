import { useState } from 'react'
import { ExploreProps, Deal } from '../types'

const CATEGORIES = ["Bento", "Bakery", "Grocer", "Café", "Restaurant", "Wholesaler"]
const DIETS = ["Vegan", "Vegetarian", "Gluten-free", "Halal"]

const currency = (n: number) => `$${(n/100 || 0).toFixed(2)}`
const minutesLeft = (iso: string) => Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 60000))

export default function Explore({ deals, filters, setFilters, onReserve }: ExploreProps) {
  const [selected, setSelected] = useState<Deal | null>(null)

  return (
    <section className="space-y-6">
      <div className="eco-gradient rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 leaf-float">
          <span className="text-4xl">🌱</span>
        </div>
        <div className="absolute bottom-4 left-4 leaf-float" style={{ animationDelay: "1s" }}>
          <span className="text-3xl">🍃</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-emerald-900 mb-4">Rescue Food, Save Our Planet</h1>
        <p className="text-lg md:text-xl text-emerald-800 mb-6 max-w-2xl mx-auto">
          Every meal you rescue helps reduce food waste and fights climate change. Join the movement to make every bite
          count for our environment.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
            <span className="font-semibold text-emerald-700">🌍 Reduce CO₂ emissions</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
            <span className="font-semibold text-emerald-700">💚 Save up to 70%</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
            <span className="font-semibold text-emerald-700">🌱 Support local businesses</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        <h3 className="font-semibold mb-4">Find Your Perfect Deal</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search deals..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="border border-border rounded-lg px-4 py-2 bg-input"
          />
          <select
            value={filters.cat}
            onChange={(e) => setFilters({ ...filters, cat: e.target.value })}
            className="border border-border rounded-lg px-4 py-2 bg-input"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={filters.diet}
            onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
            className="border border-border rounded-lg px-4 py-2 bg-input"
          >
            <option value="All">All Diets</option>
            {DIETS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Within:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.maxKm}
              onChange={(e) => setFilters({ ...filters, maxKm: Number.parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium">{filters.maxKm}km</span>
          </div>
        </div>
      </div>

      {deals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No deals found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more options</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const timeLeft = minutesLeft(deal.expiresAt || deal.ready_time || new Date().toISOString())
          const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
          const itemCO2Saved = Math.round(0.4 * 2.5) // 0.4kg food * 2.5 CO2e factor

          return (
            <div
              key={deal.id}
              className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="aspect-video bg-muted flex items-center justify-center relative">
                {deal.imageUrl || deal.image_url ? (
                  <img
                    src={deal.imageUrl || deal.image_url || "/placeholder.svg"}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground text-4xl">🍽️</div>
                )}
                <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span>🌱</span>
                  <span>{itemCO2Saved}kg CO₂</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{deal.title}</h3>
                    <p className="text-sm text-muted-foreground">{deal.vendor || deal.restaurant_name}</p>
                  </div>
                  <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                    {discount}% OFF
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{deal.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  {deal.diet?.map((d) => (
                    <span
                      key={d}
                      className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-700">{currency(deal.price)}</span>
                    <span className="text-sm text-muted-foreground line-through">{currency(deal.originalPrice)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {deal.quantity} left • {deal.distanceKm}km away
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-emerald-700 font-medium">
                    ⏰ {timeLeft > 60 ? `${Math.floor(timeLeft / 60)}h ${timeLeft % 60}m` : `${timeLeft}m`} left!
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{deal.rating || 4.5}</span>
                  </div>
                </div>

                <button
                  onClick={() => onReserve(deal)}
                  disabled={deal.quantity < 1}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deal.quantity < 1 ? "Sold Out" : "🌱 Rescue Now"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-xl w-full bg-white rounded-2xl border" onClick={(e) => e.stopPropagation()}>
            <div
              className="h-40 rounded-t-2xl bg-gradient-to-br from-emerald-100 to-emerald-200"
              style={
                selected.imageUrl || selected.image_url
                  ? {
                      backgroundImage: `url(${selected.imageUrl || selected.image_url})`,
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
                    {selected.vendor || selected.restaurant_name} • {selected.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-500 line-through text-xs">{currency(selected.originalPrice)}</div>
                  <div className="text-xl font-black text-green-700">{currency(selected.price)}</div>
                </div>
              </div>
              {selected.description && <p className="mt-2 text-sm">{selected.description}</p>}
              <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
                {(selected.diet?.[0] || "").length > 0 && (
                  <span className="px-2 py-0.5 bg-neutral-100 rounded-full">{selected.diet[0]}</span>
                )}
                {selected.coldChain && <span className="px-2 py-0.5 bg-neutral-100 rounded-full">Cold chain</span>}
                {selected.b2b && <span className="px-2 py-0.5 bg-neutral-100 rounded-full">B2B</span>}
                <span className="ml-auto px-2 py-0.5 rounded-full bg-green-600 text-white">
                  {minutesLeft(selected.expiresAt || selected.ready_time || new Date().toISOString())}m left
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                Stock: {selected.quantity} · Min order: {selected.minOrderQty || 1}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    onReserve(selected, selected.minOrderQty || 1)
                    setSelected(null)
                  }}
                >
                  Reserve
                </button>
                <button className="px-4 py-2 rounded-xl border" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
