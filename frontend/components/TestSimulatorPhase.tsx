'use client';

import React from 'react';
import { BookOpen, Check, Sparkles, Sliders, MessageSquare, Award, ShieldCheck } from 'lucide-react';
import { useTestSimulator } from '@/hooks/useTestSimulator';
import { TestSimulatorConfig } from './test-simulator/TestSimulatorConfig';
import { TestSimulatorAnswering } from './test-simulator/TestSimulatorAnswering';
import { TestSimulatorEvaluation } from './test-simulator/TestSimulatorEvaluation';
import { TestSimulatorScorecard } from './test-simulator/TestSimulatorScorecard';

export const TestSimulatorPhase: React.FC = () => {
  const {
    step,
    domain,
    setDomain,
    questionCount,
    setQuestionCount,
    difficultyLevel,
    setDifficultyLevel,
    adaptiveMode,
    setAdaptiveMode,
    adaptiveNotice,
    timePerQuestion,
    setTimePerQuestion,
    timeRemaining,
    questions,
    currentIndex,
    currentQ,
    loading,
    answerMode,
    setAnswerMode,
    textAnswer,
    setTextAnswer,
    isRecording,
    recordTimer,
    transcript,
    audioBlob,
    isPlayingAudio,
    evaluations,
    currentEval,
    cumulativeReport,
    handleStartRecording,
    handleStopRecording,
    handleGenerateQuestions,
    handleEvaluateAnswer,
    handleNextQuestion,
    togglePlayAudio,
    resetSession,
  } = useTestSimulator();

  const STEPS = [
    { num: 1, label: 'Configuration', icon: Sliders },
    { num: 2, label: 'Question & Answer', icon: MessageSquare },
    { num: 3, label: 'AI Evaluation', icon: Award },
    { num: 4, label: 'Readiness Scorecard', icon: ShieldCheck },
  ];

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-fadeIn">
      {/* Hero Banner Header */}
      <div className="text-center flex flex-col gap-3 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider mx-auto shadow-xs backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Interactive Viva & Defense Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Adaptive Question & <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">AI Grading Engine</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Conduct a comprehensive technical deep-dive or defense examination. Answer questions verbally or via text, receive instant AI scoring with ElevenLabs spoken feedback, and track your readiness.
        </p>
      </div>

      {/* Modern Glassmorphic Step Indicator Bar */}
      <div className="w-full bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2 relative">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isDone = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`flex items-center gap-2.5 p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-600/20 font-bold scale-[1.02]'
                    : isDone
                    ? 'bg-emerald-50/80 text-emerald-800 font-semibold border border-emerald-200/60'
                    : 'bg-slate-50/60 text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs ${
                    isCurrent
                      ? 'bg-white/20 text-white font-bold'
                      : isDone
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-slate-200/80 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs truncate hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Configuration Form */}
      {step === 1 && (
        <TestSimulatorConfig
          domain={domain}
          setDomain={setDomain}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          difficultyLevel={difficultyLevel}
          setDifficultyLevel={setDifficultyLevel}
          adaptiveMode={adaptiveMode}
          setAdaptiveMode={setAdaptiveMode}
          timePerQuestion={timePerQuestion}
          setTimePerQuestion={setTimePerQuestion}
          loading={loading}
          onGenerateQuestions={handleGenerateQuestions}
        />
      )}

      {/* Step 2: Question Answering Interface */}
      {step === 2 && currentQ && (
        <TestSimulatorAnswering
          currentQ={currentQ}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          difficultyLevel={difficultyLevel}
          answerMode={answerMode}
          setAnswerMode={setAnswerMode}
          textAnswer={textAnswer}
          setTextAnswer={setTextAnswer}
          isRecording={isRecording}
          recordTimer={recordTimer}
          transcript={transcript}
          audioBlob={audioBlob}
          loading={loading}
          timePerQuestion={timePerQuestion}
          timeRemaining={timeRemaining}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onEvaluateAnswer={handleEvaluateAnswer}
        />
      )}

      {/* Step 3: Instant AI Evaluation Results */}
      {step === 3 && currentEval && (
        <TestSimulatorEvaluation
          currentEval={currentEval}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          adaptiveNotice={adaptiveNotice}
          answerMode={answerMode}
          textAnswer={textAnswer}
          transcript={transcript}
          isPlayingAudio={isPlayingAudio}
          loading={loading}
          onTogglePlayAudio={togglePlayAudio}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {/* Step 4: Final Cumulative Scorecard */}
      {step === 4 && (
        <TestSimulatorScorecard
          domain={domain}
          evaluations={evaluations}
          questions={questions}
          cumulativeReport={cumulativeReport}
          onResetSession={resetSession}
        />
      )}
    </div>
  );
};
