import "dotenv/config";

import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "orm/generated/prisma/client";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);

const prisma = new PrismaClient({ adapter });

export { prisma };
