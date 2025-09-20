// lib/api.ts
const API_BASE_URL = 'http://localhost:8000'
import { CreateDealRequest, CreateDealResponse } from "@/types"


export async function createDeal(dealData: CreateDealRequest): Promise<CreateDealResponse> {
  const response = await fetch(`${API_BASE_URL}/api/deals/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dealData)
  })
  
  if (!response.ok) {
    throw new Error(`Failed to create deal: ${response.status}`)
  }
  
  return response.json()
}