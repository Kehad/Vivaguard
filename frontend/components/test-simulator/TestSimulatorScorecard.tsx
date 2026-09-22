'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, MessageSquare, RefreshCw } from 'lucide-react';
import { EvaluationResult, QuestionItem } from './types';

interface TestSimulatorScorecardProps {
  domain: string;
  evaluations: EvaluationResult[];
  questions: QuestionItem[];
  cumulativeReport: any;
  onResetSession: () => void;
}

export const TestSimulatorScorecard: React.FC<TestSimulatorScorecardProps> = ({
  domain,
  evaluations,
  questions,
  cumulativeReport,
  onResetSession,
}) => {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Celebration Header Card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white border border-slate-700/80 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-3 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider w-fit mx-auto md:mx-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Defense Examination Complete</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-50">
            Readiness Index: <span className="text-emerald-400">{cumulativeReport?.readiness_percentage || 85}%</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Subject Domain: <span className="text-slate-100 font-semibold">{domain}</span> ({evaluations.length} Questions Evaluated)
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="flex flex-col items-center gap-1 bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl font-mono shadow-inner">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</span>
            <div className="text-5xl font-black text-emerald-400">
              {cumulativeReport?.overall_score || 82}<span className="text-2xl text-slate-500">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-200/80 shadow-lg flex flex-col gap-4">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            Cumulative Technical Strengths
          </span>
          <ul className="space-y-2.5">
            {(cumulativeReport?.cumulative_strengths || ['Strong technical vocabulary', 'Structured reasoning']).map(
              (s: string, i: number) => (
                <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <span>{s}</span>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-amber-200/80 shadow-lg flex flex-col gap-4">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
            Top Persistent Blindspots
          </span>
          <ul className="space-y-2.5">
            {(cumulativeReport?.persistent_weaknesses || ['Omitted quantitative metrics']).map(
              (w: string, i: number) => (
                <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <span>{w}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Question & Candidate Response History */}
      {evaluations.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 flex flex-col gap-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            Session Question & Candidate Response Timeline
          </span>
          <div className="flex flex-col gap-4">
            {evaluations.map((ev, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                  <span className="text-xs font-bold text-slate-900">
                    Question {idx + 1}: {questions[idx]?.question_text || `Question ${idx + 1}`}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono font-black text-emerald-700 shadow-2xs">
                    Score: {ev.overall_score}/100 ({ev.accuracy_rating})
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Candidate Response:</span>
                  <p className="text-xs text-slate-800 font-sans italic bg-white p-4 rounded-xl border border-slate-200/80 leading-relaxed">
                    "{ev.transcript || 'No candidate response recorded'}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Session Action */}
      <div className="flex justify-center py-4">
        <button
          type="button"
          onClick={onResetSession}
          className="flex items-center gap-3 px-9 py-4 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-900 font-extrabold text-sm transition-all shadow-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-teal-600" />
          <span>Start New Defense Session</span>
        </button>
      </div>
    </div>
  );
};
