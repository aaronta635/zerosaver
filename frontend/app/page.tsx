import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center gap-3">
            <img src="/images/zerosaver-logo.png" alt="ZeroSaver Logo" className="h-12" />
            
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/login"
              className="px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors"
            >
              🔑 Login
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              ✨ Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="text-center space-y-8 py-16">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-balance">
              🌱 ZeroSaver
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground text-balance max-w-3xl mx-auto font-medium">
              Save food, save money, save the planet
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The marketplace where restaurants reduce food waste and customers enjoy amazing deals
            </p>
          </div>

          {/* Main Introduction */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 md:p-12 border border-emerald-200">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-emerald-900">
              🎉 Who knew saving the planet could be this delicious?
            </h2>
            <p className="text-xl text-emerald-800 text-balance max-w-3xl mx-auto leading-relaxed">
              ZeroSaver connects local restaurants, bakeries, and grocers with customers who want to 
              reduce food waste while enjoying incredible meals at amazing prices. Every purchase helps 
              fight climate change and supports local businesses.
            </p>
          </div>

          {/* How it Works */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-serif font-bold mb-3">Restaurants List Surplus</h3>
              <p className="text-muted-foreground">
                Local businesses list their surplus food at discounted prices to reduce waste and reach new customers
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-serif font-bold mb-3">Customers Browse & Buy</h3>
              <p className="text-muted-foreground">
                Discover amazing food deals near you, save money, and help reduce food waste in your community
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-serif font-bold mb-3">Planet Wins</h3>
              <p className="text-muted-foreground">
                Every meal saved reduces CO₂ emissions and helps build a more sustainable food system
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-serif font-bold mb-4">Ready to make a difference?</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of customers and restaurants already reducing food waste together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-lg"
              >
                🚀 Start Saving Food Today
              </Link>
              <Link 
                href="/login"
                className="px-8 py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 transition-colors font-medium text-lg"
              >
                🔑 Already have an account?
              </Link>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-muted/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3">🌍 Making a difference together</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">1000+</div>
                <div className="text-sm text-muted-foreground">Meals Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">50+</div>
                <div className="text-sm text-muted-foreground">Partner Restaurants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">2.5kg</div>
                <div className="text-sm text-muted-foreground">CO₂ Saved per Meal</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">70%</div>
                <div className="text-sm text-muted-foreground">Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card mt-16">
        <div className="max-w-6xl mx-auto p-4 text-sm text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} ZeroSaver · Save food, save money, save the planet 🌱</div>
          <div className="italic">MVP Prototype</div>
        </div>
      </footer>
    </div>
  )
}