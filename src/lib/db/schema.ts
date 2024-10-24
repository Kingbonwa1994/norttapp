import { pgTable, text, timestamp, uuid, varchar, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  album: varchar('album', { length: 255 }),
  genre: varchar('genre', { length: 100 }),
  storageUrl: text('storage_url').notNull(),
  userId: uuid('user_id').references(() => users.id),
  metadata: jsonb('metadata'),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reels = pgTable('reels', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  userId: uuid('user_id').references(() => users.id),
  views: integer('views').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const collaborations = pgTable('collaborations', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').references(() => users.id),
  receiverId: uuid('receiver_id').references(() => users.id),
  status: varchar('status', { length: 50 }).default('pending'),
  message: text('message'),
  songId: uuid('song_id').references(() => songs.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const stations = pgTable('stations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  genres: jsonb('genres'),
  createdAt: timestamp('created_at').defaultNow(),
});