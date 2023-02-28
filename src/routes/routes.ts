import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../controllers/controller.js';

class Routes {
  public controller: Controller = new Controller();

  public routes(app: Router): void {
    app.route('/').get((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request type ${req.method} from ${req.originalUrl} time: ${new Date().toLocaleString()}`);
      next();
    }, this.controller.testMethod);

    app.route('/login').post((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request type ${req.method} from ${req.originalUrl} time: ${new Date().toLocaleString()}`);
      next();
    }, this.controller.authenticate);

    app.route('/getAllParts').get((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request type ${req.method} from ${req.originalUrl} time: ${new Date().toLocaleString()}`);
      next();
    }, this.controller.getAllParts);

    app.route('/addPart').post((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request type ${req.method} from ${req.originalUrl} time: ${new Date().toLocaleString()}`);
      next();
    }, this.controller.addPart);
  }
}

export default Routes;
