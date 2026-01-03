import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavHeaderShop() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "🏠 Home" },
    { href: "/shop", label: "🏪 My Shop" },
    { href: "/shop/partner", label: "📝 Create Deal" },
    { href: "/shop/analytics", label: "📊 Analytics" },
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
          <span className="hidden md:inline text-muted-foreground">Welcome, Shop Owner</span>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Account</span>
            <button className="px-3 py-1 border border-border rounded-lg bg-card hover:bg-secondary transition-colors">
              👤 Profile
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/login'
              }}
              className="px-3 py-1 border border-border rounded-lg bg-card hover:bg-secondary transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
