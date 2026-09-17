export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface StatuteCitation {
  id: string;
  act: string;
  section: string;
  title: string;
  summary: string;
  authority: string;
  remedy: string;
}

export interface FairTemplateMatch {
  clause_type: string;
  predatory_pattern: string;
  fair_title: string;
  fair_text: string;
  key_differences: string[];
  law_reference: string;
}

export interface ClauseEvaluation {
  clause_id: string;
  clause_number: number;
  title: string;
  category: string;
  raw_text: string;
  risk_score: number; // 0 - 10
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_score: number; // 0.0 - 1.0
  plain_language_explanation: string;
  vernacular_explanation: {
    English: string;
    Hindi: string;
    Tamil: string;
    [key: string]: string;
  };
  voice_speech_text: string;
  statute_citation?: StatuteCitation;
  actionable_steps: string[];
  government_remedy?: {
    authority: string;
    statutory_remedy: string;
  };
  fair_template_match?: FairTemplateMatch;
  is_predatory: boolean;
}

export interface ScamAssessment {
  detected: boolean;
  confidence: number;
  scam_type: string;
  red_flags: string[];
  police_warning: string;
  portal_link: string;
}

export interface ActionChecklistItem {
  clause_title: string;
  clause_num: number;
  risk_level: string;
  action: string;
  statute: string;
  authority: string;
  portal_link: string;
}

export interface DocumentAnalysisResult {
  document_id: string;
  title: string;
  total_clauses: number;
  overall_risk_score: number;
  overall_risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  average_confidence: number;
  scam_assessment: ScamAssessment;
  clauses: ClauseEvaluation[];
  actionable_checklist: ActionChecklistItem[];
  watson_governance_id: string;
  processed_at: string;
  model_name: string;
}

export interface DemoDocument {
  id: string;
  title: string;
  language: string;
  category: string;
  description: string;
  content: string;
}

export interface ConsequenceResponse {
  scenario: string;
  immediate_consequence: string;
  legal_reality: string;
  tenant_rights: string;
  practical_action: string;
  statutory_shield: string;
  success_probability: string;
  disclaimer: string;
}

export interface GovernanceAuditRecord {
  governance_id: string;
  timestamp: string;
  model_id: string;
  watsonx_orchestrator: string;
  clauses_analyzed: number;
  overall_risk: number;
  hallucination_guardrail: string;
  bias_check: string;
  statutes_grounded: string[];
  execution_latency_ms: number;
}
