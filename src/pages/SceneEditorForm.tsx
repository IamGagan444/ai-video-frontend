import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import VideoPlayer from "./VideoPlayer"
import type { Scene } from "../types"

interface SceneEditorFormProps {
  scene: Scene
  onUpdate: (updatedScene: Scene) => void
  onDelete: () => void
  onBackgroundUpload: (file: File) => void
}

const SceneEditorForm: React.FC<SceneEditorFormProps> = ({ scene, onUpdate, onDelete, onBackgroundUpload }) => {
  if (!scene) {
    return <div>No scene selected</div>
  }

  const handleTextChange = (index: number, newText: string) => {
    const updatedScene = {
      ...scene,
      sub_scenes: scene.sub_scenes.map((subScene, i) =>
        i === index
          ? {
              ...subScene,
              text_lines: [
                {
                  text: newText,
                  text_animation: [],
                  text_bg_animation: [],
                },
              ],
            }
          : subScene,
      ),
    }
    onUpdate(updatedScene)
  }

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onBackgroundUpload(file)
    }
  }

  // Ensure sub_scenes array exists and has at least one item
  const safeSubScenes = scene.sub_scenes || [
    {
      time: 0,
      location: { start_x: 0, start_y: 0 },
      displayItems: [],
      text_lines: [],
      subtitle: "",
      showSceneNumber: "",
      font: {
        name: "",
        size: 12,
        line_spacing: 1,
        color: "#FFFFFF",
        backcolor: "",
        keycolor: "",
        textShadowColor: "",
        textShadowWidthFr: 0,
        line_height: 1,
        case: null,
        decoration: [],
        fullWidth: false,
      },
    },
  ]

  // Map sub_scenes to draggable texts with safe access to properties
  const draggableTexts = safeSubScenes.map((subScene, index) => ({
    id: `text-${index}`,
    text: subScene.text_lines?.[0]?.text || "",
    x: subScene.location?.start_x ?? 50,
    y: subScene.location?.start_y ?? 50,
    style: {
      fontSize: `${subScene.font?.size ?? 16}px`,
      fontWeight: "500",
      color: subScene.font?.color || "#000000",
      backgroundColor: subScene.font?.backcolor || "#ffffff",
    },
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Edit Scene</h2>

      <div className="mb-4">
        <Label htmlFor="background">Background Image/Video</Label>
        <Input
          id="background"
          type="file"
          onChange={handleBackgroundChange}
          accept="image/*,video/*"
          className="mt-1"
        />
      </div>

      <VideoPlayer
        videoUrl={scene.background.src[0]?.url || ""}
        loopVideo={scene.background.src[0]?.loop_video || false}
        muteVideo={scene.background.src[0]?.mute || false}
        backgroundColor={scene.background.color || "#000000"}
        draggableTexts={draggableTexts}
        onTextDrag={(id, x, y) => {
          const index = Number.parseInt(id.split("-")[1])
          const updatedScene = {
            ...scene,
            sub_scenes: safeSubScenes.map((subScene, i) =>
              i === index
                ? {
                    ...subScene,
                    location: { start_x: x, start_y: y },
                  }
                : subScene,
            ),
          }
          onUpdate(updatedScene)
        }}
        onTextUpdate={(id, text) => {
          const index = Number.parseInt(id.split("-")[1])
          handleTextChange(index, text)
        }}
        onTextDelete={(id) => {
          const index = Number.parseInt(id.split("-")[1])
          const updatedScene = {
            ...scene,
            sub_scenes: safeSubScenes.filter((_, i) => i !== index),
          }
          onUpdate(updatedScene)
        }}
        onBackgroundUpload={onBackgroundUpload}
      />

      {safeSubScenes.map((subScene, index) => (
        <div key={index} className="mb-4">
          <Label htmlFor={`text-${index}`}>Scene Text {index + 1}</Label>
          <Textarea
            id={`text-${index}`}
            value={subScene.text_lines?.[0]?.text || ""}
            onChange={(e) => handleTextChange(index, e.target.value)}
            className="mt-1"
          />
        </div>
      ))}

      <div className="flex gap-2">
        <Button
          onClick={() => {
            const updatedScene = {
              ...scene,
              sub_scenes: [
                ...safeSubScenes,
                {
                  time: 0,
                  location: { start_x: 50, start_y: 50 },
                  displayItems: [],
                  text_lines: [{ text: "New Text", text_animation: [], text_bg_animation: [] }],
                  subtitle: "",
                  showSceneNumber: "",
                  font: {
                    name: "",
                    size: 16,
                    line_spacing: 1,
                    color: "#000000",
                    backcolor: "#ffffff",
                    keycolor: "",
                    textShadowColor: "",
                    textShadowWidthFr: 0,
                    line_height: 1,
                    case: null,
                    decoration: [],
                    fullWidth: false,
                  },
                },
              ],
            }
            onUpdate(updatedScene)
          }}
        >
          Add Text
        </Button>

        <Button variant="destructive" onClick={onDelete}>
          Delete Scene
        </Button>
      </div>
    </div>
  )
}

export default SceneEditorForm

