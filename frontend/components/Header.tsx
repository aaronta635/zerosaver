import { HeaderProps } from '../types'

export default function Header({ activeTab, setActiveTab, role, setRole, cartCount }: HeaderProps) {
  return (
    <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-3 p-3 md:p-4">
        <div className="flex items-center gap-3">
          <img src="/images/zerosaver-logo.png" alt="ZeroSaver Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <div className="font-black text-xl md:text-2xl tracking-tight">
            <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-xl">Zero</span>
            <span className="ml-1">Saver</span>
            <span className="text-xs ml-2 text-muted-foreground font-normal">🌱 Save food, save earth!</span>
          </div>
        </div>
        <nav className="ml-4 flex gap-2 md:gap-3 text-sm">
          {[
            { key: "explore", label: "🍎 Explore Goodies" },
            { key: "partner", label: "🏪 Partner Hub" },
            { key: "cart", label: "🛒 My Basket" },
            { key: "analytics", label: "📊 Impact Stats" },
            { key: "admin", label: "⚙️ Admin Magic" },
            { key: "docs", label: "📚 How It Works" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full border transition-all ${
                activeTab === t.key
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card hover:bg-secondary border-border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden md:inline text-muted-foreground">You're a:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 bg-card"
          >
            <option value="guest">🌟 Guest Explorer</option>
            <option value="consumer">🍽️ Food Saver</option>
            <option value="partner">🏪 Food Hero</option>
            <option value="admin">👑 Super Admin</option>
          </select>
          <div className="relative">
            <button
              className="px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors"
              onClick={() => setActiveTab("cart")}
            >
              🛒 My Basket
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
