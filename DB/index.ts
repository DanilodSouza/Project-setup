import { drizzle } from "drizzle-orm/neon-http";
const DB = drizzle(process.env.DATABASE_URL!);

export  {DB}