import { Request, Response } from "express";
import { MysqlError } from "mysql";
import mssql from "../sql"

export default class Controller {
  public testMethod = (req: Request, res: Response) => {
    res.send("test method");
  }
}
