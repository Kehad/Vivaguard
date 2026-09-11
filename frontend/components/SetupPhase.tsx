'use client';

import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Mic, FileText, HelpCircle, ArrowRight, Zap, Play, CheckCircle2, Sliders } from 'lucide-react';

interface SetupPhaseProps {
  groundTruth: string;
  targetQuestion: string;
  onGroundTruthChange: (val: string) => void;
  onTargetQuestionChange: (val: string) => void;
  onStartSession: () => void;
}

const PERSONAS = [
  {
    id: 'thesis',
    label: '🎓 Thesis Defense',
    title: 'LSM-Tree Storage Engine Defense',
    question: 'Defend your choice of lock-free ring buffers over mutex-gated queues in high-throughput workloads.',
    groundTruth: 'Thesis Abstract: We propose a zero-copy high-throughput event storage architecture utilizing Log-Structured Merge (LSM) trees and lock-free ring buffers. Benchmarks show a 4.2x reduction in thread contention and consistent <15ms write latency under 100k events/sec.'
  },
  {
    id: 'job',
    label: '💼 Technical Job Interview',
    title: 'Distributed System & AI API Design',
    question: 'How does your API architecture guarantee low latency under high concurrency without dropping requests?',
    groundTruth: 'Job Context: Senior Infrastructure Engineer role. System design: Microservices architecture with Redis token bucket rate limiting, gRPC internal communication, and async WebSocket streaming.'
  },
  {
    id: 'pitch',
    label: '🚀 Startup VC Pitch',
    title: 'AI Copilot SaaS Pitch',
    question: 'Why is your moat defensible against OpenAI or incumbent productivity tools entering this space?',
    groundTruth: 'Startup Pitch: VivaGuard is a real-time defense & interview copilot with sub-300ms audio-to-nudge latency. $50B TAM across higher education, bootcamps, and enterprise L&D.'
  },
  {
    id: 'corporate',
    label: '🏢 Corporate Presentation',
    title: 'Executive Infrastructure Migration',
    question: 'What is the ROI and downtime risk of migrating our core database from legacy SQL to cloud-native NoSQL?',
    groundTruth: 'Corporate Strategy: Migrating enterprise transactional workload to multi-region cloud NoSQL. Expected annual savings: $1.2M with zero planned downtime using dual-write migration pipeline.'
  }
];

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  groundTruth,
  targetQuestion,
  onGroundTruthChange,
  onTargetQuestionChange,
  onStartSession
}) => {
  const [micTested, setMicTested] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>('thesis');

  const handleTestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicTested(true);
    } catch (e) {
      alert('Microphone permission blocked or hardware disconnected. Please allow microphone access in your browser settings.');
    }
  };

  const handleSelectPersona = (p: typeof PERSONAS[0]) => {
    setSelectedPersona(p.id);
    onGroundTruthChange(p.groundTruth);
    onTargetQuestionChange(p.question);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mx-auto shadow-md">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Setup Live Copilot Defense Parameters</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Prepare Your Verbal Defense
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Configure your baseline ground truth context and target question. VivaGuard’s real-time AssemblyAI speech-to-text pipeline will evaluate your verbal responses in real time.
        </p>
      </div>

      {/* Persona Presets Grid */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Select Presets or Custom Defense Scenarios
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPersona(p)}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all duration-200 ${
                selectedPersona === p.id
                  ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-extrabold text-white flex items-center justify-between">
                <span>{p.label}</span>
                {selectedPersona === p.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </span>
              <span className="text-xs text-slate-400 line-clamp-2 leading-snug">{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Inputs Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-6">
        {/* Target Question */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Target Question / Interrogation Prompt
          </label>
          <textarea
            value={targetQuestion}
            onChange={(e) => onTargetQuestionChange(e.target.value)}
            rows={2}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all resize-none font-sans"
            placeholder="e.g. Defend your choice of lock-free ring buffers over mutex-gated queues..."
          />
        </div>

        {/* Ground Truth Context */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Ground Truth Context & Core Thesis Parameters
          </label>
          <textarea
            value={groundTruth}
            onChange={(e) => onGroundTruthChange(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all resize-none font-sans"
            placeholder="Paste abstract, key metrics, architecture details, or background facts..."
          />
        </div>

        {/* Controls Bar: Mic Test & Start Session */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={handleTestMic}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-xs font-bold transition-all ${
              micTested
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <Mic className={`w-4 h-4 ${micTested ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{micTested ? 'Microphone Verified ✓' : 'Test Microphone Hardware'}</span>
          </button>

          <button
            onClick={onStartSession}
            disabled={!targetQuestion.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-cyan-950/60 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch Live Copilot Defense Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
