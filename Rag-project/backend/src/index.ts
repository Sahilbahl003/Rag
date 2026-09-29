import express from "express";
import dotenv from "dotenv";

import documentRoutes from "./routes/document.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/documents", documentRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// //import { GoogleGenAI } from "@google/genai";

// import {createEmbedding} from "./services/embedding.service.js"
// import { testDatabaseConnection, saveDocument, searchSimilarDocuments, } from "./services/database.service.js";
// import { generateAnswer } from "./services/generation.service.js";



// // const ai = new GoogleGenAI({
// //   apiKey: process.env.GEMINI_API_KEY,
// // });

// async function main() {
// //   const interaction = await ai.interactions.create({
// //     model: "gemini-3.8-flash",
// //     input: "Explain what is rag in two simple sentences.",
// //   });

// //   console.log(interaction.output_text);
// //  await testDatabaseConnection();

// //    const documents = [
// //     "I love programming",
// //     "Python is a popular programming language",
// //     "PostgreSQL is a relational database",
// //     "Pizza is a popular Italian food",
// //   ];

// //   for (const text of documents) {
// //     const embedding = await createEmbedding(text);

// //     if (!embedding) {
// //       throw new Error(`Failed to create embedding for: ${text}`);
// //     }

// //     const document = await saveDocument(text, embedding);

// //     console.log("Saved:", document);
// //   }


// // const question = "What do I enjoy doing?";

// //   const queryEmbedding = await createEmbedding(question);

// //   if (!queryEmbedding) {
// //     throw new Error("Failed to create query embedding");
// //   }

// //   console.log("Query embedding dimensions:", queryEmbedding.length);

// //   const results = await searchSimilarDocuments(
// //     queryEmbedding,
// //     3
// //   );

// //   console.log("\nRetrieved documents:");

// //   for (const result of results) {
// //     console.log("\nID:", result.id);
// //     console.log("Content:", result.content);
// //     console.log("Distance:", result.distance);
// //   }

//  const question = "what is postgresql?";

//   // 1. Convert question into embedding
//   const queryEmbedding = await createEmbedding(question);

//   if (!queryEmbedding) {
//     throw new Error("Failed to create query embedding");
//   }

//   console.log("Query embedding dimensions:", queryEmbedding.length);

//   // 2. Retrieve similar documents
//   const results = await searchSimilarDocuments(queryEmbedding, 3);

//   console.log("\nRetrieved documents:");

//   for (const result of results) {
//     console.log("\nID:", result.id);
//     console.log("Content:", result.content);
//     console.log("Distance:", result.distance);
//   }

//   // 3. Create context from retrieved documents
//   const context = results
//     .map((result) => result.content)
//     .join("\n\n");

//   console.log("\nContext sent to Gemini:");
//   console.log(context);

//   // 4. Generate final answer
//   const answer = await generateAnswer(question, context);

//   console.log("\nFinal Answer:");
//   console.log(answer);

// }

// main();