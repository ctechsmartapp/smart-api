// routes/config.js
const config = {
  user: "root",
  password: "root",
  server: "localhost",
  dialect: "mysql",
  database: "smart-api-db",
  port: 3306, // MySQL default
  connectionTimeout: 3000,
  parseJSON: true,
  options: {
    trustedconnection: true,
    encrypt: true
  },
  pool: {
    min: 0,
    idleTimeoutMillis: 3000
  }
};

export default config;