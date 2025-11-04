import { Heart } from 'lucide-react'

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
        <Heart className="h-5 w-5 text-primary" />
      </div>
      <span className="text-xl font-semibold text-foreground">SkinCare</span>
    </div>
  )
}
