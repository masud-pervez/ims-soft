import mysql from "mysql2/promise";
import { config } from "./env.js";

const pool = mysql.createPool(config.db);

export default pool;
