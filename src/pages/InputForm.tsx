import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

interface InputFormProps {
  onGenerateScript: (input: string) => Promise<void>
  isLoading: boolean
}

export function InputForm({ onGenerateScript, isLoading }: InputFormProps) {
  const [userInput, setUserInput] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onGenerateScript(userInput)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Script</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter your text here"
            value={userInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !userInput.trim()}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Script
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

