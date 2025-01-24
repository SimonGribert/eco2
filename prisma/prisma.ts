import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
const adapter = new PrismaNeon(pool);
const prismaClient = new PrismaClient({ adapter });

export const prisma = prismaClient;
