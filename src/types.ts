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
