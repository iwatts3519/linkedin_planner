import { create } from 'zustand';
import type { Input, Idea, Post, PostLength, PostTone } from '@/types';

type FlowState = 'idle' | 'generating-ideas' | 'ideas-ready' | 'generating-draft' | 'draft-ready';

interface ContentState {
  // Flow state
  flowState: FlowState;

  // Data
  currentInput: Input | null;
  ideas: Idea[];
  selectedIdea: Idea | null;
  currentPost: Post | null;

  // Variation settings
  length: PostLength;
  tone: PostTone;

  // Error handling
  error: string | null;

  // Actions
  setFlowState: (state: FlowState) => void;
  setCurrentInput: (input: Input | null) => void;
  setIdeas: (ideas: Idea[]) => void;
  setSelectedIdea: (idea: Idea | null) => void;
  setCurrentPost: (post: Post | null) => void;
  setLength: (length: PostLength) => void;
  setTone: (tone: PostTone) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  resetToIdeas: () => void;
}

const initialState = {
  flowState: 'idle' as FlowState,
  currentInput: null,
  ideas: [],
  selectedIdea: null,
  currentPost: null,
  length: 'medium' as PostLength,
  tone: 'professional' as PostTone,
  error: null,
};

export const useContentStore = create<ContentState>((set) => ({
  ...initialState,

  setFlowState: (flowState) => set({ flowState }),
  setCurrentInput: (currentInput) => set({ currentInput }),
  setIdeas: (ideas) => set({ ideas }),
  setSelectedIdea: (selectedIdea) => set({ selectedIdea }),
  setCurrentPost: (currentPost) => set({ currentPost }),
  setLength: (length) => set({ length }),
  setTone: (tone) => set({ tone }),
  setError: (error) => set({ error }),

  reset: () => set(initialState),

  resetToIdeas: () => set({
    selectedIdea: null,
    currentPost: null,
    flowState: 'ideas-ready',
    length: 'medium',
    tone: 'professional',
  }),
}));
