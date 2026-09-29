import { Router } from "express";
import multer from "multer";

import { extractTextFromPDF } from "../services/pdf.service.js";
import { chunkText } from "../services/chunk.service.js";
import { createEmbedding } from "../services/embedding.service.js";
import { saveDocument } from "../services/database.service.js";
import { retrieveRelevantDocuments } from "../services/retrieval.service.js";
import { generateAnswer } from "../services/generation.service.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF is required",
      });
    }

    console.log("Uploaded PDF:", req.file.originalname);

    // 1. Extract text
    const text = await extractTextFromPDF(req.file.path);

    console.log("\nExtracted text:\n");
    console.log(text);

    // 2. Create chunks
    const chunks = chunkText(text);

    console.log("\nChunks:\n");

    chunks.forEach((chunk, index) => {
      console.log(`\n--- Chunk ${index + 1} ---`);
      console.log(chunk);
    });

    // 3. Create embeddings and save to PostgreSQL
    for (const [index, chunk] of chunks.entries()) {
      const embedding = await createEmbedding(chunk);

      if (!embedding) {
        throw new Error(
          `Failed to create embedding for chunk ${index + 1}`
        );
      }

      console.log(
        `Chunk ${index + 1} embedding dimensions:`,
        embedding.length
      );

      // 4. Save chunk + embedding to PostgreSQL
      const savedDocument = await saveDocument(
        chunk,
        embedding
      );

      console.log(
        `Chunk ${index + 1} saved with ID:`,
        savedDocument.id
      );
    }

    res.json({
      message: "PDF processed and saved successfully",
      filename: req.file.originalname,
      chunksSaved: chunks.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to process PDF",
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const question = req.query.question as string;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    console.log("\nQuestion:", question);

    // 1. Retrieve relevant chunks
    const results = await retrieveRelevantDocuments(
      question,
      3
    );

    console.log("\nRetrieved documents:");

    results.forEach((result, index) => {
      console.log(`\n--- Result ${index + 1} ---`);
      console.log("ID:", result.id);
      console.log("Content:", result.content);
      console.log("Distance:", result.distance);
    });

    // 2. Create context from retrieved chunks
    const context = results
      .map((result) => result.content)
      .join("\n\n");

    console.log("\nContext sent to Gemini:");
    console.log(context);

    // 3. Generate final answer
    const answer = await generateAnswer(
      question,
      context
    );

    console.log("\nFinal Answer:");
    console.log(answer);

    res.json({
      question,
      answer,
      sources: results,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate answer",
    });
  }
});

export default router;