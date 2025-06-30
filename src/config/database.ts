import { DataSource } from "typeorm";
import { Quote } from "../entities/Quote";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { parse } from "pg-connection-string";

dotenv.config();

// Parse DATABASE_URL from .env
const dbUrl = process.env.DATABASE_URL!;
const parsed = parse(dbUrl);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: parsed.host ?? "",
  port: parseInt(parsed.port || "5432"),
  username: parsed.user,
  password: parsed.password,
  database: parsed.database || "",
  synchronize: true, // Set to false in production
  logging: true,
  entities: [Quote, User],
  subscribers: [],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
});
