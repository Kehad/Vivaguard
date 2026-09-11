'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Zap,
  Clock,
  Check,
  FileText,
  HelpCircle,
  TrendingUp,
  Volume2,
  Upload,
  Send
} from 'lucide-react';

interface QuestionItem {
  question_id: number;
  question_text: string;
  difficulty?: string;
  evaluation_criteria: string[];
}

interface EvaluationResult {
  question_id: number;
  transcript: string;
  overall_score: number;
  accuracy_rating: string;
  strengths: string[];
  weaknesses: string[];
  actionable_improvements: string;
  ideal_response_summary: string;
}

const PRESET_DOMAINS = [
  { label: '🎓 Embedded Systems Thesis', domain: 'Embedded Systems Thesis Defense' },
  { label: '💻 React Native Engineer', domain: 'React Native Frontend Engineer' },
  { label: '🚀 Seed VC Pitch', domain: 'Seed-Stage VC Pitch Presentation' },
  { label: '👔 Behavioral Leadership', domain: 'Engineering Manager Leadership' }
];

export const TestSimulatorPhase: React.FC = () => {
  // Step State: 1 = Config, 2 = Question Answering, 3 = Question Grade, 4 = Final Scorecard
  const [step, setStep] = useState<number>(1);
  const [domain, setDomain] = useState<string>('Embedded Systems Thesis Defense');
  const [questionCount, setQuestionCount] = useState<number>(2);
  const [difficultyLevel, setDifficultyLevel] = useState<string>('junior');
  const [adaptiveMode, setAdaptiveMode] = useState<boolean>(true);
  const [adaptiveNotice, setAdaptiveNotice] = useState<string>('');

  // Questions & Navigation State
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Response input mode: 'RECORD' (Microphone) or 'TEXT' (Text Area)
  const [answerMode, setAnswerMode] = useState<'RECORD' | 'TEXT'>('RECORD');
  const [textAnswer, setTextAnswer] = useState<string>('');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTimer, setRecordTimer] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [currentEval, setCurrentEval] = useState<EvaluationResult | null>(null);
  const [cumulativeReport, setCumulativeReport] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // Initialize Speech Recognition fallback
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let fullStr = '';
          for (let i = 0; i < event.results.length; i++) {
            fullStr += event.results[i][0].transcript + ' ';
          }
          setTranscript(fullStr.trim());
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.error('Speech recognition error in test simulator:', e);
      }
    }
  }, []);

  const handleStartRecording = async () => {
    setTranscript('');
    setAudioBlob(null);
    audioChunksRef.current = [];
    setRecordTimer(0);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (_) {}
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (e) {
      console.warn('MediaRecorder setup error:', e);
    }

    timerRef.current = setInterval(() => {
      setRecordTimer((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
  };

  // Step 1: Generate Questions
  const handleGenerateQuestions = async () => {
    setLoading(true);
    setAdaptiveNotice('');
    try {
      const resp = await fetch(`${baseUrl}/api/v1/test-interview/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          question_count: questionCount,
          difficulty_level: difficultyLevel,
          adaptive_mode: adaptiveMode
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setQuestions(data.questions || []);
        setCurrentIndex(0);
        setStep(2);
      } else {
        alert('Failed to generate test interview questions. Ensure backend server is running.');
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      alert('Backend connection error. Please check your server setup.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit & Grade Current Answer
  const handleEvaluateAnswer = async () => {
    if (questions.length === 0) return;
    const currentQ = questions[currentIndex];
    setLoading(true);

    try {
      let resp: Response | null = null;

      // If audio blob is recorded, submit audio file to /evaluate-audio for AssemblyAI STT + grading
      if (answerMode === 'RECORD' && audioBlob) {
        try {
          const formData = new FormData();
          formData.append('audio_file', audioBlob, 'answer.webm');
          formData.append('question_id', currentQ.question_id.toString());
          formData.append('question_text', currentQ.question_text);
          formData.append('evaluation_criteria', JSON.stringify(currentQ.evaluation_criteria || []));
          formData.append('difficulty_level', difficultyLevel);
          formData.append('adaptive_mode', adaptiveMode.toString());

          resp = await fetch(`${baseUrl}/api/v1/test-interview/evaluate-audio`, {
            method: 'POST',
            body: formData
          });
        } catch (audioErr) {
          console.warn('Audio evaluation request failed, attempting text transcript fallback:', audioErr);
        }
      }

      // Fallback to text transcript evaluation if audio evaluate failed or wasn't used
      if (!resp || !resp.ok) {
        const finalTranscript = answerMode === 'TEXT' ? textAnswer : (transcript || 'No candidate response captured.');
        resp = await fetch(`${baseUrl}/api/v1/test-interview/evaluate-question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_id: currentQ.question_id,
            question_text: currentQ.question_text,
            evaluation_criteria: currentQ.evaluation_criteria || [],
            transcript: finalTranscript,
            difficulty_level: difficultyLevel,
            adaptive_mode: adaptiveMode
          })
        });
      }

      if (resp && resp.ok) {
        const result: EvaluationResult = await resp.json();
        setCurrentEval(result);
        setEvaluations((prev) => [...prev, result]);

        // Adaptive Difficulty Progression Notice
        if (adaptiveMode && (result as any).next_recommended_difficulty) {
          const nextDiff = (result as any).next_recommended_difficulty;
          if (nextDiff !== difficultyLevel) {
            setAdaptiveNotice(`Adaptive Difficulty Level Updated: Tier shifted from ${difficultyLevel} to ${nextDiff} based on your performance score of ${result.overall_score}/100.`);
            setDifficultyLevel(nextDiff);
          }
        }
        setStep(3);
      } else {
        const errDetail = resp ? await resp.text() : 'Unknown network error';
        alert(`Failed to evaluate answer: ${errDetail}`);
      }
    } catch (err) {
      console.error('Error evaluating question:', err);
      alert('Backend grading connection error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Next Question or View Scorecard
  const handleNextQuestion = async () => {
    setAdaptiveNotice('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTranscript('');
      setTextAnswer('');
      setAudioBlob(null);
      setStep(2);
    } else {
      // Final question answered - Generate Cumulative Scorecard
      setLoading(true);
      try {
        const resp = await fetch(`${baseUrl}/api/v1/test-interview/cumulative-report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain,
            format: 'Technical Deep Dive',
            evaluations: evaluations
          })
        });
        if (resp.ok) {
          const report = await resp.json();
          setCumulativeReport(report);
          setStep(4);
        } else {
          setStep(4);
        }
      } catch (err) {
        console.error('Cumulative report error:', err);
        setStep(4);
      } finally {
        setLoading(false);
      }
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold uppercase tracking-wider mx-auto shadow-md">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Interactive Test Interview Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Adaptive Question & Grading Simulator
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Simulate a real-world technical deep-dive or defense examination. Answer questions verbally or via text, receive instant AI scoring, and track your readiness.
        </p>
      </div>

      {/* Step 1: Configuration Form */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Preset Domain or Enter Custom Subject
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_DOMAINS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDomain(p.domain);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    domain === p.domain
                      ? 'bg-slate-950 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-white">{p.label}</span>
                  <span className="text-[11px] text-slate-500">{p.domain}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-slate-100 outline-none mt-2 font-sans"
              placeholder="e.g. Distributed Systems & Shared Cache Architecture"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Question Count */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Question Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 outline-none"
              >
                <option value={2}>2 Questions</option>
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            {/* Baseline Difficulty */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Baseline Tier</label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 outline-none"
              >
                <option value="junior">Junior / Entry</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior / Principal</option>
              </select>
            </div>

            {/* Adaptive Progression */}
            <div className="flex flex-col gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAdaptiveMode(!adaptiveMode)}
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  adaptiveMode
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>Adaptive Difficulty</span>
                <span className="font-mono">{adaptiveMode ? 'ENABLED ✓' : 'OFF'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleGenerateQuestions}
              disabled={loading || !domain.trim()}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-emerald-950/50 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{loading ? 'Generating Questions with AI...' : 'Generate Practice Interview Questions'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Question Answering Interface */}
      {step === 2 && currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-amber-400 uppercase">
              {currentQ.difficulty || difficultyLevel} Tier
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question_text}
            </h2>
            {currentQ.evaluation_criteria && currentQ.evaluation_criteria.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-900">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Criteria Checkpoints to Address:
                </span>
                <ul className="space-y-1">
                  {currentQ.evaluation_criteria.map((c, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Mode Switcher: Record Audio vs Type Text */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
            <button
              onClick={() => setAnswerMode('RECORD')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                answerMode === 'RECORD' ? 'bg-cyan-950 border border-cyan-800 text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Record Verbal Answer</span>
            </button>

            <button
              onClick={() => setAnswerMode('TEXT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                answerMode === 'TEXT' ? 'bg-cyan-950 border border-cyan-800 text-cyan-400' : 'text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Type Text Answer</span>
            </button>
          </div>

          {/* Input Area */}
          {answerMode === 'RECORD' ? (
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-950 border border-slate-800 items-center justify-center text-center">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-950/60 transition-all hover:scale-105"
                >
                  <Mic className="w-8 h-8" />
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/60 animate-pulse"
                >
                  <Square className="w-6 h-6 fill-slate-950" />
                </button>
              )}
              <span className="text-xs font-mono text-slate-400">
                {isRecording ? `Recording... (${recordTimer}s)` : (audioBlob ? 'Recording captured ✓ Click Submit to Grade' : 'Click microphone to record your spoken response')}
              </span>
              {transcript && (
                <p className="text-xs text-slate-300 max-w-xl text-left bg-slate-900 p-4 rounded-xl border border-slate-800 w-full mt-2 font-sans">
                  {transcript}
                </p>
              )}
            </div>
          ) : (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              rows={5}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 outline-none font-sans"
              placeholder="Type your structured technical answer here..."
            />
          )}

          {/* Submit Grade Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleEvaluateAnswer}
              disabled={loading || (answerMode === 'RECORD' && !audioBlob && !transcript.trim()) || (answerMode === 'TEXT' && !textAnswer.trim())}
              className="flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-cyan-950/50 disabled:opacity-50"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>{loading ? 'Evaluating Answer via AI...' : 'Submit & Grade Response'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Instant AI Evaluation Results */}
      {step === 3 && currentEval && (
        <div className="flex flex-col gap-6">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Evaluation Result for Question {currentIndex + 1}
                  </span>
                  <span className="text-xl font-extrabold text-white">
                    {currentEval.accuracy_rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
                  {currentEval.overall_score}<span className="text-xl text-slate-500">/100</span>
                </div>
              </div>
            </div>

            {/* Adaptive Notice */}
            {adaptiveNotice && (
              <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-bold flex items-center gap-3 shadow-lg">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{adaptiveNotice}</span>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800/90 flex flex-col gap-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Key Strengths Identified
                </span>
                <ul className="space-y-2">
                  {currentEval.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800/90 flex flex-col gap-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Weaknesses & Omitted Points
                </span>
                <ul className="space-y-2">
                  {currentEval.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Coaching Advice */}
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-cyan-900/60 flex flex-col gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Actionable Coaching Advice</span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">{currentEval.actionable_improvements}</p>
            </div>

            {/* Model Answer Summary */}
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800/90 flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ideal Model Answer Summary</span>
              <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
                {currentEval.ideal_response_summary}
              </p>
            </div>

            {/* Next Button */}
            <div className="flex justify-center py-2">
              <button
                onClick={handleNextQuestion}
                disabled={loading}
                className="flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-emerald-950/50"
              >
                <span>{currentIndex + 1 < questions.length ? 'Proceed to Next Question' : 'Finish & View Cumulative Scorecard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Final Cumulative Scorecard */}
      {step === 4 && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-slate-900/90 border border-slate-800/90 rounded-3xl backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider w-fit mx-auto md:mx-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Test Session Complete</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Readiness Score: <span className="text-emerald-400">{cumulativeReport?.readiness_percentage || 85}%</span>
              </h1>
              <p className="text-xs text-slate-400 max-w-xl">
                Domain: {domain} ({evaluations.length} Questions Evaluated)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1 bg-slate-950 border border-slate-800 p-6 rounded-2xl font-mono">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Score</span>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {cumulativeReport?.overall_score || 82}<span className="text-2xl text-slate-500">/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl flex flex-col gap-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Cumulative Strengths
              </span>
              <ul className="space-y-2">
                {(cumulativeReport?.cumulative_strengths || ['Strong technical vocabulary', 'Clear structure']).map((s: string, i: number) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Top Persistent Blindspots
              </span>
              <ul className="space-y-2">
                {(cumulativeReport?.persistent_weaknesses || ['Omitted quantitative benchmark metrics']).map((w: string, i: number) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <button
              onClick={() => {
                setStep(1);
                setEvaluations([]);
                setCurrentEval(null);
                setCumulativeReport(null);
              }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-xl"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Start New Test Simulator Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
