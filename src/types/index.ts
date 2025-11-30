// ==========================================
// APP AVIATION - Type Definitions
// ==========================================

// Profile Types
export interface Profile {
  id: string;
  name: string;
  alias: string;
  airline: string;
  base: string;
  aircraft_types: string[];
  role: string;
  regulation: string;
  goal: string;
  created_at: string;
  updated_at: string;
}

export interface AirlineProfile {
  id: string;
  user_id: string;
  name: string;
  code: string;
  checkin_url: string;
  created_at: string;
  updated_at: string;
}

// Duty Types
export interface DutyDay {
  id: string;
  user_id: string;
  airline_id: string;
  date_local: string;
  base_airport_code: string;
  checkin_time_utc: string;
  checkout_time_utc: string;
  timezone: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  source_id?: string;
  created_at: string;
  updated_at: string;
  // Relations
  airline?: AirlineProfile;
  legs?: DutyLeg[];
}

export interface DutyLeg {
  id: string;
  duty_day_id: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  std_utc: string;
  sta_utc: string;
  block_off_utc?: string;
  block_on_utc?: string;
  created_at: string;
  updated_at: string;
}

// Logbook Types
export interface LogbookEntry {
  id: string;
  user_id: string;
  duty_day_id?: string;
  date: string;
  aircraft_type: string;
  registration: string;
  from_airport: string;
  to_airport: string;
  block_time_minutes: number;
  role: string;
  ifr_minutes: number;
  night_minutes: number;
  notes: string;
  created_at: string;
  updated_at: string;
  // Relations
  approach_details?: ApproachDetail[];
}

export interface ApproachDetail {
  id: string;
  logbook_entry_id: string;
  approach_type: ApproachType;
  other_description?: string;
  conditions: 'VMC' | 'IMC';
  time_of_day: 'day' | 'night';
  outcome: 'landing' | 'go_around' | 'diversion';
  stabilized: boolean;
  cfit_notes?: string;
  created_at: string;
  updated_at: string;
}

export type ApproachType =
  | 'ILS_CAT_I'
  | 'ILS_CAT_II'
  | 'ILS_CAT_III'
  | 'RNAV_AR'
  | 'RNP_AR'
  | 'RNAV_GNSS'
  | 'VOR'
  | 'NDB'
  | 'LOC'
  | 'VISUAL'
  | 'CIRCLING'
  | 'OTHER';

// Study Types
export interface StudyTopic {
  id: string;
  user_id?: string;
  name: string;
  category: string;
  aircraft_type?: string;
  regulation?: string;
  created_at: string;
  updated_at: string;
  // Computed
  accuracy_percentage?: number;
}

export interface StudyQuestion {
  id: string;
  topic_id: string;
  text: string;
  options: string[];
  correct_index: number;
  explanation_base: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source_type: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  topic_id?: string;
  mode: 'test' | 'flash' | 'checkride';
  total_questions: number;
  completed: boolean;
  score: number;
  created_at: string;
  completed_at?: string;
}

export interface StudyAnswer {
  id: string;
  session_id: string;
  question_id: string;
  selected_index: number;
  correct: boolean;
  answered_at: string;
}

export interface MelConcept {
  id: string;
  aircraft_type: string;
  ata_chapter: string;
  title: string;
  description: string;
  has_questions: boolean;
  created_at: string;
  updated_at: string;
}

export interface Manual {
  id: string;
  user_id: string;
  name: string;
  category: string;
  aircraft_type: string;
  airline: string;
  storage_path: string;
  available_offline: boolean;
  created_at: string;
  updated_at: string;
}

// Layover Types
export interface Place {
  id: string;
  user_id: string;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  website?: string;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  recommended_by: string;
  created_at: string;
  updated_at: string;
  // Computed
  average_rating?: number;
  reviews?: PlaceReview[];
}

export type PlaceCategory =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'gym'
  | 'pharmacy'
  | 'supermarket'
  | 'attraction'
  | 'transport'
  | 'other';

export interface PlaceReview {
  id: string;
  place_id: string;
  user_id: string;
  rating: number;
  text: string;
  created_at: string;
}

// Document Types
export interface Document {
  id: string;
  user_id: string;
  type: DocumentType;
  name: string;
  issuer: string;
  number: string;
  country: string;
  issue_date: string;
  expiry_date: string;
  attachment_path?: string;
  notify_90: boolean;
  notify_60: boolean;
  notify_30: boolean;
  notify_7: boolean;
  notify_day: boolean;
  created_at: string;
  updated_at: string;
}

export type DocumentType =
  | 'license'
  | 'medical'
  | 'passport'
  | 'visa'
  | 'training'
  | 'airline_id'
  | 'other';

export type DocumentSection = 'regulatory' | 'airline' | 'travel' | 'other';

// Feedback Types
export interface Feedback {
  id: string;
  user_id: string;
  module: FeedbackModule;
  type: FeedbackType;
  message: string;
  status: 'new' | 'in_review' | 'answered';
  ai_response?: string;
  created_at: string;
  updated_at: string;
}

export type FeedbackModule = 'home' | 'flights' | 'study' | 'layover' | 'profile' | 'other';
export type FeedbackType = 'bug' | 'idea' | 'question' | 'other';

// AI Types
export interface MetarAnalysisResult {
  origin: {
    summary: string;
    bullets: string[];
  };
  destination: {
    summary: string;
    bullets: string[];
  };
  alternate?: {
    summary: string;
    bullets: string[];
  };
  generalRecommendations: string[];
}

export interface DutyContext {
  route: string;
  checkin_time: string;
  checkout_time: string;
  aircraft_type: string;
}

// Flight Awareness Types
export type FlightPhase =
  | 'planning'
  | 'taxi'
  | 'takeoff'
  | 'climb'
  | 'cruise'
  | 'descent'
  | 'approach'
  | 'landing'
  | 'go_around'
  | 'post_flight';

export interface PhaseAwareness {
  phase: FlightPhase;
  risks: string[];
  bestPractices: string[];
}

// Coach Types
export type CoachModule =
  | 'interview_es'
  | 'interview_en'
  | 'type_rating'
  | 'recurrent'
  | 'stress';

// News Types
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  source_type: 'official' | 'specialized' | 'general';
  summary: string;
  content: string;
  impact: string;
  simplified_explanation: string;
  published_at: string;
}

// Notification Types
export interface NotificationPreferences {
  checkin_checkout: boolean;
  daily_study: boolean;
  documents: boolean;
  news: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

// Settings Types
export interface UserSettings {
  language: 'es' | 'en';
  units: {
    altitude: 'ft' | 'm';
    weight: 'kg' | 'lb';
    temperature: 'C' | 'F';
  };
  theme: 'dark' | 'light' | 'auto';
  notifications: NotificationPreferences;
}

// Sync Types (for offline)
export interface SyncableRecord {
  id: string;
  needs_sync?: boolean;
  synced_at?: string;
}
