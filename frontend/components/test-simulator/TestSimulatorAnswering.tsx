import React from 'react';
import { Mic, Square, FileText, Send, Sparkles, HelpCircle, CheckCircle2, Volume2, Clock } from 'lucide-react';
import { QuestionItem } from './types';

interface TestSimulatorAnsweringProps {
  currentQ: QuestionItem;
  currentIndex: number;
  totalQuestions: number;
  difficultyLevel: string;
  answerMode: 'RECORD' | 'TEXT';
  setAnswerMode: (mode: 'RECORD' | 'TEXT') => void;
  textAnswer: string;
  setTextAnswer: (text: string) => void;
  isRecording: boolean;
  recordTimer: number;
  transcript: string;
  audioBlob: Blob | null;
  loading: boolean;
  timePerQuestion?: number;
  timeRemaining?: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onEvaluateAnswer: () => void;
}

export const TestSimulatorAnswering: React.FC<TestSimulatorAnsweringProps> = ({
  currentQ,
  currentIndex,
  totalQuestions,
  difficultyLevel,
  answerMode,
  setAnswerMode,
  textAnswer,
  setTextAnswer,
  isRecording,
  recordTimer,
  transcript,
  audioBlob,
  loading,
  timePerQuestion = 60,
  timeRemaining = 60,
  onStartRecording,
  onStopRecording,
  onEvaluateAnswer,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 flex flex-col gap-6 transition-all">
      {/* Question Header Status & Per-Question Timer */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Per-Question Countdown Timer Badge */}
          {timePerQuestion > 0 ? (
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-black shadow-2xs transition-all ${
                timeRemaining <= 10
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 animate-pulse'
                  : timeRemaining <= 20
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${timeRemaining <= 10 ? 'text-rose-600 animate-spin' : 'text-emerald-600'}`} />
              <span>Timer: {formatTime(timeRemaining)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Untimed</span>
            </div>
          )}

          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-800 uppercase font-extrabold shadow-2xs">
            {currentQ.difficulty || difficultyLevel} Tier
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Technical Defense Prompt
            </span>
            <h2 className="text-lg sm:text-xl font-bold leading-relaxed tracking-tight text-slate-50">
              {currentQ.question_text}
            </h2>
          </div>
        </div>

        {/* Checkpoint Criteria */}
        {currentQ.evaluation_criteria && currentQ.evaluation_criteria.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-700/80 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Key Criteria Checkpoints Expected:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {currentQ.evaluation_criteria.map((c, i) => (
                <div key={i} className="text-xs text-slate-300 bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mode Switcher: Primary Verbal Speaking vs Alternative Text */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setAnswerMode('RECORD')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
              answerMode === 'RECORD'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md font-extrabold scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>🎙️ Primary Mode: Speak Answer</span>
          </button>

          <button
            type="button"
            onClick={() => setAnswerMode('TEXT')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
              answerMode === 'TEXT'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-300 font-extrabold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>✍️ Alternative: Type Text</span>
          </button>
        </div>

        <span className="text-[11px] font-medium text-slate-500 italic">
          {answerMode === 'RECORD'
            ? '✨ Verbal speaking is the primary assessment mode.'
            : 'ℹ️ Text input selected as alternative response method.'}
        </span>
      </div>

      {/* Input Recording vs Text Input Area */}
      {answerMode === 'RECORD' ? (
        <div className="flex flex-col gap-5 p-8 rounded-2xl bg-slate-50/80 border border-slate-200/80 items-center justify-center text-center relative overflow-hidden">
          {/* Animated Recording Soundwave Orb */}
          <div className="relative flex items-center justify-center">
            {isRecording && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-rose-500/30 animate-pulse" />
              </>
            )}

            {!isRecording ? (
              <button
                type="button"
                onClick={onStartRecording}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer relative z-10"
                title="Click to start recording"
              >
                <Mic className="w-9 h-9" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onStopRecording}
                className="w-20 h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center shadow-xl shadow-amber-500/40 animate-pulse cursor-pointer relative z-10"
                title="Click to stop recording"
              >
                <Square className="w-7 h-7 fill-white" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1 items-center">
            <span className="text-xs font-mono font-bold text-slate-700">
              {isRecording
                ? `🎙️ Recording Spoken Answer (${recordTimer}s)`
                : audioBlob
                ? '✓ Verbal response captured & ready to evaluate'
                : 'Click microphone orb to speak your answer'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isRecording ? 'AssemblyAI live transcription active' : 'Audio will be transcribed using AssemblyAI STT'}
            </span>
          </div>

          {/* Transcript Box */}
          {transcript && (
            <div className="w-full mt-2 text-left bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                Live Speech Transcript Preview:
              </span>
              <p className="text-xs text-slate-800 leading-relaxed italic font-sans">
                "{transcript}"
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            rows={6}
            className="w-full p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 text-sm text-slate-900 outline-none font-sans leading-relaxed transition-all shadow-inner"
            placeholder="Type your structured technical answer here..."
          />
          <div className="flex justify-end text-[11px] font-mono text-slate-400">
            {textAnswer.trim().length} characters
          </div>
        </div>
      )}

      {/* Submit Grade Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onEvaluateAnswer}
          disabled={
            loading ||
            (answerMode === 'RECORD' && !audioBlob && !transcript.trim()) ||
            (answerMode === 'TEXT' && !textAnswer.trim())
          }
          className="flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-teal-600/25 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating via AI Pipeline...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 fill-white" />
              <span>Submit & Grade Response</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
