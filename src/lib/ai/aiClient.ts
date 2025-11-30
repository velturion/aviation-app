import type { MetarAnalysisResult, DutyContext, CoachModule } from '@/types';

const AI_API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_BASE_URL || '';

interface StudyContext {
  topicId?: string;
  regulation?: string;
  aircraftType?: string;
}

interface FeedbackRecord {
  message: string;
  module: string;
  type: string;
}

// Analyze METAR/TAF with CFIT/ALAR recommendations
export async function analyzeMetarCfitAlar(
  fromIata: string,
  toIata: string,
  alternateIata: string | undefined,
  metarTafText: string,
  dutyContext: DutyContext
): Promise<MetarAnalysisResult> {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/analyze-metar-cfit-alar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromIata,
        toIata,
        alternateIata,
        metarTafText,
        dutyContext,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze METAR');
    }

    return await response.json();
  } catch (error) {
    console.error('METAR analysis error:', error);
    // Return fallback response
    return {
      origin: {
        summary: 'Análisis no disponible - sin conexión',
        bullets: ['Verifica METAR/TAF manualmente en fuentes oficiales'],
      },
      destination: {
        summary: 'Análisis no disponible - sin conexión',
        bullets: ['Verifica METAR/TAF manualmente en fuentes oficiales'],
      },
      generalRecommendations: [
        'Consulta fuentes meteorológicas oficiales',
        'Revisa NOTAMs del aeropuerto',
        'Mantén consciencia situacional CFIT/ALAR',
      ],
    };
  }
}

// AI for study questions
export async function askStudyAi(
  question: string,
  context: StudyContext
): Promise<string> {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/ask-study`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        context,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Study AI error:', error);
    return 'Lo siento, no puedo responder en este momento. Por favor, intenta más tarde o consulta tus manuales de estudio.';
  }
}

// AI Coach for interviews, stress management, etc.
export async function askCoachAi(
  message: string,
  module: CoachModule
): Promise<string> {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/ask-coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        module,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get coach response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Coach AI error:', error);
    return 'El coach no está disponible en este momento. Por favor, intenta más tarde.';
  }
}

// Generate AI response for feedback (used in backend)
export async function answerFeedbackWithAi(
  feedbackRecord: FeedbackRecord
): Promise<string> {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/answer-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackRecord),
    });

    if (!response.ok) {
      throw new Error('Failed to generate feedback response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Feedback AI error:', error);
    return '';
  }
}

// Extended explanation for study questions
export async function getExtendedExplanation(
  questionId: string,
  questionText: string,
  correctAnswer: string,
  baseExplanation: string
): Promise<string> {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/extended-explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId,
        questionText,
        correctAnswer,
        baseExplanation,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get extended explanation');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error('Extended explanation error:', error);
    return baseExplanation;
  }
}
