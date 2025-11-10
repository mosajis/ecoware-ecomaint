import sql from "mssql";

function parseMSSQLConnection(url: string) {
  const [, hostPart] = url.split("://");
  const [hostPort, ...params] = hostPart.split(";");
  const [server, port] = hostPort.split(":");

  const options: Record<string, string> = {};
  for (const p of params) {
    if (!p) continue;
    const [key, value] = p.split("=");
    options[key.toLowerCase()] = value;
  }

  return {
    user: options["user"],
    password: options["password"],
    server,
    port: parseInt(port || "1433", 10),
    database: options["database"],
    options: {
      encrypt: options["encrypt"] === "true",
      trustServerCertificate: options["trustservercertificate"] === "true",
    },
  };
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
