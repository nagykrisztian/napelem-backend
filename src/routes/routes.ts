import { NextFunction, Request, Response } from "express";
import Controller from "../controllers/controller";


class Routes {
  public controller: Controller = new Controller();

  public routes(app: any): void {
    app.route('/').get((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request type ${req.method} from ${req.originalUrl} time: ${new Date().toLocaleDateString()}`);
      next();
    }, this.controller.testMethod)
  }
}

export default Routes;
