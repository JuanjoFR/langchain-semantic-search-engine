"use server"; // Ensure this file is treated as a server module

export async function triggerServerAction() {
  return { message: "Server action triggered successfully!" };
}
