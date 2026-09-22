'use client';

import React, { useState, useEffect } from 'react';
import { useAudioStreamer } from '@/hooks/useAudioStreamer';
import { SetupPhase } from '@/components/SetupPhase';
import { TrafficLightIndicator } from '@/components/TrafficLightIndicator';
import { DebriefPhase } from '@/components/DebriefPhase';
import { TestSimulatorPhase } from '@/components/TestSimulatorPhase';
import { Shield, Radio, BookOpen, FileText, ExternalLink, Activity, CheckCircle2 } from 'lucide-react';

type AppMode = 'LIVE_COPILOT' | 'TEST_SIMULATOR';
type AppPhase = 'SETUP' | 'LIVE_SESSION' | 'DEBRIEF';

export default function Home() {
  const [mode, setMode] = useState<AppMode>('LIVE_COPILOT');
  const [phase, setPhase] = useState<AppPhase>('SETUP');
  const [backendHealth, setBackendHealth] = useState<boolean | null>(null);

  const [groundTruth, setGroundTruth] = useState<string>(
    'Thesis Abstract: We propose a zero-copy high-throughput event storage architecture utilizing Log-Structured Merge (LSM) trees and lock-free ring buffers. Benchmarks show a 4.2x reduction in thread contention and consistent <15ms write latency under 100k events/sec.'
  );
  const [targetQuestion, setTargetQuestion] = useState<string>(
    'Defend your choice of lock-free ring buffers over mutex-gated queues in high-throughput workloads.'
  );

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const backendWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/copilot';

  const streamer = useAudioStreamer({
    groundTruth,
    targetQuestion,
    backendWsUrl,
  });

  // Health check ping to backend
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${backendUrl}/health`);
        if (res.ok) {
          setBackendHealth(true);
        } else {
          setBackendHealth(false);
        }
      } catch (e) {
        setBackendHealth(false);
      }
    }
    checkHealth();
  }, [backendUrl]);

  const handleStartSession = async () => {
    setPhase('LIVE_SESSION');
    await streamer.startSession();
  };

  const handleStopSession = () => {
    streamer.stopSession();
    setPhase('DEBRIEF');
  };

  const handleRestart = () => {
    streamer.stopSession();
    setPhase('SETUP');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-100/60 via-indigo-50/40 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-indigo-600 flex items-center justify-center shadow-md shadow-teal-500/20">
            <Shield className="w-5 h-5 text-white font-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                VivaGuard
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono font-bold">
                v2.0 Dual-Mode
              </span>
              {backendHealth !== null && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono">
                  <span className={`w-2 h-2 rounded-full ${backendHealth ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span className={backendHealth ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                    {backendHealth ? 'Backend API Online' : 'Backend Disconnected'}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
              AI Defense & Interview Copilot Platform
            </span>
          </div>
        </div>

        {/* Dual Mode Switcher & API Docs Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setMode('LIVE_COPILOT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'LIVE_COPILOT'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-teal-600" />
              <span>Live Copilot Mode</span>
            </button>

            <button
              onClick={() => setMode('TEST_SIMULATOR')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'TEST_SIMULATOR'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interactive Defense Mode</span>
            </button>
          </div>

          <a
            href={`${backendUrl}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-700 text-xs font-semibold transition-all shadow-xs group"
            title="Open FastAPI Swagger Interactive Documentation"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Swagger API Docs</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10 flex flex-col items-center justify-center">
        {mode === 'TEST_SIMULATOR' ? (
          <TestSimulatorPhase />
        ) : (
          <>
            {phase === 'SETUP' && (
              <SetupPhase
                groundTruth={groundTruth}
                targetQuestion={targetQuestion}
                onGroundTruthChange={setGroundTruth}
                onTargetQuestionChange={setTargetQuestion}
                onStartSession={handleStartSession}
              />
            )}

            {phase === 'LIVE_SESSION' && (
              <TrafficLightIndicator
                currentSignal={streamer.currentSignal}
                currentNudge={streamer.currentNudge}
                suggestedPivot={streamer.suggestedPivot}
                latencyMs={streamer.latencyMs}
                sessionTime={streamer.sessionTime}
                audioLevel={streamer.audioLevel}
                transcript={streamer.transcript}
                partialTranscript={streamer.partialTranscript}
                sttEngine={streamer.sttEngine}
                isStreaming={streamer.isStreaming}
                isPaused={streamer.isPaused}
                isAudioMonitoring={streamer.isAudioMonitoring}
                fillerWordsCount={streamer.fillerWordsCount}
                technicalKeywords={streamer.technicalKeywords}
                examinerSentiment={streamer.examinerSentiment}
                isDodging={streamer.isDodging}
                aiFollowups={streamer.aiFollowups}
                onPauseToggle={streamer.togglePause}
                onStopSession={handleStopSession}
                onToggleAudioMonitoring={streamer.toggleAudioMonitoring}
              />
            )}

            {phase === 'DEBRIEF' && (
              <DebriefPhase
                groundTruth={groundTruth}
                targetQuestion={targetQuestion}
                transcript={streamer.transcript}
                evalHistory={streamer.evalHistory}
                onRestart={handleRestart}
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500 font-sans flex items-center justify-between">
        <span>VivaGuard &copy; 2026 Dual-Mode Architecture (AssemblyAI STT + Gemini LLM)</span>
        <span className="hidden sm:inline-block text-teal-700 font-semibold">AssemblyAI Hackathon Edition v2.0</span>
      </footer>
    </main>
  );
}
