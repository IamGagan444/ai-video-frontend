export interface Idea {
  id: number;
  idea: string;
  relevance: number;
  impact: number;
  feasibility: number;
}
export interface Suggestion {
  title: string;
  description: string;
}

export interface IdeaWithSuggestions {
  idea: string;
  suggestions: Suggestion[];
}
export interface SuggestionDisplayProps {
    selectedIdeas: { id: number; idea: string }[];
  }
// types.ts


export interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export interface TextLine {
  id: string
  text: string
  position: { x: number; y: number }
  color: string
  fontSize: number
  text_animation: Array<{
    animation: string
    source: string
    speed: number
    type: string
  }>
  text_bg_animation: Array<{
    animation: string
    source: string
    speed: number
    type: string
  }>
}

export interface SubScene {
  time: number
  location: {
    start_x: number
    start_y: number
  }
  mediaItems: MediaItem[]
  text_lines: TextLine[]
  subtitle: string
  showSceneNumber: string
  font: {
    name: string
    size: number
    line_spacing: number
    color: string
    backcolor: string
    keycolor: string
    textShadowColor: string
    textShadowWidthFr: number
    line_height: number
    case: null
    decoration: string[]
    fullWidth: boolean
  }
}

export interface Scene {
  id: string
  background: {
    src: {
      url: string
      asset_id: number
      type: string
      library: string
      mode: string
      frame: null | string
      loop_video: boolean
      mute: boolean
      resource_id: number
      sessionId: string
    }[]
    color: string
    bg_animation: {
      animation: string
    }
  }
  time: number
  keywords: string[]
  sub_scenes: {
    time: number
    location: {
      start_x: number
      start_y: number
    }
    displayItems: any[]
    text_lines: {
      text: string
      text_animation: {
        animation: string
        source: string
        speed: number
        type: string
      }[]
      text_bg_animation: {
        animation: string
        source: string
        speed: number
        type: string
      }[]
    }[]
    subtitle: string
    showSceneNumber: string
    font: {
      name: string
      size: number
      line_spacing: number
      color: string
      backcolor: string
      keycolor: string
      textShadowColor: string
      textShadowWidthFr: number
      line_height: number
      case: null | string
      decoration: string[]
      fullWidth: boolean
    }
  }[]
  music: boolean
  tts: boolean
  subtitle: boolean
  subtitles: {
    text: string
    time: number
  }[]
}
export interface SceneEditorProps {
  initialScenes: Scene[]
  onSave: (scenes: Scene[]) => void
}

