import { DataSource } from "typeorm";
import "dotenv/config";

export default new DataSource({
    "type": "postgres",
    "host": process.env.DB_HOST,
    "port": Number(process.env.DB_PORT),
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB,
    "entities": ["./dist/**/*.entity.js"],
    "migrations": ["./database/compiled/migrations/*.js"],
});