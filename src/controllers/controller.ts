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
      // .query(`SELECT * FROM Felhasznalo WHERE felhasznalonev = ${req.body.username};`)
      .query('select 1+1 as result')
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
          name: req.body.username,
          role: result.recordset[0].role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'asd', {
          algorithm: 'HS256',
          expiresIn: '30m',
        });

        res.status(201).json({ token, status: 201, hash: createHash('sha256').update('porcica1').digest('hex') });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          msg: err,
        });
      });
  };
}
