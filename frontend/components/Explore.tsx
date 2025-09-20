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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
