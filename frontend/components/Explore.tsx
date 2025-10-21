import { useState } from 'react'
import { ExploreProps, Deal } from '../types'

const CATEGORIES = ["Bento", "Bakery", "Grocer", "Café", "Restaurant", "Wholesaler"]
const DIETS = ["Vegan", "Vegetarian", "Gluten-free", "Halal"]

export default function Explore({ deals, filters, setFilters, onReserve }: ExploreProps) {
  const currency = (n: number) => `$${((n || 0)/100).toFixed(2)}`
  const minutesLeft = (isoTime: string) => Math.max(0, Math.floor((new Date(isoTime).getTime() - new Date().getTime()) / 60000))

  return (
    <section className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 min-h-[500px]">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="p-8 md:p-12 relative z-10">
            <div className="absolute top-4 right-4 leaf-float">
              <span className="text-4xl">🌱</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-emerald-900 mb-6 leading-tight">
              Rescue Food,
              <br />
              Save Our Planet
            </h1>
            <p className="text-lg md:text-xl text-emerald-800 mb-8 leading-relaxed">
              Every meal you rescue helps reduce food waste and fights climate change. Join thousands making every bite
              count for our environment.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-5 py-3 rounded-full border-2 border-emerald-200 shadow-sm">
                <span className="font-semibold text-emerald-700">🌍 Reduce CO₂ emissions</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-full border-2 border-emerald-200 shadow-sm">
                <span className="font-semibold text-emerald-700">💚 Save up to 70%</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-full border-2 border-emerald-200 shadow-sm">
                <span className="font-semibold text-emerald-700">🌱 Support local</span>
              </div>
            </div>
          </div>
          <div className="relative h-full min-h-[500px]">
            <img
              src="/images/first.png"
              alt="People enjoying rescued food"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* How ZeroSaver Works */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-emerald-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">How ZeroSaver Works</h2>
          <p className="text-lg text-emerald-700">Four simple steps to rescue food and save the planet</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-2 border-emerald-100">
              <img
                src="/images/b1.png"
                alt="Browse deals"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">Browse Deals</h3>
            <p className="text-sm text-emerald-700">Discover surplus food from local businesses near you</p>
          </div>
          <div className="text-center">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-2 border-emerald-100">
              <img
                src="/images/b2.png"
                alt="Reserve & pay"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">Reserve & Pay</h3>
            <p className="text-sm text-emerald-700">Secure your meal at up to 70% off original price</p>
          </div>
          <div className="text-center">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-2 border-emerald-100">
              <img
                src="/images/b3.png"
                alt="Pick up"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">Pick Up</h3>
            <p className="text-sm text-emerald-700">Collect your food during the pickup window</p>
          </div>
          <div className="text-center">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-2 border-emerald-100">
              <img
                src="/images/b4.png"
                alt="Enjoy & save"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              4
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">Enjoy & Save</h3>
            <p className="text-sm text-emerald-700">Savor great food while helping the planet</p>
          </div>
        </div>
      </div>

      {/* Partner Network Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-700 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-full min-h-[400px] order-2 md:order-1">
            <img
              src="/images/last.png"
              alt="Local business partner"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:p-12 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Partner Network</h2>
            <p className="text-lg mb-6 text-emerald-50">
              Over 500+ local businesses are already reducing waste and reaching new customers through ZeroSaver.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span>Reduce food waste by up to 80%</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span>Attract eco-conscious customers</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span>Easy setup in under 10 minutes</span>
              </li>
            </ul>
            <button className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
              Become a Partner
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-emerald-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">What Our Community Says</h2>
          <p className="text-lg text-emerald-700">Join thousands of food rescuers making a difference</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-200">
                <img
                  src="/placeholder-user.jpg"
                  alt="Sarah M."
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-emerald-900">Sarah M.</div>
                <div className="text-sm text-emerald-600">Regular Rescuer</div>
              </div>
            </div>
            <div className="text-yellow-500 mb-2">★★★★★</div>
            <p className="text-sm text-emerald-800">
              "I've saved over $200 this month while helping reduce food waste. The quality is amazing and I feel good
              about my impact!"
            </p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-200">
                <img
                  src="/placeholder-user.jpg"
                  alt="James L."
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-emerald-900">James L.</div>
                <div className="text-sm text-emerald-600">Cafe Owner</div>
              </div>
            </div>
            <div className="text-yellow-500 mb-2">★★★★★</div>
            <p className="text-sm text-emerald-800">
              "As a partner, ZeroSaver has helped us reduce waste by 60% and attract new customers who love our
              sustainability efforts."
            </p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-200">
                <img
                  src="/placeholder-user.jpg"
                  alt="Emily K."
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-emerald-900">Emily K.</div>
                <div className="text-sm text-emerald-600">Student</div>
              </div>
            </div>
            <div className="text-yellow-500 mb-2">★★★★★</div>
            <p className="text-sm text-emerald-800">
              "Perfect for students on a budget! I get delicious meals from local restaurants and help the environment
              at the same time."
            </p>
          </div>
        </div>
      </div>

      {/* Only show filters and deals sections if there are deals */}
      {deals.length > 0 && (
        <>
          {/* Filters Section */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
            <h3 className="font-semibold mb-4 text-emerald-900">Find Your Perfect Deal</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search deals..."
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="border border-emerald-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={filters.cat}
                onChange={(e) => setFilters({ ...filters, cat: e.target.value })}
                className="border border-emerald-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="border border-emerald-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Diets</option>
                {DIETS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-emerald-900">Within:</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.maxKm}
                  onChange={(e) => setFilters({ ...filters, maxKm: Number.parseInt(e.target.value) })}
                  className="flex-1 accent-emerald-600"
                />
                <span className="text-sm font-medium text-emerald-900">{filters.maxKm}km</span>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const timeLeft = minutesLeft(deal.expiresAt || deal.ready_time || new Date().toISOString())
              const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
              const itemCO2Saved = Math.round(0.4 * 2.5) // 0.4kg food * 2.5 CO2e factor

              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-xl border border-emerald-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="aspect-video bg-emerald-50 flex items-center justify-center relative">
                    {deal.imageUrl || deal.image_url ? (
                      <img
                        src={deal.imageUrl || deal.image_url || "/placeholder.svg"}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-emerald-400 text-4xl">🍽️</div>
                    )}
                    {/* <div className="absolute top-2 left-2 bg-emerald-100 text-gray px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span>🌱</span>
                      <span>{itemCO2Saved}kg CO₂</span>
                    </div> */}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-emerald-900">{deal.title}</h3>
                        <p className="text-sm text-emerald-600">{deal.vendor || deal.restaurant_name}</p>
                      </div>
                      <div className="bg-emerald-100 text-gray px-2 py-1 rounded-full text-xs font-bold">
                        {discount}% OFF
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{deal.description}</p>

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
                        <span className="text-sm text-gray-500 line-through">{currency(deal.originalPrice)}</span>
                      </div>
                      <div className="text-sm text-gray-500">
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
        </>
      )}
    </section>
  )
}