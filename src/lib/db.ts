import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Input, CreateInput, Idea, CreateIdea, Post, CreatePost } from "@/types";

const DB_PATH = path.join(process.cwd(), "data", "linkedin.db");
const SCHEMA_PATH = path.join(process.cwd(), "src", "lib", "schema.sql");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    // Apply schema
    const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
    db.exec(schema);
  }
  return db;
}

// Input operations
export function createInput(data: CreateInput): Input {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO inputs (type, content)
    VALUES (@type, @content)
  `);
  const result = stmt.run(data);
  return getInputById(result.lastInsertRowid as number)!;
}

export function getInputById(id: number): Input | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM inputs WHERE id = ?").get(id) as {
    id: number;
    type: "article" | "topic";
    content: string;
    created_at: string;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    type: row.type,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function getAllInputs(): Input[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM inputs ORDER BY created_at DESC").all() as Array<{
    id: number;
    type: "article" | "topic";
    content: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    content: row.content,
    createdAt: row.created_at,
  }));
}

export function deleteInput(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM inputs WHERE id = ?").run(id);
  return result.changes > 0;
}

// Idea operations
export function createIdea(data: CreateIdea): Idea {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO ideas (input_id, title, description)
    VALUES (@inputId, @title, @description)
  `);
  const result = stmt.run(data);
  return getIdeaById(result.lastInsertRowid as number)!;
}

export function getIdeaById(id: number): Idea | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM ideas WHERE id = ?").get(id) as {
    id: number;
    input_id: number;
    title: string;
    description: string;
    created_at: string;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    inputId: row.input_id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
  };
}

export function getIdeasByInputId(inputId: number): Idea[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM ideas WHERE input_id = ? ORDER BY created_at ASC").all(inputId) as Array<{
    id: number;
    input_id: number;
    title: string;
    description: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    inputId: row.input_id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
  }));
}

export function deleteIdea(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM ideas WHERE id = ?").run(id);
  return result.changes > 0;
}

// Post operations
export function createPost(data: CreatePost): Post {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO posts (idea_id, content, length, tone, hashtags, best_time)
    VALUES (@ideaId, @content, @length, @tone, @hashtags, @bestTime)
  `);
  const result = stmt.run({
    ...data,
    hashtags: JSON.stringify(data.hashtags),
  });
  return getPostById(result.lastInsertRowid as number)!;
}

export function getPostById(id: number): Post | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as {
    id: number;
    idea_id: number;
    content: string;
    length: "short" | "medium" | "long";
    tone: "professional" | "conversational" | "storytelling" | "thought-leader";
    hashtags: string;
    best_time: string | null;
    created_at: string;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    ideaId: row.idea_id,
    content: row.content,
    length: row.length,
    tone: row.tone,
    hashtags: JSON.parse(row.hashtags) as string[],
    bestTime: row.best_time,
    createdAt: row.created_at,
  };
}

export function getPostsByIdeaId(ideaId: number): Post[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM posts WHERE idea_id = ? ORDER BY created_at ASC").all(ideaId) as Array<{
    id: number;
    idea_id: number;
    content: string;
    length: "short" | "medium" | "long";
    tone: "professional" | "conversational" | "storytelling" | "thought-leader";
    hashtags: string;
    best_time: string | null;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    ideaId: row.idea_id,
    content: row.content,
    length: row.length,
    tone: row.tone,
    hashtags: JSON.parse(row.hashtags) as string[],
    bestTime: row.best_time,
    createdAt: row.created_at,
  }));
}

export function deletePost(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  return result.changes > 0;
}

// History operations
export interface HistoryEntry {
  id: number;
  type: "article" | "topic";
  content: string;
  createdAt: string;
  ideaCount: number;
}

export function getHistory(limit = 50, offset = 0): HistoryEntry[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      i.id,
      i.type,
      i.content,
      i.created_at,
      COUNT(ideas.id) as idea_count
    FROM inputs i
    LEFT JOIN ideas ON ideas.input_id = i.id
    GROUP BY i.id
    ORDER BY i.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as Array<{
    id: number;
    type: "article" | "topic";
    content: string;
    created_at: string;
    idea_count: number;
  }>;

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    content: row.content,
    createdAt: row.created_at,
    ideaCount: row.idea_count,
  }));
}

export function getHistoryCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM inputs").get() as { count: number };
  return row.count;
}

// Utility to close database connection
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
