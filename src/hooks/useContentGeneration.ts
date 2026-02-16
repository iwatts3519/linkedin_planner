'use client';

import { useCallback } from 'react';
import { useContentStore } from '@/stores/contentStore';
import type { InputType, Idea, PostLength, PostTone, Input, Post } from '@/types';
import type { HistoryEntry } from '@/lib/db';

interface IdeasResponse {
  input: Input;
  ideas: Idea[];
  warnings?: string[];
}

interface DraftResponse {
  post: Post;
}

interface HistoryDetailResponse {
  input: Input;
  ideas: Idea[];
}

export function useContentGeneration() {
  const {
    flowState,
    currentInput,
    ideas,
    selectedIdea,
    currentPost,
    length,
    tone,
    error,
    setFlowState,
    setCurrentInput,
    setIdeas,
    setSelectedIdea,
    setCurrentPost,
    setLength,
    setTone,
    setError,
    reset,
    resetToIdeas,
  } = useContentStore();

  const submitInput = useCallback(async (type: InputType, content: string, urls?: string[]) => {
    setError(null);
    setFlowState('generating-ideas');
    reset();
    setFlowState('generating-ideas');

    try {
      const requestBody = type === 'url'
        ? { type, urls }
        : { type, content };

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate ideas');
      }

      const data: IdeasResponse = await response.json();
      setCurrentInput(data.input);
      setIdeas(data.ideas);
      setFlowState('ideas-ready');

      if (data.warnings && data.warnings.length > 0) {
        setError(`Warning: ${data.warnings.join('. ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setFlowState('idle');
    }
  }, [setError, setFlowState, reset, setCurrentInput, setIdeas]);

  const selectIdea = useCallback(async (idea: Idea) => {
    setSelectedIdea(idea);
    setError(null);
    setFlowState('generating-draft');

    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId: idea.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate draft');
      }

      const data: DraftResponse = await response.json();
      setCurrentPost(data.post);
      setLength(data.post.length);
      setTone(data.post.tone);
      setFlowState('draft-ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setFlowState('ideas-ready');
    }
  }, [setSelectedIdea, setError, setFlowState, setCurrentPost, setLength, setTone]);

  const generateVariation = useCallback(async () => {
    if (!currentPost) return;

    setError(null);
    setFlowState('generating-draft');

    try {
      const response = await fetch('/api/variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: currentPost.id,
          length,
          tone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate variation');
      }

      const data: DraftResponse = await response.json();
      setCurrentPost(data.post);
      setFlowState('draft-ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setFlowState('draft-ready');
    }
  }, [currentPost, length, tone, setError, setFlowState, setCurrentPost]);

  const changeLength = useCallback((newLength: PostLength) => {
    setLength(newLength);
  }, [setLength]);

  const changeTone = useCallback((newTone: PostTone) => {
    setTone(newTone);
  }, [setTone]);

  const startOver = useCallback(() => {
    reset();
  }, [reset]);

  const backToIdeas = useCallback(() => {
    resetToIdeas();
  }, [resetToIdeas]);

  const loadFromHistory = useCallback(async (entry: HistoryEntry) => {
    setError(null);
    setFlowState('generating-ideas');

    try {
      const response = await fetch(`/api/history/${entry.id}`);
      if (!response.ok) {
        throw new Error('Failed to load history');
      }

      const data: HistoryDetailResponse = await response.json();
      setCurrentInput(data.input);
      setIdeas(data.ideas);
      setFlowState('ideas-ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
      setFlowState('idle');
    }
  }, [setError, setFlowState, setCurrentInput, setIdeas]);

  return {
    // State
    flowState,
    currentInput,
    ideas,
    selectedIdea,
    currentPost,
    length,
    tone,
    error,

    // Computed
    isGeneratingIdeas: flowState === 'generating-ideas',
    isGeneratingDraft: flowState === 'generating-draft',
    hasIdeas: ideas.length > 0,
    hasDraft: currentPost !== null,

    // Actions
    submitInput,
    selectIdea,
    generateVariation,
    changeLength,
    changeTone,
    startOver,
    backToIdeas,
    loadFromHistory,
  };
}
