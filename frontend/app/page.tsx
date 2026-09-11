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
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Gradients & Ambient Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <Shield className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                VivaGuard
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-800 text-cyan-400 font-mono font-semibold">
                v2.0 Dual-Mode
              </span>
              {backendHealth !== null && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono">
                  <span className={`w-2 h-2 rounded-full ${backendHealth ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                  <span className={backendHealth ? 'text-emerald-400' : 'text-rose-400'}>
                    {backendHealth ? 'Backend API Online' : 'Backend Disconnected'}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              AI Thesis Defense & Technical Interview Copilot
            </span>
          </div>
        </div>

        {/* Dual Mode Switcher & API Docs Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl shadow-inner">
            <button
              onClick={() => setMode('LIVE_COPILOT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'LIVE_COPILOT'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-950/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live Copilot Mode</span>
            </button>

            <button
              onClick={() => setMode('TEST_SIMULATOR')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'TEST_SIMULATOR'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-md shadow-emerald-950/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Test Simulator Mode</span>
            </button>
          </div>

          <a
            href={`${backendUrl}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 text-xs font-semibold transition-all shadow-sm group"
            title="Open FastAPI Swagger Interactive Documentation"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Swagger API Docs</span>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
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
      <footer className="w-full border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500 font-mono flex items-center justify-between">
        <span>VivaGuard &copy; 2026 Dual-Mode Architecture (AssemblyAI STT + Gemini LLM)</span>
        <span className="hidden sm:inline-block text-cyan-400/90 font-semibold">AssemblyAI Hackathon Edition v2.0</span>
      </footer>
    </main>
  );
}
