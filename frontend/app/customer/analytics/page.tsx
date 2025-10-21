'use client'

import { useState } from 'react'
import NavHeaderCustomer from '../../../components/NavHeaderCustomer'
import { Analytics } from '../../../components/Analytics'
import { Order } from '../../../types'

export default function CustomerAnalyticsPage() {
  // Mock data for demonstration - in a real app, this would come from API
  const [orders] = useState<Order[]>([
    { dealId: '1', title: 'Fresh Pastries & Coffee', qty: 2 },
    { dealId: '2', title: 'Artisan Bread Selection', qty: 1 },
    { dealId: '3', title: 'Organic Salad Bowl', qty: 3 },
    { dealId: '4', title: 'Bakery Surplus Box', qty: 1 },
    { dealId: '5', title: 'Restaurant Meal Deal', qty: 2 },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeaderCustomer />
      
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">My Environmental Impact</h1>
          <p className="text-emerald-700">See how your food rescue efforts are helping save the planet</p>
        </div>
        
        <Analytics orders={orders} />
      </main>
    </div>
  )
}
