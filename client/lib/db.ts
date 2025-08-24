import Dexie, { EntityTable } from 'dexie'
import { Listing } from './interfaces';

export const db = new Dexie('applications') as Dexie & {
  applications: EntityTable<
    Listing,
    'title'
  >
};

db.version(1).stores({
  applications: 'title, description, company, link' // Primary key and indexed props
});