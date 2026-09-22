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
  { label: '🎓 Embedded Systems Thesis', domain: 'Embedded Systems Thesis Defense' },
  { label: '💻 React Native Engineer', domain: 'React Native Frontend Engineer' },
  { label: '🚀 Seed VC Pitch', domain: 'Seed-Stage VC Pitch Presentation' },
  { label: '👔 Behavioral Leadership', domain: 'Engineering Manager Leadership' }
];
