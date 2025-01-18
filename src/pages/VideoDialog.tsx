import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  interface VideoDialogProps {
    videoUrl: string
  }
  
  export function VideoDialog({ videoUrl }: VideoDialogProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Show Video</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Generated Video</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <iframe
              src={videoUrl}
              className="w-full aspect-video"
              allowFullScreen
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
  
  