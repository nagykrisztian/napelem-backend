import { Request, Response } from "express";
import { MysqlError } from "mysql";
import mssql from "../sql";

export default class Controller {
  public testMethod = (req: Request, res: Response) => {

    mssql.query('select 1+1 as result', function (err: any, recordset: any) {

      if (err) console.log(err)

      // send records as a response
      res.send(recordset);

    });

  }
}
