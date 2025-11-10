import sql from "mssql";

const config: sql.config = {
  user: "sa",
  password: "Naftaz110110",
  server: "194.147.142.13",
  database: "ECO",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const pool = new sql.ConnectionPool(config);

export async function connectPool() {
  if (!pool.connected) {
    await pool.connect();
  }
  return pool;
}
