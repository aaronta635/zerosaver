import React from 'react'
import { Order } from '../types'

interface AnalyticsProps {
  orders: Order[]
}

// Helper function to calculate CO2 saved based on orders
function co2eSaved(orders: Order[]): number {
  // Estimate: 1 kg of food waste = ~2.5 kg CO2e
  // Each order qty represents items, estimate 0.5kg per item
  const totalFoodWeight = orders.reduce((total, order) => {
    return total + (order.qty * 0.5) // 0.5kg per item
  }, 0)
  return totalFoodWeight * 2.5
}

export function Analytics({ orders }: AnalyticsProps) {
  const totalOrders = orders.length
  const totalFoodSaved = Math.round((co2eSaved(orders) / 2.5) * 10) / 10
  const totalCO2eAvoided = Math.round(co2eSaved(orders))
  const treesEquivalent = Math.round(totalCO2eAvoided / 22)
  const landfillDiverted = Math.round(totalFoodSaved * 0.8) // 80% would go to landfill

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl co2-pulse">🌍</span>
        <h2 className="text-2xl font-bold text-emerald-800">Environmental Impact Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="impact-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-emerald-800">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 text-xl">🛒</span>
            </div>
          </div>
        </div>

        <div className="impact-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Food Rescued</p>
              <p className="text-2xl font-bold text-emerald-800">{totalFoodSaved} kg</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 text-xl">🥗</span>
            </div>
          </div>
        </div>

        <div className="impact-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">CO₂ Avoided</p>
              <p className="text-2xl font-bold text-emerald-800">{totalCO2eAvoided} kg</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center co2-pulse">
              <span className="text-emerald-600 text-xl">🌍</span>
            </div>
          </div>
        </div>

        <div className="impact-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Trees Equivalent</p>
              <p className="text-2xl font-bold text-emerald-800">{treesEquivalent}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center leaf-float">
              <span className="text-emerald-600 text-xl">🌳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="impact-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <span>🌱</span>
          Environmental Impact Breakdown
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-emerald-700 mb-2">Food Waste Prevention</h4>
            <ul className="text-sm text-emerald-600 space-y-1">
              <li>• {totalFoodSaved}kg of food rescued from waste</li>
              <li>• {landfillDiverted}kg diverted from landfills</li>
              <li>• Prevented methane emissions from decomposition</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-emerald-700 mb-2">Climate Impact</h4>
            <ul className="text-sm text-emerald-600 space-y-1">
              <li>• {totalCO2eAvoided}kg CO₂ equivalent avoided</li>
              <li>• Equal to {treesEquivalent} trees planted and grown for 1 year</li>
              <li>• Reduced carbon footprint of food production</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
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
                  <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.dealId} className="border-b border-neutral-50">
                    <td className="py-3 px-2 text-sm">{order.title}</td>
                    <td className="py-3 px-2 text-sm">{order.qty}</td>
                    <td className="py-3 px-2 text-sm">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .impact-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
        }
        
        .co2-pulse {
          animation: pulse 2s infinite;
        }
        
        .leaf-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  )
}