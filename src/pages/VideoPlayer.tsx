import type React from "react"
import { useState, useRef, useCallback } from "react"
import { PlayCircle, PauseCircle, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DraggableText {
  id: string
  text: string
  x: number
  y: number
}

interface VideoPlayerProps {
  videoUrl: string
  loopVideo: boolean
  muteVideo: boolean
  backgroundColor: string
  draggableTexts: DraggableText[]
  onTextDrag: (id: string, x: number, y: number) => void
  onTextUpdate: (id: string, text: string) => void
  onTextDelete: (id: string) => void
  onBackgroundUpload: (file: File) => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  loopVideo,
  muteVideo,
  backgroundColor,
  draggableTexts,
  onTextDrag,
  onTextUpdate,
  onTextDelete,
  onBackgroundUpload,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDragging, setIsDragging] = useState<string | null>(null)
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMouseDown = (id: string) => {
    setIsDragging(id)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect()
      let x = e.clientX - rect.left
      let y = e.clientY - rect.top

      // Ensure text stays within video boundaries
      x = Math.max(0, Math.min(x, rect.width - 100)) // Adjust 100 based on text width
      y = Math.max(0, Math.min(y, rect.height - 50)) // Adjust 50 based on text height

      onTextDrag(isDragging, x, y)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  const handleTextClick = (id: string) => {
    setSelectedTextId(id)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    onTextUpdate(id, e.target.value)
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleBackgroundUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        onBackgroundUpload(file)
      }
    },
    [onBackgroundUpload],
  )

  return (
    <div
      className="relative bg-gray-800 h-52 rounded-lg mb-4"
      style={{ backgroundColor }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          controls={false}
          loop={loopVideo}
          muted={muteVideo}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Button onClick={handleBackgroundUpload}>
            <Upload className="mr-2 h-4 w-4" /> Upload Background
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
        </div>
      )}
      {isPlaying ? (
        <PauseCircle
          size={48}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer"
          onClick={handlePlayPause}
        />
      ) : (
        <PlayCircle
          size={48}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer"
          onClick={handlePlayPause}
        />
      )}
      {draggableTexts.map((text) => (
        <div
          key={text.id}
          style={{
            position: "absolute",
            left: `${text.x}px`,
            top: `${text.y}px`,
            cursor: "move",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "4px",
            borderRadius: "4px",
          }}
          onMouseDown={() => handleMouseDown(text.id)}
          onClick={() => handleTextClick(text.id)}
        >
          {selectedTextId === text.id ? (
            <input
              type="text"
              value={text.text}
              onChange={(e) => handleTextChange(e, text.id)}
              className="bg-transparent border-none text-white outline-none"
            />
          ) : (
            text.text
          )}
          <div
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onTextDelete(text.id)
            }}
          >
            <Trash2 size={12} className="text-white" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default VideoPlayer

