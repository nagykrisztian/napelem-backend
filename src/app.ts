import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Routes from './routes/routes.js';

class App {
  public app: express.Application;

  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.expressConfig();
    this.routePrv.routes(this.app);
    dotenv.config();
  }

  private expressConfig(): void {
    this.app.use(bodyParser.json());

    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, X-Requested-With,  Accept, Authorization,Content-Type');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=None');
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        return res.status(200).json({});
      }
      next();
    });
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}
export default new App().app;
