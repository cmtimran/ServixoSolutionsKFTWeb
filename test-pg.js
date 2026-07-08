const { Pool } = require('pg');

async function test() {
  let url = "postgres://postgres.tduxwwbrximvlvakrsqq:eSKjTPzCFfuXd18U@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";
  
  // Strip sslmode=require from the URL so pg-connection-string doesn't override our ssl object
  url = url.replace('?sslmode=require', '?').replace('&sslmode=require', '');
  
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log("Connected successfully!");
    client.release();
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    pool.end();
  }
}

test();
