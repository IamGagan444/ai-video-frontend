import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

interface ScriptDisplayProps {
  script: string
  onGenerateVideo: () => Promise<void>
  isLoading: boolean
}

export function ScriptDisplay({ script, onGenerateVideo, isLoading }: ScriptDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Script</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={script}
          readOnly
          className="min-h-[300px] w-full"
        />
        <Button onClick={onGenerateVideo} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Video
        </Button>
      </CardContent>
    </Card>
  )
}

