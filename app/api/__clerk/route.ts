import { clerkClient } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const proxyUrl = new URL(request.url);
  proxyUrl.pathname = proxyUrl.pathname.replace("/api/__clerk", "");
  
  // Create a new request based on the path without the /api/__clerk prefix
  const newReq = new Request(proxyUrl, request);
  
  const client = await clerkClient();
  const response = await client.proxy.handleProxyRequest(newReq);
  
  return response;
}

export async function POST(request: NextRequest) {
  const proxyUrl = new URL(request.url);
  proxyUrl.pathname = proxyUrl.pathname.replace("/api/__clerk", "");
  
  // Create a new request based on the path without the /api/__clerk prefix
  const newReq = new Request(proxyUrl, request);
  
  const client = await clerkClient();
  const response = await client.proxy.handleProxyRequest(newReq);
  
  return response;
}
