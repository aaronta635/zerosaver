"use client"

import { useState } from 'react'
import PartnerHub from '../../../components/PartnerHub'
import NavHeaderShop from '../../../components/NavHeaderShop'
import { createDeal } from '../../../lib/api'


export default function PartnerPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleCreateDeal = async (dealData: any) => {
    setIsLoading(true)
    
    try {
      const result = await createDeal(dealData)
      console.log('Deal created successfully:', result)
      alert('Deal published successfully! 🎉')
    } catch (error) {
      console.error('Failed to create deal:', error)
      alert('Failed to create deal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavHeaderShop />
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <PartnerHub onCreateDeal={handleCreateDeal} />
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">Creating deal...</div>
          </div>
        )}
      </main>
    </div>
  )
}