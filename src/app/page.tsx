'use client';

import { useState, useEffect, useRef } from 'react';
import { InputForm } from '@/components/InputForm';
import { IdeaList } from '@/components/IdeaList';
import { VariationSelector } from '@/components/VariationSelector';
import { DraftDisplay } from '@/components/DraftDisplay';
import { History } from '@/components/History';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useContentGeneration } from '@/hooks/useContentGeneration';

export default function Home() {
  const [historyOpen, setHistoryOpen] = useState(false);

  const {
    flowState,
    ideas,
    selectedIdea,
    currentPost,
    length,
    tone,
    error,
    isGeneratingIdeas,
    isGeneratingDraft,
    submitInput,
    selectIdea,
    generateVariation,
    changeLength,
    changeTone,
    startOver,
    backToIdeas,
    loadFromHistory,
  } = useContentGeneration();

  const ideasRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flowState === 'ideas-ready' && ideasRef.current) {
      ideasRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [flowState]);

  useEffect(() => {
    if (flowState === 'draft-ready' && draftRef.current) {
      draftRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [flowState]);

  const showIdeas = flowState !== 'idle' || ideas.length > 0;
  const showVariationSelector = selectedIdea !== null;
  const showDraft = currentPost !== null;

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-ink-100">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 shadow-[--shadow-md]">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl text-ink-900 tracking-tight">
                  LinkedIn Assistant
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {flowState !== 'idle' && (
                <button
                  onClick={startOver}
                  className="
                    hidden sm:flex items-center gap-1.5
                    px-3 py-1.5 text-sm font-medium text-ink-500
                    hover:text-ink-700 hover:bg-ink-100
                    rounded-lg transition-colors
                  "
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start over
                </button>
              )}
              <button
                onClick={() => setHistoryOpen(true)}
                className="
                  flex items-center gap-1.5 px-3 py-2
                  text-ink-500 hover:text-ink-700
                  bg-white hover:bg-ink-50
                  border border-ink-200 hover:border-ink-300
                  rounded-xl shadow-[--shadow-sm] hover:shadow-[--shadow-md]
                  transition-all duration-200
                "
                aria-label="View history"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline text-sm font-medium">History</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-ink-100 bg-gradient-to-b from-white to-surface-sunken">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-coral-600 uppercase tracking-wider mb-3 animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              AI-Powered Content Creation
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink-900 leading-[1.15] mb-4 animate-fade-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Transform ideas into
              <span className="text-coral-600"> engaging</span> LinkedIn posts
            </h2>
            <p className="text-lg sm:text-xl text-ink-500 leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Paste an article, describe a topic, or share URLs — let AI generate compelling content ideas tailored for professional audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 sm:py-12">
        {/* Mobile Start Over */}
        {flowState !== 'idle' && (
          <div className="sm:hidden mb-6 animate-fade-in">
            <button
              onClick={startOver}
              className="
                flex items-center gap-1.5
                text-sm font-medium text-ink-500
                hover:text-ink-700
              "
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start over
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 animate-scale-in">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Input Form */}
        <section className="mb-10 sm:mb-12 animate-fade-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <InputForm onSubmit={submitInput} loading={isGeneratingIdeas} />
        </section>

        {/* Ideas List */}
        {showIdeas && (
          <section ref={ideasRef} className="mb-10 sm:mb-12 scroll-mt-24 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 text-teal-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-ink-900">
                  Post Ideas
                </h2>
              </div>
              {selectedIdea && (
                <button
                  onClick={backToIdeas}
                  className="
                    flex items-center gap-1.5
                    text-sm font-medium text-coral-600
                    hover:text-coral-700
                    transition-colors
                  "
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Choose different
                </button>
              )}
            </div>
            <IdeaList
              ideas={ideas}
              selectedIdea={selectedIdea}
              onSelectIdea={selectIdea}
              loading={isGeneratingIdeas}
            />
          </section>
        )}

        {/* Variation Selector */}
        {showVariationSelector && (
          <section className="mb-10 sm:mb-12 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-coral-100 text-coral-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-ink-900">
                Customize Draft
              </h2>
            </div>
            <VariationSelector
              length={length}
              tone={tone}
              onLengthChange={changeLength}
              onToneChange={changeTone}
              onGenerate={generateVariation}
              loading={isGeneratingDraft}
            />
          </section>
        )}

        {/* Draft Display */}
        {showDraft && (
          <section ref={draftRef} className="scroll-mt-24 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ink-900 text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-ink-900">
                Your Draft
              </h2>
            </div>
            <DraftDisplay post={currentPost} />
          </section>
        )}
      </div>

      {/* History Drawer */}
      <History
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectEntry={loadFromHistory}
      />
    </main>
  );
}
