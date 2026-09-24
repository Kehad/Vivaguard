export interface QuestionItem {
  question_id: number;
  question_text: string;
  difficulty?: string;
  evaluation_criteria: string[];
}

export interface EvaluationResult {
  question_id: number;
  transcript: string;
  overall_score: number;
  accuracy_rating: string;
  strengths: string[];
  weaknesses: string[];
  actionable_improvements: string;
  ideal_response_summary: string;
  audio_base64?: string;
}

export const PRESET_DOMAINS = [
  { label: '🎓 University Thesis Defense', domain: 'Academic Research Thesis Defense' },
  { label: '💻 Software & System Design Interview', domain: 'Software Engineering & System Design Interview' },
  { label: '🚀 Startup Pitch Practice', domain: 'Startup Pitch Presentation & VC Defense' },
  { label: '👔 Behavioral & Leadership Interview', domain: 'Leadership & Behavioral Management Interview' }
];
