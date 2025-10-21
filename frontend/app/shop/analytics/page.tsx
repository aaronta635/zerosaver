'use client'

import { useState } from 'react'
import NavHeaderShop from '../../../components/NavHeaderShop'
import { Analytics } from '../../../components/Analytics'
import { Order } from '../../../types'

export default function ShopAnalyticsPage() {
  // Mock data for demonstration - in a real app, this would come from API
  // This represents orders fulfilled by this shop
  const [orders] = useState<Order[]>([
    { dealId: '1', title: 'Fresh Pastries & Coffee', qty: 15 },
    { dealId: '2', title: 'Daily Bread Surplus', qty: 8 },
    { dealId: '3', title: 'Lunch Special Box', qty: 12 },
    { dealId: '4', title: 'Bakery End-of-Day', qty: 6 },
    { dealId: '5', title: 'Sandwich Combo Deal', qty: 20 },
    { dealId: '6', title: 'Soup & Salad Special', qty: 10 },
    { dealId: '7', title: 'Dessert Surprise Box', qty: 5 },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeaderShop />
      
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Shop Analytics Dashboard</h1>
          <p className="text-emerald-700">Track your environmental impact and business performance</p>
        </div>
        
        <Analytics orders={orders} />
        
        {/* Additional shop-specific metrics */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <span>🏪</span>
            Business Impact Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-700">{orders.reduce((sum, order) => sum + order.qty, 0)}</div>
              <div className="text-sm text-emerald-600">Items Sold</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-700">{Math.round(orders.reduce((sum, order) => sum + order.qty, 0) * 0.6 * 100) / 100}kg</div>
              <div className="text-sm text-emerald-600">Waste Prevented</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-700">100%</div>
              <div className="text-sm text-emerald-600">Sustainability Score</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
