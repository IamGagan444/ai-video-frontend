

import {  useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from 'react-hot-toast'
import { InputForm } from './InputForm'
import { ScriptDisplay } from './ScriptDisplay'
import { VideoDialog } from './VideoDialog'
import { ErrorBoundary } from 'react-error-boundary'
import { FallbackProps } from 'react-error-boundary'

interface ScriptResponse {
  statusCode: number
  message: string
  data: {
    expandedScript: string
    accessToken: string
  }
  success: boolean
}

export function ScriptVideoGenerator() {
  const [generatedScript, setGeneratedScript] = useState('')
  const [token,setToken]=useState("")
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateScript = async (input: string) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ScriptResponse>('http://localhost:3000/api/generate-script', { input })
      setGeneratedScript(response.data.data.expandedScript)
      setToken(response.data.data.accessToken)
      toast.success(response.data.message)
    } catch (error) {
      console.error('Error generating script:', error)
      toast.error('Failed to generate script')
    } finally {
      setIsLoading(false)
    }
  }

  const generateVideo = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/api/generate-video', { expandedScript: generatedScript,accessToken:token })
      console.log("lkfdjlksdfjlkdfsjl:",response.data.data.status.preview)
      setVideoUrl(response.data.data.status.preview)
      toast.success('Video generated successfully')
    } catch (error) {
      console.error('Error generating video:', error)
      toast.error('Failed to generate video')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-4 max-w-3xl">
        <Toaster />
        <Card>
          <CardHeader>
            <CardTitle>Script and Video Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputForm onGenerateScript={generateScript} isLoading={isLoading} />
            {generatedScript && (
              <ScriptDisplay
                script={generatedScript}
                onGenerateVideo={generateVideo}
                isLoading={isLoading}
              />
            )}
          </CardContent>
          <CardFooter>
            {videoUrl && <VideoDialog videoUrl={videoUrl} />}
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  )
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="text-red-500 p-4">
      <h2>Oops! Something went wrong.</h2>
      <p>Error: {error.message}</p>
    </div>
  )
}

