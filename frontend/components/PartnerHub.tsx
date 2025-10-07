import { useState, useRef } from 'react'

// Simple partner data for now
const PARTNERS = [
  { id: "v1", name: "Sunset Sushi", approved: true, type: "Restaurant" },
  { id: "v2", name: "Daily Bakery", approved: true, type: "Bakery" },
  { id: "v3", name: "Green Grocer", approved: true, type: "Grocer" },
]

interface PartnerHubProps {
  onCreateDeal: (dealData: any) => void
}

export default function PartnerHub({ onCreateDeal }: PartnerHubProps) {
  const [form, setForm] = useState({
    vendorId: PARTNERS[0]?.id || "v1",
    title: "",
    description: "",
    imageUrl: "",
    category: "Restaurant",
    price: "0",        // Changed from 0 to "0"
    originalPrice: "0", // Changed from 0 to "0"
    quantity: "1",     // Changed from 1 to "1"
    pickupAddress: "",
  })
  
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const vendor = PARTNERS.find((p) => p.id === form.vendorId)
  const descLimit = 240

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB')
      return
    }

    setImageUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE}/api/deals/upload-image/`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setForm({ ...form, imageUrl: `${API_BASE}${data.image_url}` })
        setImagePreview(`${API_BASE}${data.image_url}`)
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.detail}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = () => {
    if (!vendor?.approved) return alert("Your partner account is pending approval.")
    
      const dealData = {
        title: form.title,
        restaurant_name: vendor.name,
        description: form.description,
        price: Math.round(parseFloat(form.price) * 100), // Convert string to number
        pickup_address: form.pickupAddress,
        quantity: parseInt(form.quantity), // Convert string to number
        image_url: form.imageUrl,
        ready_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      }

    onCreateDeal(dealData)
    
    // Reset form
    setForm({ 
      ...form, 
      title: "", 
      description: "", 
      imageUrl: "", 
      price: "0", 
      originalPrice: "0", 
      quantity: "1",
      pickupAddress: ""
    })
  }
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setForm({ ...form, quantity: value })
    }
  }
  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setForm({ ...form, originalPrice: value })
    }
  }
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setForm({ ...form, price: value })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 text-center border border-primary/20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-3">
          🏪 Partner Hub
        </h1>
        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
          Create new food deals and help reduce waste while earning revenue from surplus inventory!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-card border rounded-2xl p-6">
          <div className="font-semibold mb-4">Create New Deal</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            
            <label className="col-span-2">
              <span className="text-xs text-muted-foreground">Restaurant</span>
              <select
                value={form.vendorId}
                onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 bg-background"
              >
                {PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.approved ? "" : "(Pending)"}
                  </option>
                ))}
              </select>
            </label>

            <label className="col-span-2">
              <span className="text-xs text-muted-foreground">Deal Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., 2x Chicken Burrito Bowls"
                className="w-full border border-border rounded-xl px-3 py-2 bg-background"
              />
            </label>

            <label className="col-span-2">
              <span className="text-xs text-muted-foreground">
                Description <span className="text-muted-foreground/60">(max {descLimit} chars)</span>
              </span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, descLimit) })}
                placeholder="What's included, portion size, pickup instructions..."
                className="w-full border border-border rounded-xl px-3 py-2 h-20 resize-none bg-background"
              />
              <div className="text-xs text-muted-foreground/60 text-right mt-1">
                {form.description.length}/{descLimit}
              </div>
            </label>

            <label className="col-span-2">
              <span className="text-xs text-muted-foreground">Pickup Address</span>
              <input
                value={form.pickupAddress}
                onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                placeholder="e.g., 123 Main St, Counter pickup"
                className="w-full border border-border rounded-xl px-3 py-2 bg-background"
              />
            </label>

            <label className="col-span-2">
              <span className="text-xs text-muted-foreground">
                Deal Image <span className="text-muted-foreground/60">(optional)</span>
              </span>
              
              {/* Image Preview */}
              {(imagePreview || form.imageUrl) && (
                <div className="mb-3">
                  <img 
                    src={imagePreview || form.imageUrl} 
                    alt="Deal preview" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {imageUploading ? "📤 Uploading..." : "📷 Upload Image"}
                </button>
                
                {(imagePreview || form.imageUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, imageUrl: "" })
                      setImagePreview(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground/60 mt-1">
                Upload JPG, PNG, or GIF (max 5MB)
              </p>
            </label>

            <label>
              <span className="text-xs text-muted-foreground">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 bg-background"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Bakery">Bakery</option>
                <option value="Café">Café</option>
                <option value="Grocer">Grocer</option>
              </select>
            </label>

            <label>
              <span className="text-xs text-muted-foreground">Quantity Available</span>
              <input
                value={form.quantity}
                onChange={handleQuantityChange}
                className="w-full border border-border rounded-xl px-3 py-2 bg-background"
                placeholder="1"
              />
            </label>

            <label>
              <span className="text-xs text-muted-foreground">Original Price ($)</span>
              <input
                value={form.originalPrice}
                onChange={handleOriginalPriceChange}
                className="w-full border border-border rounded-xl px-3 py-2 bg-background"
                placeholder="0.00"
              />
            </label>

            <label>
              <span className="text-xs text-muted-foreground">ZeroSaver Price ($)</span>
              <input
                value={form.price}
                onChange={handlePriceChange}
                className="w-full border border-border rounded-xl px-3 py-2 bg-background"
                placeholder="0.00"
              />
            </label>
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="w-full mt-6 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
          >
            🎉 Publish Deal
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-card border rounded-2xl p-6">
          <div className="font-semibold mb-4">Deal Preview</div>
          <div className="border border-border rounded-2xl overflow-hidden">
            <div 
              className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl"
              style={
                form.imageUrl
                  ? { backgroundImage: `url(${form.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : {}
              }
            >
              {!form.imageUrl && "🍽️"}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold">{form.title || "Deal Title"}</div>
                <div className="font-bold text-green-700">${form.price}</div>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {vendor?.name || "Restaurant"} • {form.category} • 2.5km away
              </div>
              <div className="text-xs text-green-600 mb-3">
                ⏰ Available for pickup
              </div>
              <div className="text-xs text-muted-foreground">
                Stock: {form.quantity} • Pickup: {form.pickupAddress || "Address not set"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
