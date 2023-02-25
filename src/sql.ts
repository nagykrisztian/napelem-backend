import dotenv from 'dotenv';
import mssql from 'mssql';

class SqlConnection {
  mssql = mssql;

  constructor() {
    dotenv.config();
    this.connectionSetup();
  }

  private connectionSetup() {
    const config: mssql.config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_URL || '',
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '', 10),
      options: {
        trustServerCertificate: true, // change to true for local dev / self-signed certs
      },
    };

    this.mssql
      .connect(config)
      .then(() => console.log('Succesful connection'))
      .catch((err) => console.log(err));
  }
}

export default new SqlConnection().mssql;
