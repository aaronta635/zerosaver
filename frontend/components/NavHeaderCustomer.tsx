import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "🏠 Home" },
    { href: "/customer", label: "🍎 Explore Goodies" },
    { href: "/customer/analytics", label: "📊 My Impact" },
  ]

  return (
    <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-3 p-3 md:p-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/zerosaver-logo.png" alt="ZeroSaver Logo" className=' h-16'/>
          
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
    
          
          <Link
            href="/customer/cart"
            className="px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors relative"
          >
            🛒 My Cart
            {/* Cart count would go here when implemented */}
          </Link>
        </div>
      </div>
    </div>
  )
}
