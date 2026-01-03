'use client'

import Link from 'next/link'
import { useState } from 'react'
import Explore from '../components/Explore'
import { Deal, Filters } from '../types'

export default function HomePage() {
  // Empty deals array for landing page - no deals shown
  const [deals] = useState<Deal[]>([])

  const [filters, setFilters] = useState<Filters>({
    q: '',
    cat: 'All',
    diet: 'All',
    maxKm: 10
  })

  const handleReserve = (deal: Deal, qty: number = 1) => {
    console.log('Reserving deal:', deal.title, 'Quantity:', qty)
    // This would typically navigate to login or cart
    alert(`Reserved ${qty}x ${deal.title} from ${deal.vendor}!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center gap-3">
            {/* <img src="/images/zerosaver-logo.png" alt="ZeroSaver Logo" className="h-12" /> */}
            <span className="text-2xl font-bold text-emerald-700">ZeroSaver</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/login"
              className="px-4 py-2 rounded-full border border-emerald-200 bg-white hover:bg-emerald-50 transition-colors text-emerald-700"
            >
              🔑 Login
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              ✨ Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <Explore 
          deals={deals}
          filters={filters}
          setFilters={setFilters}
          onReserve={handleReserve}
        />
      </main>

      <footer className="border-t bg-white mt-16">
        <div className="max-w-6xl mx-auto p-4 text-sm text-gray-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} ZeroSaver · Save food, save money, save the planet 🌱</div>
          <div className="italic">MVP Prototype</div>
        </div>
      </footer>
    </div>
  )
}