import { supabase } from '@/lib/supabase/client';
import { db, getUnsynced, markAsSynced } from './dexieClient';

// Check if online
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Sync duty days
async function syncDutyDays(): Promise<void> {
  const unsynced = await getUnsynced(db.dutyDays);

  for (const record of unsynced) {
    const { needs_sync, synced_at, ...data } = record;

    const { error } = await supabase
      .from('duty_days')
      .upsert(data, { onConflict: 'id' });

    if (!error) {
      await markAsSynced(db.dutyDays, record.id);
    } else {
      console.error('Failed to sync duty day:', record.id, error);
    }
  }
}

// Sync duty legs
async function syncDutyLegs(): Promise<void> {
  const unsynced = await getUnsynced(db.dutyLegs);

  for (const record of unsynced) {
    const { needs_sync, synced_at, ...data } = record;

    const { error } = await supabase
      .from('duty_legs')
      .upsert(data, { onConflict: 'id' });

    if (!error) {
      await markAsSynced(db.dutyLegs, record.id);
    } else {
      console.error('Failed to sync duty leg:', record.id, error);
    }
  }
}

// Sync logbook entries
async function syncLogbookEntries(): Promise<void> {
  const unsynced = await getUnsynced(db.logbookEntries);

  for (const record of unsynced) {
    const { needs_sync, synced_at, approach_details, ...data } = record;

    const { error } = await supabase
      .from('logbook_entries')
      .upsert(data, { onConflict: 'id' });

    if (!error) {
      await markAsSynced(db.logbookEntries, record.id);
    } else {
      console.error('Failed to sync logbook entry:', record.id, error);
    }
  }
}

// Sync approach details
async function syncApproachDetails(): Promise<void> {
  const unsynced = await getUnsynced(db.approachDetails);

  for (const record of unsynced) {
    const { needs_sync, synced_at, ...data } = record;

    const { error } = await supabase
      .from('approach_details')
      .upsert(data, { onConflict: 'id' });

    if (!error) {
      await markAsSynced(db.approachDetails, record.id);
    } else {
      console.error('Failed to sync approach detail:', record.id, error);
    }
  }
}

// Sync documents
async function syncDocuments(): Promise<void> {
  const unsynced = await getUnsynced(db.documents);

  for (const record of unsynced) {
    const { needs_sync, synced_at, ...data } = record;

    const { error } = await supabase
      .from('documents')
      .upsert(data, { onConflict: 'id' });

    if (!error) {
      await markAsSynced(db.documents, record.id);
    } else {
      console.error('Failed to sync document:', record.id, error);
    }
  }
}

// Sync places
async function syncPlaces(): Promise<void> {
  const unsynced = await getUnsynced(db.places);

  for (const record of unsynced) {
    const { needs_sync, synced_at, average_rating, reviews, ...data } = record;

    const { error } = await supabase
      .from('places')
      .upsert(data, { onConflict: 'id' });

    if (!error) {
      await markAsSynced(db.places, record.id);
    } else {
      console.error('Failed to sync place:', record.id, error);
    }
  }
}

// Sync place reviews
async function syncPlaceReviews(): Promise<void> {
  const unsynced = await getUnsynced(db.placeReviews);

  for (const record of unsynced) {
    const { needs_sync, synced_at, ...data } = record;

    const { error } = await supabase
      .from('place_reviews')
      .upsert(data, { onConflict: 'id' });

    if (!error) {
      await markAsSynced(db.placeReviews, record.id);
    } else {
      console.error('Failed to sync place review:', record.id, error);
    }
  }
}

// Pull latest data from Supabase
async function pullLatestData(userId: string): Promise<void> {
  // Pull duty days
  const { data: dutyDays } = await supabase
    .from('duty_days')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(100);

  if (dutyDays) {
    for (const duty of dutyDays) {
      const local = await db.dutyDays.get(duty.id);
      if (!local || !local.needs_sync) {
        await db.dutyDays.put({ ...duty, needs_sync: false, synced_at: new Date().toISOString() });
      }
    }
  }

  // Pull study topics
  const { data: topics } = await supabase
    .from('study_topics')
    .select('*')
    .order('updated_at', { ascending: false });

  if (topics) {
    for (const topic of topics) {
      const local = await db.studyTopics.get(topic.id);
      if (!local || !local.needs_sync) {
        await db.studyTopics.put({ ...topic, needs_sync: false, synced_at: new Date().toISOString() });
      }
    }
  }

  // Pull study questions
  const { data: questions } = await supabase
    .from('study_questions')
    .select('*')
    .order('updated_at', { ascending: false });

  if (questions) {
    for (const question of questions) {
      const local = await db.studyQuestions.get(question.id);
      if (!local || !local.needs_sync) {
        await db.studyQuestions.put({ ...question, needs_sync: false, synced_at: new Date().toISOString() });
      }
    }
  }

  // Pull documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (documents) {
    for (const doc of documents) {
      const local = await db.documents.get(doc.id);
      if (!local || !local.needs_sync) {
        await db.documents.put({ ...doc, needs_sync: false, synced_at: new Date().toISOString() });
      }
    }
  }

  // Pull places
  const { data: places } = await supabase
    .from('places')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(200);

  if (places) {
    for (const place of places) {
      const local = await db.places.get(place.id);
      if (!local || !local.needs_sync) {
        await db.places.put({ ...place, needs_sync: false, synced_at: new Date().toISOString() });
      }
    }
  }
}

// Main sync function
export async function syncAll(userId: string): Promise<void> {
  if (!isOnline()) {
    console.log('Offline - skipping sync');
    return;
  }

  console.log('Starting sync...');

  try {
    // Push local changes first
    await Promise.all([
      syncDutyDays(),
      syncDutyLegs(),
      syncLogbookEntries(),
      syncApproachDetails(),
      syncDocuments(),
      syncPlaces(),
      syncPlaceReviews(),
    ]);

    // Then pull latest data
    await pullLatestData(userId);

    console.log('Sync completed');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Hook to run sync periodically
export function useSyncEffect(userId: string | undefined) {
  if (typeof window === 'undefined') return;

  // Sync on online event
  const handleOnline = () => {
    if (userId) {
      syncAll(userId);
    }
  };

  window.addEventListener('online', handleOnline);

  // Initial sync
  if (userId && isOnline()) {
    syncAll(userId);
  }

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
