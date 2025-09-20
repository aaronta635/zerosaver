import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="text-center space-y-8 py-16">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-balance">
              🌱 ZeroSaver
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Save food, save money, save the planet
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-primary/20">
            <h2 className="text-2xl font-serif font-bold mb-4">
              🎉 Who knew saving the planet could be this delicious?
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Discover surplus food from local restaurants, bakeries, and grocers at amazing prices. 
              Help reduce food waste while enjoying great meals!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="/explore"
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-serif font-bold mb-2">Explore Deals</h3>
              <p className="text-muted-foreground">
                Browse amazing food deals from local partners and rescue delicious meals
              </p>
            </Link>

            <Link 
              href="/partner"
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-serif font-bold mb-2">Partner Hub</h3>
              <p className="text-muted-foreground">
                List your surplus food and connect with customers who care about reducing waste
              </p>
            </Link>
          </div>

          <div className="pt-8">
            <div className="bg-muted/30 rounded-xl p-6 text-sm text-muted-foreground">
              <p className="font-medium mb-2">🌍 Making a difference together</p>
              <p>Every meal saved prevents food waste and reduces environmental impact</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto p-4 text-sm text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} ZeroSaver · Save food, save money, save the planet 🌱 · Demo</div>
          <div className="italic">MVP Prototype – not production code</div>
        </div>
      </footer>
    </div>
  )
}