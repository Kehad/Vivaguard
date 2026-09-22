'use client';

import React from 'react';
import { Sparkles, Sliders, Zap, CheckCircle2, Target, Brain } from 'lucide-react';
import { PRESET_DOMAINS } from './types';

interface TestSimulatorConfigProps {
  domain: string;
  setDomain: (domain: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  difficultyLevel: string;
  setDifficultyLevel: (level: string) => void;
  adaptiveMode: boolean;
  setAdaptiveMode: (adaptive: boolean) => void;
  timePerQuestion: number;
  setTimePerQuestion: (seconds: number) => void;
  loading: boolean;
  onGenerateQuestions: () => void;
}

export const TestSimulatorConfig: React.FC<TestSimulatorConfigProps> = ({
  domain,
  setDomain,
  questionCount,
  setQuestionCount,
  difficultyLevel,
  setDifficultyLevel,
  adaptiveMode,
  setAdaptiveMode,
  timePerQuestion,
  setTimePerQuestion,
  loading,
  onGenerateQuestions,
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 flex flex-col gap-8 transition-all">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Configure Examination Parameters</h2>
            <p className="text-xs text-slate-500 font-medium">Select subject domain, question count (1-30), timer per question, and adaptive AI mode.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-semibold">
          <Brain className="w-3.5 h-3.5 text-teal-600" />
          <span>Gemini-Powered</span>
        </div>
      </div>

      {/* Preset Domains Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          Select Target Preset Domain or Enter Custom Topic
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PRESET_DOMAINS.map((p, idx) => {
            const isSelected = domain === p.domain;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setDomain(p.domain)}
                className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border-emerald-500 text-slate-900 ring-2 ring-emerald-500/20 shadow-md scale-[1.01]'
                    : 'bg-slate-50/60 border-slate-200/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-emerald-950' : 'text-slate-900 group-hover:text-emerald-800'}`}>
                    {p.label}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{p.domain}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative mt-1">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full p-4 pl-4 pr-10 rounded-2xl bg-slate-50 border border-slate-200/90 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-900 font-semibold outline-none transition-all shadow-inner"
            placeholder="Or type custom subject (e.g. Distributed Consensus Algorithms & Raft)"
          />
        </div>
      </div>

      {/* Grid Controls: Question Count (Dropdown 1-30), Baseline Tier, Time Limit, Adaptive Toggle with Tooltip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2 border-t border-slate-100">
        {/* Question Count (Only 1-30 Dropdown) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Question Count</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 focus:border-emerald-500 focus:bg-white text-sm font-semibold text-slate-800 outline-none transition-all shadow-xs cursor-pointer"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Question' : 'Questions'}
              </option>
            ))}
          </select>
        </div>

        {/* Baseline Difficulty Tier */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Baseline Difficulty Tier</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 focus:border-emerald-500 focus:bg-white text-sm font-semibold text-slate-800 outline-none transition-all shadow-xs cursor-pointer"
          >
            <option value="junior">Junior / Entry Level</option>
            <option value="Mid-Level">Mid-Level Core</option>
            <option value="Senior">Senior / Staff / Principal</option>
          </select>
        </div>

        {/* Time Limit Per Question */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Time Per Question</label>
          <select
            value={timePerQuestion}
            onChange={(e) => setTimePerQuestion(Number(e.target.value))}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 focus:border-emerald-500 focus:bg-white text-sm font-semibold text-slate-800 outline-none transition-all shadow-xs cursor-pointer"
          >
            <option value={30}>30 Seconds (Fast Speedrun)</option>
            <option value={45}>45 Seconds</option>
            <option value={60}>60 Seconds (1 Min)</option>
            <option value={90}>90 Seconds (1.5 Mins)</option>
            <option value={120}>120 Seconds (2 Mins)</option>
            <option value={180}>180 Seconds (3 Mins)</option>
            <option value={0}>No Limit (Untimed)</option>
          </select>
        </div>

        {/* Adaptive Mode Toggle with Hover Tooltip */}
        <div className="flex flex-col gap-2 justify-end">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">AI Difficulty Progression</label>
          <div className="relative group">
            <button
              type="button"
              onClick={() => setAdaptiveMode(!adaptiveMode)}
              className={`w-full p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                adaptiveMode
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Zap className={`w-4 h-4 ${adaptiveMode ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
                Adaptive Scaling
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase ${
                adaptiveMode ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
              }`}>
                {adaptiveMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 text-slate-100 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 border border-slate-700 text-center leading-relaxed">
              <div className="font-bold text-amber-400 mb-1 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Adaptive AI Scaling
              </div>
              Dynamically increases or decreases question difficulty based on your previous answer accuracy and performance scores.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerateQuestions}
          disabled={loading || !domain.trim()}
          className="w-full relative group overflow-hidden py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-sm tracking-wide transition-all shadow-xl shadow-emerald-600/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Defense Questions...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-white animate-bounce" />
              <span>Generate Defense Examination Questions</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
