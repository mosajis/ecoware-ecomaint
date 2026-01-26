import sql from "mssql";

function parseMSSQLConnection(url: string) {
  if (!url.includes("://")) {
    throw new Error("❌ Invalid DATABASE_URL format");
  }

  const [, hostPartRaw] = url.split("://");
  if (!hostPartRaw) {
    throw new Error(
      "❌ Invalid MSSQL connection string (missing host section)",
    );
  }

  const [hostPortRaw, ...params] = hostPartRaw.split(";");

  if (!hostPortRaw) {
    throw new Error("❌ Invalid MSSQL connection string (missing host:port)");
  }

  const [server, portString] = hostPortRaw.split(":");

  if (!server) {
    throw new Error("❌ Invalid MSSQL connection string (missing server)");
  }

  const options: Record<string, string> = {};

  for (const p of params) {
    if (!p) continue;
    const eqIndex = p.indexOf("=");
    if (eqIndex === -1) continue;

    const key = p.slice(0, eqIndex).trim().toLowerCase();
    const value = p.slice(eqIndex + 1).trim();

    if (key) options[key] = value;
  }

  const user = options["user"];
  const password = options["password"];
  const database = options["database"];

  if (!user || !password || !database) {
    throw new Error(
      "❌ DATABASE_URL missing required fields (user/password/database)",
    );
  }

  const port = portString ? parseInt(portString, 10) : 1433;

  if (Number.isNaN(port)) {
    throw new Error("❌ Invalid MSSQL port in DATABASE_URL");
  }

  const config: sql.config = {
    user,
    password,
    server,
    port,
    database,
    options: {
      encrypt: options["encrypt"] === "true",
      trustServerCertificate: options["trustservercertificate"] === "true",
    },
  };

  return config;
}

const config = parseMSSQLConnection(process.env.DATABASE_URL!);

let pool: sql.ConnectionPool | null = null;

export async function getMSSQL() {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ MSSQL connected");
  }
  return pool;
}
