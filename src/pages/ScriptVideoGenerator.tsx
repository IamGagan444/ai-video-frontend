// ScriptVideoGenerator.tsx
import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputForm } from "./InputForm";
import { ScriptDisplay } from "./ScriptDisplay";
import { VideoDialog } from "./VideoDialog";
import SceneEditor  from "./SceneEditor";
import { Toaster, toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";

interface Scene {
  id: string;
  background: {
    src: string[];
    color: string;
    bg_animation: Record<string, unknown>;
  };
  time: number;
  sub_scenes: Array<{
    time: number;
    location: { start_x: number; start_y: number };
    displayItems: Array<{
      id: string;
      type: "text" | "image";
      content: string;
      position: { x: number; y: number };
    }>;
    text_lines: Array<{
      id: string;
      text: string;
      position: { x: number; y: number };
      text_animation?: unknown[];
      text_bg_animation?: unknown[];
    }>;
  }>;
}

export function ScriptVideoGenerator() {
  const [generatedScript, setGeneratedScript] = useState("");
  const [previewData, setGeneratedPreviewData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [accessToken, setAccessToken] = useState("");

  const [jobId,setJobid]=useState("")

  const generateScript = async (input: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/generate-script",
        { input }
      );

      setGeneratedScript(response?.data?.data?.expandedScript);
      setAccessToken(response?.data?.data?.accessToken);
      initializeScenes(response?.data?.data?.expandedScript);
      toast.success("Script generated successfully!");
    } catch (error) {
      toast.error("Failed to generate script");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeScenes = (script: string) => {
    const initialScenes = script.split("\n\n").map((text, index) => ({
      id: `scene-${Date.now()}-${index}`,
      background: {
        src: [],
        color: "#FFFFFF",
        bg_animation: {},
      },
      time: 5,
      sub_scenes: [
        {
          time: 5,
          location: { start_x: 50, start_y: 50 },
          displayItems: [],
          text_lines: [
            {
              id: `text-${Date.now()}`,
              text: text,
              position: { x: 50, y: 50 },
              text_animation: [],
              text_bg_animation: [],
            },
          ],
        },
      ],
    }));
    setScenes(initialScenes);
  };

  const handleGenerateVideo = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/generate-video",
        {
          expandedScript: generatedScript,
          accessToken,
        }
      );
      console.log("response",response.data.data.status)
    setJobid(response.data.data.status.job_id)
      setGeneratedPreviewData(response.data.data.status.data);
      toast.success("Video generated!");
    } catch (error) {
      toast.error("Video generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await axios.post(`https://api.pictory.ai/video-generation/api/v1/preview/${jobId}`, {
        scenes: scenes.map((scene) => ({
          ...scene,
          sub_scenes: scene.sub_scenes.map((sub) => ({
            ...sub,
            displayItems: sub.displayItems.map((item) => ({
              ...item,
              position: item.position || { x: 50, y: 50 },
            })),
          })),
        })),
        accessToken,
      });
      toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-4 max-w-3xl">
        <Toaster />
        <Card>
          <CardHeader>
            <CardTitle>Video Content Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputForm
              onGenerateScript={generateScript}
              isLoading={isLoading}
            />

            {generatedScript && (
              <>
                <ScriptDisplay
                  script={generatedScript}
                  onGenerateVideo={handleGenerateVideo}
                  isLoading={isLoading}
                />

                {previewData?.renderParams?.scenes.length > 0 && (
                  <div className="space-y-4">
                    <SceneEditor
                      scenes={previewData?.renderParams?.scenes}
                      // onUpdateScenes={setScenes}
                    />

                    <div className="flex gap-4">
                      <Button
                        onClick={handleSaveChanges}
                        disabled={isLoading}
                        variant="secondary"
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleGenerateVideo}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Preview Video
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter>
            {previewData && <VideoDialog videoUrl={previewData?.preview} />}
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="p-4 text-red-500 bg-red-50 rounded-lg">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm">{error.message}</p>
    </div>
  );
}
