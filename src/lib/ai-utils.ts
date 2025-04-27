import { pipeline, Pipeline, Tensor, FeatureExtractionPipeline } from '@xenova/transformers';
import { knowledgeBase, KnowledgeBaseEntry } from './ai-knowledge-base';

// Define interfaces for clarity
interface EmbeddingEntry {
  id: string;
  text: string;
  embedding: number[];
}

// --- Singleton Pattern for Embedding Pipeline ---
// Avoids reloading the model on every request
let embeddingPipeline: FeatureExtractionPipeline | null = null;

async function getEmbeddingPipeline(): Promise<FeatureExtractionPipeline> {
  if (embeddingPipeline === null) {
    console.log('Loading embedding model...');
    // Using Xenova/all-MiniLM-L6-v2 - a good, small sentence transformer
    // Set cache_dir to .next/cache/transformers to leverage Next.js caching if possible
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2') as FeatureExtractionPipeline;
    console.log('Embedding model loaded.');
  }
  return embeddingPipeline;
}
// -----------------------------------------------

// --- Precomputed Knowledge Base Embeddings ---
let knowledgeBaseEmbeddings: EmbeddingEntry[] | null = null;

async function getKnowledgeBaseEmbeddings(): Promise<EmbeddingEntry[]> {
  if (knowledgeBaseEmbeddings === null) {
    console.log('Generating knowledge base embeddings...');
    const pipe = await getEmbeddingPipeline();
    knowledgeBaseEmbeddings = [];
    for (const entry of knowledgeBase) {
      const embeddingVector = await generateEmbedding(entry.text, pipe);
      if (embeddingVector) {
        knowledgeBaseEmbeddings.push({
          ...entry,
          embedding: embeddingVector,
        });
      }
    }
    console.log(`Generated embeddings for ${knowledgeBaseEmbeddings.length} knowledge base entries.`);
  }
  return knowledgeBaseEmbeddings ?? [];
}
// Initialize on server start (or first call)
getKnowledgeBaseEmbeddings().catch(err => {
    console.error("Failed to initialize knowledge base embeddings:", err);
    // Decide how to handle this - maybe retry later or disable AI feature?
});
// --------------------------------------------

// --- Core Embedding Generation Function ---
async function generateEmbedding(text: string, pipe?: FeatureExtractionPipeline): Promise<number[] | null> {
  try {
    const p = pipe ?? await getEmbeddingPipeline();
    // Ensure text is not empty or just whitespace
    const cleanedText = text.trim();
    if (!cleanedText) {
        return null;
    }

    // Generate embedding
    const output: Tensor = await p(cleanedText, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}
// -----------------------------------------

// --- Cosine Similarity Calculation ---
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    // Should not happen with the same model, but good to check
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) {
    return 0; // Avoid division by zero
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
// ------------------------------------

// --- Main Function to Find Best Match ---
export async function findBestKnowledgeMatch(query: string): Promise<string | null> {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) {
      return null; // Could not generate embedding for query
    }

    const kbEmbeddings = await getKnowledgeBaseEmbeddings();
    if (!kbEmbeddings || kbEmbeddings.length === 0) {
        return null; // Knowledge base not ready or empty
    }

    let bestMatch: EmbeddingEntry | null = null;
    let highestSimilarity = -Infinity; // Cosine similarity is between -1 and 1
    const MIN_SIMILARITY_THRESHOLD = 0.2; // Adjust this threshold as needed (Lowered from 0.5)

    for (const entry of kbEmbeddings) {
      const similarity = cosineSimilarity(queryEmbedding, entry.embedding);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = entry;
      }
    }

    console.log(`Query: "${query}", Best Match: "${bestMatch?.text.substring(0, 50)}..." (Similarity: ${highestSimilarity.toFixed(4)})`);

    // Only return a match if it meets the minimum threshold
    if (bestMatch && highestSimilarity >= MIN_SIMILARITY_THRESHOLD) {
      return bestMatch.text;
    } else {
      return null; // No sufficiently similar match found
    }
}
// -------------------------------------- 