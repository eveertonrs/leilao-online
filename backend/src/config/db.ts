// src/config/db.ts
import sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_DATABASE!,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conectado ao SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao SQL Server:', err);
    throw err;
  });

export default pool;
