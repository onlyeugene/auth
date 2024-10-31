import { PrismaClient } from "@prisma/client";

// Create a type-safe global reference for PrismaClient
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Initialize the Prisma Client
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma; // Store the Prisma Client in the global variable
}

// Log a message when the database is connected
(async () => {
    try {
        await prisma.$connect(); // Ensure the connection is established
        console.log("Database connected successfully."); // Log the connection message
    } catch (error) {
        console.error("Database connection failed:", error); // Log any errors
    }
})();
