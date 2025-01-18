import { Loader2 } from 'lucide-react'

export function Loader({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

