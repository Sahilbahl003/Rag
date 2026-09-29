import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testDatabaseConnection() {
  const result = await pool.query("SELECT NOW()");
  
  console.log("Database connected:", result.rows[0]);
}

export async function saveDocument(
  content: string,
  embedding: number[]
) {
  const result = await pool.query(
    `
    INSERT INTO documents (content, embedding)
    VALUES ($1, $2)
    RETURNING id, content, created_at
    `,
    [content, JSON.stringify(embedding)]
  );

  return result.rows[0];
}

export async function searchSimilarDocuments(
  queryEmbedding: number[],
  limit: number = 3
) {
  const result = await pool.query(
    `
    SELECT
      id,
      content,
      embedding <=> $1 AS distance
    FROM documents
    ORDER BY embedding <=> $1
    LIMIT $2
    `,
    [JSON.stringify(queryEmbedding), limit]
  );

  return result.rows;
}

//this compares stored document embedding with question embedding (embedding <=> $1 ) because question store at 1st position thas why $1