import { DataSource } from "typeorm";
import { Quote } from "../entities/Quote";
import dotenv from "dotenv";
import { User } from "../entities/User";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Quote, User],
    subscribers: [],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
}); 