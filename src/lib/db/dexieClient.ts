import Dexie, { Table } from 'dexie';
import type {
  DutyDay,
  DutyLeg,
  LogbookEntry,
  ApproachDetail,
  StudyTopic,
  StudyQuestion,
  StudySession,
  Manual,
  Place,
  PlaceReview,
  Document,
} from '@/types';

// Extended types with sync fields
interface SyncableRecord {
  needs_sync?: boolean;
  synced_at?: string;
}

export type LocalDutyDay = DutyDay & SyncableRecord;
export type LocalDutyLeg = DutyLeg & SyncableRecord;
export type LocalLogbookEntry = LogbookEntry & SyncableRecord;
export type LocalApproachDetail = ApproachDetail & SyncableRecord;
export type LocalStudyTopic = StudyTopic & SyncableRecord;
export type LocalStudyQuestion = StudyQuestion & SyncableRecord;
export type LocalStudySession = StudySession & SyncableRecord;
export type LocalManual = Manual & SyncableRecord;
export type LocalPlace = Place & SyncableRecord;
export type LocalPlaceReview = PlaceReview & SyncableRecord;
export type LocalDocument = Document & SyncableRecord;

class AviationDB extends Dexie {
  dutyDays!: Table<LocalDutyDay>;
  dutyLegs!: Table<LocalDutyLeg>;
  logbookEntries!: Table<LocalLogbookEntry>;
  approachDetails!: Table<LocalApproachDetail>;
  studyTopics!: Table<LocalStudyTopic>;
  studyQuestions!: Table<LocalStudyQuestion>;
  studySessions!: Table<LocalStudySession>;
  manuals!: Table<LocalManual>;
  places!: Table<LocalPlace>;
  placeReviews!: Table<LocalPlaceReview>;
  documents!: Table<LocalDocument>;

  constructor() {
    super('AviationDB');

    this.version(1).stores({
      dutyDays: 'id, user_id, date_local, airline_id, needs_sync',
      dutyLegs: 'id, duty_day_id, needs_sync',
      logbookEntries: 'id, user_id, date, duty_day_id, needs_sync',
      approachDetails: 'id, logbook_entry_id, needs_sync',
      studyTopics: 'id, user_id, category, needs_sync',
      studyQuestions: 'id, topic_id, needs_sync',
      studySessions: 'id, user_id, topic_id, needs_sync',
      manuals: 'id, user_id, category, aircraft_type, needs_sync',
      places: 'id, user_id, category, needs_sync',
      placeReviews: 'id, place_id, user_id, needs_sync',
      documents: 'id, user_id, type, expiry_date, needs_sync',
    });
  }
}

export const db = new AviationDB();

// Helper functions for offline-first operations
export async function saveWithSync<T extends { id: string }>(
  table: Table<T & SyncableRecord>,
  record: T
): Promise<string> {
  const localRecord = {
    ...record,
    needs_sync: true,
    synced_at: undefined,
  } as T & SyncableRecord;

  await table.put(localRecord);
  return record.id;
}

export async function markAsSynced<T extends { id: string }>(
  table: Table<T & SyncableRecord>,
  id: string
): Promise<void> {
  await table.update(id, {
    needs_sync: false,
    synced_at: new Date().toISOString(),
  } as Partial<T & SyncableRecord>);
}

export async function getUnsynced<T extends SyncableRecord>(
  table: Table<T>
): Promise<T[]> {
  return table.where('needs_sync').equals(1).toArray();
}
