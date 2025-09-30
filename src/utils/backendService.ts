const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export class BackendService {
  // Create new candidate
  static async createCandidate(candidateData: any) {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData)
    });
    return response.json();
  }

  // Get all candidates
  static async getCandidates() {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    return response.json();
  }

  // Add answer to candidate
  static async addAnswer(candidateId: string, answer: any) {
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answer)
    });
    return response.json();
  }

  // Complete interview
  static async completeInterview(candidateId: string, score: number, summary: string) {
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, summary })
    });
    return response.json();
  }

  // Generate AI question
  static async generateQuestion(questionIndex: number, candidateData?: any, previousAnswers?: any[]) {
    const response = await fetch(`${API_BASE_URL}/ai/generate-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionIndex, candidateData, previousAnswers })
    });
    return response.json();
  }

  // Evaluate answer with AI
  static async evaluateAnswer(question: any, answer: string, timeSpent: number) {
    const response = await fetch(`${API_BASE_URL}/ai/evaluate-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, timeSpent })
    });
    const result = await response.json();
    return result.score;
  }
}