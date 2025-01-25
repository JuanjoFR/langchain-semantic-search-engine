"use server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import path from "path";
import { DocumentPlain, Metadata } from "./types";

export async function retrieve(inputs: string[]): Promise<DocumentPlain[][]> {
  // Load the PDF document
  const loader = new PDFLoader(
    path.resolve(process.cwd(), "public", "nke-10k-2023.pdf")
  );
  const docs = await loader.load();

  // Split the document into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const allSplits = await textSplitter.splitDocuments(docs);

  // Generate embeddings
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  // const vector1 = await embeddings.embedQuery(allSplits[0].pageContent);
  // const vector2 = await embeddings.embedQuery(allSplits[1].pageContent);

  // Create a vector store and add the documents
  const vectorStore = new MemoryVectorStore(embeddings);
  await vectorStore.addDocuments(allSplits);

  // const results1 = await vectorStore.similaritySearch(
  //   "When was Nike incorporated?"
  // );

  // Retrieve the most relevant document
  const retriever = vectorStore.asRetriever({
    searchType: "mmr",
    searchKwargs: {
      fetchK: 1,
    },
  });

  const result = await retriever.batch(inputs);

  // Convert Document instances to plain objects
  const plainResult = result.map((docs) =>
    docs.map((doc) => ({
      pageContent: doc.pageContent,
      metadata: doc.metadata as Metadata,
      id: doc.id || "",
    }))
  );

  return plainResult;
}
