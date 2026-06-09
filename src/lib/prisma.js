import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const { PrismaClient } = require("@prisma/client")

const adapter = new PrismaMariaDb({
  host: "mysql-2933e4f3-campeonatodb.g.aivencloud.com",
  port: 19902,
  user: "avnadmin",
  password: process.env.DB_PASSWORD,
  database: "defaultdb",
  ssl: { rejectUnauthorized: false },
  connectTimeout: 30000,
})

const prisma = new PrismaClient({ adapter })

export default prisma