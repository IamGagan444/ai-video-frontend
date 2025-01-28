import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SceneEditorForm from "./SceneEditorForm"

import { Scene } from "@/types"



interface SceneEditorProps {
  scenes?: Scene[]
}

const SceneEditor: React.FC<SceneEditorProps> = ({ scenes: propsScenes = [] }) => {
  const [scenes, setScenes] = useState<Scene[]>(propsScenes.map((scene, index) => ({ ...scene, id: `scene-${index}` })))
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  

  useEffect(() => {
    if (scenes.length > 0 && !selectedSceneId) {
      setSelectedSceneId(scenes[0].id)
    }
  }, [scenes, selectedSceneId])

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleSceneSelect = useCallback((sceneId: string) => {
    setSelectedSceneId(sceneId)
  }, [])

  const handleSceneUpdate = useCallback((updatedScene: Scene) => {
    setScenes((prevScenes) => prevScenes.map((scene) => (scene.id === updatedScene.id ? updatedScene : scene)))
  }, [])

  const handleSceneDelete = useCallback(
    (sceneId: string) => {
      setScenes((prevScenes) => prevScenes.filter((scene) => scene.id !== sceneId))
      if (selectedSceneId === sceneId) {
        setSelectedSceneId(scenes.length > 1 ? scenes[0].id : null)
      }
    },
    [selectedSceneId, scenes],
  )

  const handleBackgroundUpload = useCallback((sceneId: string, file: File) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            background: {
              ...scene.background,
              src: [{ ...scene.background.src[0], url: URL.createObjectURL(file) }],
            },
          }
        }
        return scene
      }),
    )
  }, [])

  const handleAddScene = useCallback(() => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      background: { src: [], color: "#000000", bg_animation: { animation: "" } },
      time: 0,
      keywords: [],
      sub_scenes: [
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
      ],
      music: false,
      tts: false,
      subtitle: false,
      subtitles: [],
    }
    setScenes((prevScenes) => [...prevScenes, newScene])
    setSelectedSceneId(newScene.id)
  }, [])

  if (scenes.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-xl font-bold mb-4">Scene Editor</h1>
        <p>No scenes available.</p>
        <Button onClick={handleAddScene}>Add New Scene</Button>
      </div>
    )
  }

  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId)

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold mb-4">Scene Editor</h1>

      <div className="flex flex-col lg:flex-row">
       
        <div className="w-full lg:w-1/4 pr-4">
          <h2 className="text-lg font-semibold mb-2">Scenes</h2>
         
          <Button onClick={handleAddScene}>Add New Scene</Button>
        </div>

        {/* Scene Editor */}
        <div className="flex-1">
          {selectedScene && (
            <SceneEditorForm
              scene={selectedScene}
              onUpdate={handleSceneUpdate}
              onDelete={() => handleSceneDelete(selectedScene.id)}
              onBackgroundUpload={(file) => handleBackgroundUpload(selectedScene.id, file)}
            />
          )}
        </div>
      </div>

      {/* Scrollable Slider */}
      <div className="relative flex items-center mt-6">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto space-x-4 px-12 no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              onClick={() => handleSceneSelect(scene.id)}
              className={`h-[100px] w-[150px] flex-shrink-0 flex items-center justify-center bg-gray-200 border border-black rounded-lg cursor-pointer ${
                selectedSceneId === scene.id ? "border-2 border-violet-600" : ""
              }`}
              style={{ scrollSnapAlign: "start" }}
            >
              {scene.sub_scenes[0]?.showSceneNumber || `Scene ${index + 1}`}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}

export default SceneEditor

