import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "🏠 Home" },
    { href: "/explore", label: "🍎 Explore Goodies" },
    { href: "/partner", label: "🏪 Partner Hub" },
  ]

  return (
    <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-3 p-3 md:p-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/zerosaver-logo.png" alt="ZeroSaver Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <div className="font-black text-xl md:text-2xl tracking-tight">
            <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-xl">Zero</span>
            <span className="ml-1">Saver</span>
            <span className="text-xs ml-2 text-muted-foreground font-normal">🌱 Save food, save earth!</span>
          </div>
        </Link>
        
        <nav className="ml-4 flex gap-2 md:gap-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full border transition-all ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card hover:bg-secondary border-border"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden md:inline text-muted-foreground">You're a:</span>
          <select
            defaultValue="guest"
            className="border border-border rounded-lg px-3 py-2 bg-card"
          >
            <option value="guest">🌟 Guest Explorer</option>
            <option value="consumer">🍽️ Food Saver</option>
            <option value="partner">🏪 Food Hero</option>
            <option value="admin">👑 Super Admin</option>
          </select>
          
          <Link
            href="/cart"
            className="px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors relative"
          >
            🛒 My Basket
            {/* Cart count would go here when implemented */}
          </Link>
        </div>
      </div>
    </div>
  )
}
