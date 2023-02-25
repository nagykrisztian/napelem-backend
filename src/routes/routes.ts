import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../controllers/controller';

class Routes {
  public controller: Controller = new Controller();

  public routes(app: Router): void {
    app.route('/').get((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request type ${req.method} from ${req.originalUrl} time: ${new Date().toLocaleDateString()}`);
      next();
    }, this.controller.testMethod);
  }
}

export default Routes;
