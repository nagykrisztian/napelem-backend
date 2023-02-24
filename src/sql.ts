import dotenv from 'dotenv';

class sqlConnection {

  public mssql = require('mssql');

  constructor() {
    dotenv.config();
    this.connectionSetup();
  }

  private connectionSetup() {
    var config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_URL,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || ""),
      options: {
        trustServerCertificate: true // change to true for local dev / self-signed certs
      }
    };

    // connect to your database
    this.mssql.connect(config, function (err: any) {
      if (err)
        console.log(err);
    });
  }
}
export default new sqlConnection().mssql;
