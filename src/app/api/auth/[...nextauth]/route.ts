import { handlers } from "@/auth"; // Referring to the auth.ts we just created
import type { NextRequest } from "next/server";

const getCallback = async (req: NextRequest) => {
  // Your custom logic for GET request

  console.log("GET request received");
  return handlers.GET(req);
};

const postCallback = async (req: NextRequest) => {
  // Your custom logic for POST request
  console.log("POST request received", req);
  return handlers.POST(req);
};

export const GET = getCallback;
export const POST = postCallback;
