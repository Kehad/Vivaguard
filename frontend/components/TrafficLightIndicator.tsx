'use client';

import React, { useRef, useEffect } from 'react';
import { SignalType } from '@/hooks/useAudioStreamer';
import {
  Mic,
  Pause,
  Play,
  Square,
  Activity,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Radio,
  Volume2,
  VolumeX,
  Tag,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

interface TrafficLightIndicatorProps {
  currentSignal: SignalType;
  currentNudge: string;
  suggestedPivot?: string;
  latencyMs: number;
  sessionTime: number;
  audioLevel: number;
  transcript: string;
  partialTranscript: string;
  sttEngine?: string;
  isStreaming: boolean;
  isPaused: boolean;
  isAudioMonitoring?: boolean;
  fillerWordsCount?: number;
  technicalKeywords?: string[];
  examinerSentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  isDodging?: boolean;
  aiFollowups?: string[];
  onPauseToggle: () => void;
  onStopSession: () => void;
  onToggleAudioMonitoring?: () => void;
}

export const TrafficLightIndicator: React.FC<TrafficLightIndicatorProps> = ({
  currentSignal,
  currentNudge,
  suggestedPivot,
  latencyMs,
  sessionTime,
  audioLevel,
  transcript,
  partialTranscript,
  sttEngine = 'AssemblyAI Realtime STT',
  isStreaming,
  isPaused,
  isAudioMonitoring = false,
  fillerWordsCount = 0,
  technicalKeywords = [],
  examinerSentiment = 'NEUTRAL',
  isDodging = false,
  aiFollowups = [],
  onPauseToggle,
  onStopSession,
  onToggleAudioMonitoring
}) => {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, partialTranscript]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const getSignalConfig = () => {
    switch (currentSignal) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500',
          text: 'text-emerald-400',
          glow: 'animate-pulse-green',
          badge: 'GREEN SIGNAL • STRONG ALIGNMENT',
          icon: CheckCircle2
        };
      case 'AMBER':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-500',
          text: 'text-amber-400',
          glow: 'animate-pulse-amber',
          badge: 'AMBER SIGNAL • EXPAND METRICS & DEPTH',
          icon: AlertTriangle
        };
      case 'RED':
      default:
        return {
          bg: 'bg-rose-950/80',
          border: 'border-rose-500',
          text: 'text-rose-400',
          glow: 'animate-pulse-red',
          badge: 'RED SIGNAL • DODGING / DEFICIENT',
          icon: AlertCircle
        };
    }
  };

  const config = getSignalConfig();
  const IconComponent = config.icon;

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 animate-fadeIn">
      {/* Top Session Telemetry Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{sttEngine}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(sessionTime)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{latencyMs}ms latency</span>
          </div>
        </div>

        {/* Audio Meter & Audio Monitor Toggle */}
        <div className="flex items-center gap-4">
          {onToggleAudioMonitoring && (
            <button
              onClick={onToggleAudioMonitoring}
              className={`p-2 rounded-xl border text-xs transition-all ${
                isAudioMonitoring
                  ? 'bg-cyan-950 border-cyan-800 text-cyan-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={isAudioMonitoring ? 'Mute Self Audio Monitor' : 'Unmute Self Audio Monitor'}
            >
              {isAudioMonitoring ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {/* Audio Visualizer Level Bar */}
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-400" />
            <div className="w-24 sm:w-32 h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-75"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Signal & Nudge Card */}
      <div className={`p-8 rounded-3xl border ${config.bg} ${config.border} ${config.glow} backdrop-blur-2xl shadow-2xl flex flex-col gap-6 transition-all duration-300 relative overflow-hidden`}>
        {/* Signal Badge & Sentiment */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-slate-950/80 border ${config.border}`}>
              <IconComponent className={`w-6 h-6 ${config.text}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-black uppercase tracking-widest ${config.text}`}>
                {config.badge}
              </span>
              {suggestedPivot && (
                <span className="text-xs text-slate-300 font-semibold">
                  Suggested Focus: <span className="text-white underline font-bold">{suggestedPivot}</span>
                </span>
              )}
            </div>
          </div>

          {/* Real-time Indicators: Dodging, Sentiment, Fillers */}
          <div className="flex items-center gap-2">
            {isDodging && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-900/90 border border-rose-700 text-rose-200 text-xs font-bold animate-bounce">
                <ShieldAlert className="w-4 h-4" />
                <span>Dodging Detected</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 text-xs font-mono">
              <span>Examiner Sentiment:</span>
              <span className={`font-bold ${
                examinerSentiment === 'POSITIVE' ? 'text-emerald-400' : examinerSentiment === 'NEGATIVE' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {examinerSentiment}
              </span>
            </div>

            {fillerWordsCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-amber-400 text-xs font-mono font-semibold">
                <span>{fillerWordsCount} Fillers</span>
              </div>
            )}
          </div>
        </div>

        {/* Coaching Nudge Banner */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-xl">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Live AI Examiner Coaching Nudge
          </span>
          <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentNudge}
          </p>
        </div>

        {/* Technical Keywords Cloud */}
        {technicalKeywords.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Detected Domain Terms:
            </span>
            {technicalKeywords.map((kw, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-800 text-cyan-300 text-xs font-mono font-semibold">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Transcript Box */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Live Candidate Speech Transcript (Real-Time AssemblyAI STT)
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Streaming Active
            </span>
          )}
        </div>

        <div className="h-44 overflow-y-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-200 font-sans space-y-2">
          {transcript ? (
            <p className="whitespace-pre-wrap">{transcript}</p>
          ) : (
            <p className="text-slate-600 italic">Listening... Speak into your microphone to generate live transcript.</p>
          )}
          {partialTranscript && (
            <p className="text-cyan-400/90 italic animate-pulse">{partialTranscript}</p>
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* AI Follow-up Prompts */}
      {aiFollowups.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Anticipated Examiner Cross-Examination Follow-Ups
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiFollowups.map((question, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                  Q{i + 1}
                </span>
                <span>{question}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex items-center justify-center gap-4 py-2">
        <button
          onClick={onPauseToggle}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-lg"
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          <span>{isPaused ? 'Resume Session' : 'Pause Telemetry'}</span>
        </button>

        <button
          onClick={onStopSession}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs transition-all shadow-xl shadow-rose-950/60"
        >
          <Square className="w-4 h-4 fill-white" />
          <span>Finish Session & Generate STAR Debrief</span>
        </button>
      </div>
    </div>
  );
};
