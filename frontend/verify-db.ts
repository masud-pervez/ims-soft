import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    console.log("Connecting to database...");
    const userCount = await prisma.user.count();
    console.log(`Successfully connected! User count: ${userCount}`);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
