import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMockUser() {
  return {
    id: "mock-user-id",
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateMockToken() {
  return `mock-token-${Date.now()}`;
}

export function hashPassword(password: string): string {
  return `hashed-${password}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hash === `hashed-${password}`;
}
