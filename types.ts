
export interface AdvancedExplanation {
  id: string;
  subject: string;
  coreMessage: string;
  eli5: string;
  intermediate: string;
  advanced: string;
  technicalDepth: string;
  keyTerms: string[];
  glossary: { term: string; definition: string }[];
  analogy: string;
  visualDescription: string;
  example: string;
  counterExample: string;
  realWorldImplementation: string;
  useCases: string[];
  historicalContext: string;
  futureImplications: string;
  commonMisconceptions: string[];
  relatedConcepts: string[];
  practicalExercise: string;
  summary: string;
}

export enum ExplanationLevel {
  ELI5 = 'eli5',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Technical = 'technical',
}
