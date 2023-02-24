import express from 'express';
import Routes from './routes/routes';
import mysql from 'mysql';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';


class App {
  public sqlConnection: any;
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.expressConfig();
    this.routePrv.routes(this.app);
    dotenv.config();
    this.dbConnection();
  }

  private expressConfig(): void {
    this.app.use(bodyParser.json());

    // // eslint-disable-next-line consistent-return
    // this.app.use((req, res, next) => {
    //   res.header('Access-Control-Allow-Origin', '*');

    //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //   res.header('Set-Cookie', 'HttpOnly;Secure;SameSite=None');
    //   if (req.method === 'OPTIONS') {
    //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //     return res.status(200).json({});
    //   }
    //   next();
    // });
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private dbConnection(): void {

    this.sqlConnection = mysql.createConnection({
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "")
    });
  }
}
export default new App().app;
