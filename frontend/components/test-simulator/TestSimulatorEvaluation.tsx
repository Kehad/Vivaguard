'use client';

import React from 'react';
import {
  Award,
  TrendingUp,
  Square,
  Volume2,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { EvaluationResult } from './types';

interface TestSimulatorEvaluationProps {
  currentEval: EvaluationResult;
  currentIndex: number;
  totalQuestions: number;
  adaptiveNotice: string;
  answerMode: 'RECORD' | 'TEXT';
  textAnswer: string;
  transcript: string;
  isPlayingAudio: boolean;
  loading: boolean;
  onTogglePlayAudio: () => void;
  onNextQuestion: () => void;
}

export const TestSimulatorEvaluation: React.FC<TestSimulatorEvaluationProps> = ({
  currentEval,
  currentIndex,
  totalQuestions,
  adaptiveNotice,
  answerMode,
  textAnswer,
  transcript,
  isPlayingAudio,
  loading,
  onTogglePlayAudio,
  onNextQuestion,
}) => {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 flex flex-col gap-6">
        {/* Score & Rating Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                Evaluation Result • Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-50 tracking-tight">
                {currentEval.accuracy_rating}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-4xl sm:text-5xl font-black text-emerald-400">{currentEval.overall_score}</span>
            <span className="text-lg text-slate-400 font-bold">/100</span>
          </div>
        </div>

        {/* Adaptive Difficulty Shift Notice */}
        {adaptiveNotice && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center gap-3 shadow-xs animate-fadeIn">
            <TrendingUp className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{adaptiveNotice}</span>
          </div>
        )}

       

        {/* PRIMARY FEEDBACK: ElevenLabs Voice Spoken Audio Evaluation */}
        {currentEval.audio_base64 ? (
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white flex flex-col gap-4 shadow-xl border border-teal-800/40 relative overflow-hidden ring-2 ring-emerald-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-teal-800/40 pb-3">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                Primary Response Output: Spoken AI Voice Feedback
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-extrabold uppercase">
                ElevenLabs TTS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 relative z-10">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onTogglePlayAudio}
                  className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 cursor-pointer shrink-0"
                  title={isPlayingAudio ? 'Pause Spoken Feedback' : 'Play Spoken Feedback'}
                >
                  {isPlayingAudio ? (
                    <Square className="w-6 h-6 fill-slate-950" />
                  ) : (
                    <Volume2 className="w-7 h-7 text-slate-950" />
                  )}
                </button>
                <div className="flex flex-col gap-1">
                  <span className="text-base font-bold text-slate-50">
                    {isPlayingAudio ? '🔊 Playing Audio Feedback...' : '▶ Listen to Spoken AI Evaluation'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Spoken audio feedback generated by ElevenLabs Voice AI
                  </span>
                </div>
              </div>

              {/* Equalizer Frequency Bars */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 self-start sm:self-auto">
                {[35, 70, 45, 90, 60, 100, 50, 85, 40, 75].map((h, idx) => (
                  <span
                    key={idx}
                    className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${
                      isPlayingAudio ? 'animate-pulse' : 'opacity-30'
                    }`}
                    style={{ height: `${isPlayingAudio ? (idx % 2 === 0 ? 24 : 12) : 6}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <span>Spoken audio response loading or unavailable for this question.</span>
          </div>
        )}

        {/* SECONDARY / ALTERNATIVE: Written Text Transcript & Detailed AI Breakdown */}
        <div className="flex flex-col gap-5 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Alternative View: Written Text Evaluation & Transcript
            </span>
            <span className="text-[11px] font-mono text-slate-400">Text Alternative</span>
          </div>

          {/* Candidate Submitted Response Display */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
                Candidate Submitted Answer
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-teal-900 text-[11px] font-mono font-bold shadow-2xs">
                {answerMode === 'RECORD' ? '🎙️ Spoken Answer (AssemblyAI STT)' : '✍️ Written Answer'}
              </span>
            </div>
            <p className="text-sm font-sans text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/80 italic">
              "{currentEval.transcript || textAnswer || transcript || 'No candidate response captured.'}"
            </p>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col gap-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                Key Strengths Identified
              </span>
              <ul className="space-y-2">
                {currentEval.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
                Weaknesses & Omitted Points
              </span>
              <ul className="space-y-2">
                {currentEval.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Coaching Advice */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200 flex flex-col gap-2 shadow-2xs">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Actionable Coaching Advice
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-sans font-medium">{currentEval.actionable_improvements}</p>
          </div>

          {/* Model Answer Summary */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Ideal Model Answer Reference
            </span>
            <p className="text-xs font-mono text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {currentEval.ideal_response_summary}
            </p>
          </div>
        </div>


        {/* Next Question CTA */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onNextQuestion}
            disabled={loading}
            className="flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-emerald-600/25 cursor-pointer"
          >
            <span>
              {currentIndex + 1 < totalQuestions
                ? 'Proceed to Next Question'
                : 'Finish & View Cumulative Scorecard'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
