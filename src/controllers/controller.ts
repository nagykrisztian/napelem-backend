import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import mssql from '../sql.js';

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

  public authenticate = (req: Request, res: Response) => {
    mssql
      .query(
        `select u.username,u.[password],p.permissionName from Users u join Permissions p on u.perrmissionID=p.permissionID WHERE u.username = '${req.body.username}';`
      )
      // .query('select 1+1 as result')
      .then((result) => {
        if (result.rowsAffected[0] === 0) {
          res.status(401).send({
            msg: 'Email or password is incorrect!',
          });
          return;
        }

        if (result.recordset[0].password !== createHash('sha256').update(req.body.password).digest('hex')) {
          res.status(401).send({
            msg: 'Email or password is incorrect!',
          });
          return;
        }
        const payload = {
          username: req.body.username,
          permission: result.recordset[0].permissionName,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'asd', {
          algorithm: 'HS256',
          expiresIn: '30m',
        });

        res.status(200).json({ token, status: 200 });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          msg: err,
        });
      });
  };
}
