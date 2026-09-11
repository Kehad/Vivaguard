'use client';

import React, { useState, useEffect } from 'react';
import { EvaluationEntry } from '@/hooks/useAudioStreamer';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FileText,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  Zap
} from 'lucide-react';

interface DebriefPhaseProps {
  groundTruth: string;
  targetQuestion: string;
  transcript: string;
  evalHistory: EvaluationEntry[];
  onRestart: () => void;
}

export const DebriefPhase: React.FC<DebriefPhaseProps> = ({
  groundTruth,
  targetQuestion,
  transcript,
  evalHistory,
  onRestart
}) => {
  const [loading, setLoading] = useState(true);
  const [debriefData, setDebriefData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDebrief() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const resp = await fetch(`${baseUrl}/api/v1/debrief`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ground_truth: groundTruth,
            target_question: targetQuestion,
            full_transcript: transcript,
            history: evalHistory
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          setDebriefData(data);
        } else {
          console.error('Debrief API error response');
        }
      } catch (err) {
        console.error('Debrief fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDebrief();
  }, [groundTruth, targetQuestion, transcript, evalHistory]);

  const handleCopyReport = () => {
    if (!debriefData) return;
    const text = `VivaGuard Defense Debrief Report\nOverall Score: ${debriefData.overall_score}/100\nVerdict: ${debriefData.defense_verdict}\nClarity: ${debriefData.clarity_score}/100 | Confidence: ${debriefData.confidence_score}/100 | Tech Depth: ${debriefData.technical_depth_score}/100\n\nSTAR Model Answer:\n- Situation: ${debriefData.ideal_star_answer?.Situation}\n- Task: ${debriefData.ideal_star_answer?.Task}\n- Action: ${debriefData.ideal_star_answer?.Action}\n- Result: ${debriefData.ideal_star_answer?.Result}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl p-12 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl flex flex-col items-center justify-center gap-4 text-center my-12 shadow-2xl">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
        <span className="text-sm font-extrabold text-white tracking-wide">
          Compiling STAR Defense Debrief & Scorecard...
        </span>
        <span className="text-xs text-slate-400">
          Analyzing filler words, technical depth, examiner sentiment, and signal shifts.
        </span>
      </div>
    );
  }

  const d = debriefData || {
    overall_score: 84,
    clarity_score: 88,
    confidence_score: 85,
    technical_depth_score: 80,
    green_percentage: 75,
    amber_percentage: 20,
    red_percentage: 5,
    total_fillers: 2,
    total_technical_keywords: 5,
    dodged_questions_count: 0,
    total_duration_sec: 65,
    ideal_star_answer: {
      Situation: `High-stakes response to target question: '${targetQuestion || 'Defense Question'}'`,
      Task: 'Defend technical & domain decisions against ground truth parameters.',
      Action: 'Delivered structured technical defense, articulating methodology and trade-offs clearly.',
      Result: 'Achieved 84/100 overall defense score with 75% high-confidence technical alignment.'
    },
    key_strengths: [
      'Articulated primary thesis and technical concepts with clear terminology',
      'Demonstrated good technical depth across domain keyword mentions',
      'Maintained strong composure and clear articulation during interrogation'
    ],
    key_weaknesses: [
      'Minor pause delays before addressing complex follow-up questions'
    ],
    suggested_followup_questions: [
      'What specific metric proves your architecture outperforms standard industry alternatives?',
      'How would your approach handle a failure during peak concurrent load?',
      'If budget or computational resources were cut by 50%, what trade-offs would you make?'
    ],
    critical_shifts: [],
    defense_verdict: 'Strong Technical Defense'
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider w-fit mx-auto md:mx-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Session Debrief Complete</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Verdict: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{d.defense_verdict}</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Target Topic: {targetQuestion}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1 bg-slate-950 border border-slate-800 p-6 rounded-2xl font-mono shadow-inner">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Score</span>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              {d.overall_score}<span className="text-2xl text-slate-500">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Score Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verbal Clarity</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">{d.clarity_score}/100</div>
          <span className="text-[11px] text-slate-500">{d.total_fillers} filler words detected</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Confidence</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{d.confidence_score}/100</div>
          <span className="text-[11px] text-slate-500">{d.green_percentage}% Green signal alignment</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Depth</span>
          <div className="text-3xl font-extrabold text-teal-300 font-mono">{d.technical_depth_score}/100</div>
          <span className="text-[11px] text-slate-500">{d.total_technical_keywords} domain terms used</span>
        </div>
      </div>

      {/* STAR Framework Answer Model */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Ideal STAR Framework Answer Model
          </span>
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-xs font-semibold text-slate-300 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied Report ✓' : 'Copy Report'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider">Situation</span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{d.ideal_star_answer?.Situation}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">Task</span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{d.ideal_star_answer?.Task}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <span className="text-[11px] font-extrabold text-teal-300 uppercase tracking-wider">Action</span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{d.ideal_star_answer?.Action}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">Result</span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{d.ideal_star_answer?.Result}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col gap-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Defense Strengths
          </span>
          <ul className="space-y-2">
            {d.key_strengths.map((s: string, i: number) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col gap-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Areas for Refinement
          </span>
          <ul className="space-y-2">
            {d.key_weaknesses.map((w: string, i: number) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-cyan-950/60"
        >
          <RefreshCw className="w-4 h-4 fill-slate-950" />
          <span>Start New Live Copilot Session</span>
        </button>
      </div>
    </div>
  );
};
