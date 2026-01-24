import "dotenv/config";

import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "orm/generated/prisma/client";

const sqlConfig = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  server: process.env.HOST || "",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const adapter = new PrismaMssql(sqlConfig);
const prisma = new PrismaClient({ adapter });

export { prisma };
