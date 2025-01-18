import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader } from './Loader'

interface VideoDialogProps {
  videoUrl: string
}

export function VideoDialog({ videoUrl }: VideoDialogProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Show Video</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Generated Video</DialogTitle>
        </DialogHeader>
        <div className="mt-4 relative" style={{ minHeight: '400px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader text="Wait..." />
            </div>
          )}
          <iframe
            src={videoUrl}
            className="w-full aspect-video"
            allowFullScreen
            onLoad={handleIframeLoad}
            style={{ display: isLoading ? 'none' : 'block' }}
          ></iframe>
          <Button className="mt-4" asChild>
            <a href={videoUrl} download target="_blank" rel="noopener noreferrer">
              Download Video
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

