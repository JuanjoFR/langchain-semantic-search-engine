export interface Metadata {
  // Define the specific properties of the metadata object here
  [key: string]: string | number | boolean; // Example: adjust as needed
}

export interface DocumentPlain {
  pageContent: string;
  metadata: Metadata;
  id: string;
}
