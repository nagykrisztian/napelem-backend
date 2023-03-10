import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import mssql from '../sql.js';

export default class Controller {
  public testMethod = (req: Request, res: Response) => {
    mssql.query`SELECT 1+1 AS result');`
      .then((result) => {
        // console.log(result.recordset);
        res.send(result.recordset);
      })
      .catch((err) => console.log(err));
  };

  public authenticate = (req: Request, res: Response) => {
    mssql.query`SELECT u.username,u.[password],p.permissionName FROM Users u join Permissions p ON u.perrmissionID=p.permissionID WHERE u.username = ${req.body.username};`
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

        const token = `Bearer ${jwt.sign(payload, process.env.JWT_SECRET || 'asd', {
          algorithm: 'HS256',
          expiresIn: '30m',
        })}`;

        res.status(200).json({ token, permission: result.recordset[0].permissionName, status: 200 });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          msg: err,
        });
      });
  };

  public getAllParts = (req: Request, res: Response) => {
    if (!req.headers.authorization) return res.sendStatus(403);
    const payload: JwtPayload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET ?? '') as JwtPayload;
    if (payload.permission !== 'Raktarvezeto') return res.sendStatus(403);

    mssql.query`SELECT * FROM Parts;`
      .then((result) => {
        res.status(200).send({ result: result.recordset, status: 200 });
      })
      .catch((err) => console.log(err));
  };

  public addPart = (req: Request, res: Response) => {
    if (!req.headers.authorization) return res.sendStatus(403);
    const payload: JwtPayload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET ?? '') as JwtPayload;
    if (payload.permission !== 'Raktarvezeto') return res.sendStatus(403);

    mssql.query`INSERT INTO Parts([partName], price, partPerBox) VALUES(${req.body.partName},${req.body.price}, ${req.body.partPerBox});`
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          msg: err,
        });
      });
  };

  public modifyPartPrice = (req: Request, res: Response) => {
    if (!req.headers.authorization) return res.sendStatus(403);
    const payload: JwtPayload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET ?? '') as JwtPayload;
    if (payload.permission !== 'Raktarvezeto') return res.sendStatus(403);

    mssql.query`UPDATE Parts SET price = ${req.body.price} WHERE partID = ${req.params.partID};`
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          msg: err,
        });
      });
  };
}
