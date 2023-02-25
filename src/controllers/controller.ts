import { Request, Response } from 'express';
import mssql from '../sql';

export default class Controller {
  public testMethod = (req: Request, res: Response) => {
    mssql
      .query('select 1+1 as result')
      .then((result) => {
        // console.log(result.recordset);
        res.send(result.recordset);
      })
      .catch((err) => console.log(err));
  };
}
