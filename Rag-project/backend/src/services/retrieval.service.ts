import { createEmbedding } from "./embedding.service.js";
import { searchSimilarDocuments } from "./database.service.js";

export async function retrieveRelevantDocuments(
  question: string,
  limit: number = 3
) {
  // 1. Convert question into embedding
  const queryEmbedding = await createEmbedding(question);

  if (!queryEmbedding) {
    throw new Error("Failed to create query embedding");
  }

  console.log(
    "Query embedding dimensions:",
    queryEmbedding.length
  );

  // 2. Search PostgreSQL for similar documents
  const results = await searchSimilarDocuments(
    queryEmbedding,
    limit
  );

  return results;
}