"use server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

export async function triggerServerAction() {
  const loader = new PDFLoader(
    path.resolve(process.cwd(), "public", "nke-10k-2023.pdf")
  );

  const docs = await loader.load();
  console.log(docs[0].metadata);

  return { message: "Server action triggered successfully!" };
}
