"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavHeaderShop from '../../components/NavHeaderShop'

interface Deal {
  id: string
  title: string
  restaurant_name: string
  description: string
  price: number
  quantity: number
  pickup_address: string
  image_url: string
  is_active: boolean
  ready_time: string
}

export default function ShopDashboard() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchMyDeals()
  }, [])

  const fetchMyDeals = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE}/api/deals/`)
      if (response.ok) {
        const data = await response.json()
        // Filter deals for this shop owner (you might want to add vendor_id filtering)
        setDeals(data)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeaderShop />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Deals</h1>
          <p className="text-gray-600">Manage your food deals and reduce waste!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-emerald-600">{deals.length}</div>
            <div className="text-gray-600">Total Deals</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {deals.filter(d => d.is_active).length}
            </div>
            <div className="text-gray-600">Active Deals</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {deals.reduce((sum, deal) => sum + deal.quantity, 0)}
            </div>
            <div className="text-gray-600">Total Items</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              ${(deals.reduce((sum, deal) => sum + (deal.price * deal.quantity), 0) / 100).toFixed(2)}
            </div>
            <div className="text-gray-600">Total Value</div>
          </div>
        </div>

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals yet</h3>
            <p className="text-gray-600 mb-6">Create your first deal to start reducing food waste!</p>
            <Link 
              href="/shop/partner"
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 inline-block"
            >
              Create Your First Deal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                  {deal.image_url ? (
                    <img src={deal.image_url} alt={deal.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-4xl">🍽️</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deal.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {deal.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{deal.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      ${(deal.price / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {deal.quantity} available
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    📍 {deal.pickup_address}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                      {deal.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
