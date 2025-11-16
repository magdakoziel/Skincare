"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Camera, MessageCircle, BookOpen, Package } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/products", label: "Products", icon: Package },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/glossary", label: "Glossary", icon: BookOpen },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Bottom Navigation - All Devices */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-gradient-to-r from-purple-50/90 via-pink-50/85 to-rose-50/90 dark:from-purple-950/90 dark:via-pink-950/85 dark:to-rose-950/90 backdrop-blur-md shadow-lg supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-around h-16 px-2 md:px-4 container mx-auto max-w-4xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 rounded-lg px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-all hover:scale-105",
                  isActive
                    ? "text-primary bg-gradient-to-br from-purple-100/80 via-pink-100/70 to-rose-100/80 dark:from-purple-900/60 dark:via-pink-900/50 dark:to-rose-900/60 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                )}
              >
                <Icon className={cn("h-5 w-5 md:h-4 md:w-4", isActive && "text-primary")} />
                <span className={cn(
                  "text-[10px] md:text-sm",
                  isActive && "font-semibold"
                )}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
