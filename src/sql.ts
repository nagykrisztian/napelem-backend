import dotenv from 'dotenv';
import mssql from 'mssql';

class sqlConnection {
  public mssql: any;
  constructor() {
    dotenv.config();
    // this.dbConnection();
    mssql.connect({
      server: process.env.DB_URL || "",
      user: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
      port: parseInt(process.env.DB_PORT || ""),
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
      }
    });
  }

}
export default new sqlConnection().mssql;
