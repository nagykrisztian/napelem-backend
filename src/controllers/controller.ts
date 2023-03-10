import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import mssql from '../sql.js';

export default class Controller {
  private authorize = (authHeader: string | undefined, res: Response) => {
    if (!authHeader) {
      res.sendStatus(403);
      return false;
    }
    try {
      return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET ?? '') as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).send({ msg: `Token expired at ${err.expiredAt.toLocaleString()}` });
        return false;
      }
      res.status(401).send(err);
      return false;
    }
  };

  public testMethod = (req: Request, res: Response) => {
    mssql.query`SELECT 1+1 AS result';`
      .then((result) => {
        // console.log(result.recordset);
        res.send(result.recordset);
      })
      .catch((err) => res.send(err as string));
  };

  public authenticate = (req: Request, res: Response) => {
    mssql.query`SELECT u.username,u.[password],p.permissionName FROM Users u join Permissions p ON u.perrmissionID=p.permissionID WHERE u.username = ${req.body.username};`
      .then((result) => {
        if (result.rowsAffected[0] === 0) return res.status(401).send({ msg: 'Email or password is incorrect!' });

        if (
          result.recordset[0].password !==
          createHash('sha256')
            .update(req.body.password as string)
            .digest('hex')
        )
          return res.status(401).send({ msg: 'Email or password is incorrect!' });

        const payload: JwtPayload = {
          username: req.body.username as string,
          permission: result.recordset[0].permissionName as string,
        };

        const token = `Bearer ${jwt.sign(payload, process.env.JWT_SECRET || 'asd', {
          algorithm: 'HS256',
          expiresIn: '30m',
        })}`;

        res.status(200).send({ token, permission: result.recordset[0].permissionName as string });
      })
      .catch((err) => res.status(400).send({ msg: err as string }));
  };

  public getAllParts = (req: Request, res: Response) => {
    const payload: JwtPayload | false = this.authorize(req.headers.authorization, res);
    if (payload === false) return;
    if (payload.permission !== 'Raktarvezeto') return res.sendStatus(403);

    mssql.query`SELECT * FROM Parts;`
      .then((result) => {
        res.status(200).send({ result: result.recordset });
      })
      .catch((err) => res.status(400).send({ msg: err as string }));
  };

  public addPart = (req: Request, res: Response) => {
    const payload: JwtPayload | false = this.authorize(req.headers.authorization, res);
    if (payload === false) return;
    if (payload.permission !== 'Raktarvezeto') return res.sendStatus(403);

    mssql.query`INSERT INTO Parts([partName], price, partPerBox) VALUES(${req.body.partName},${req.body.price}, ${req.body.partPerBox});`
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => res.status(400).send({ msg: err as string }));
  };

  public modifyPartPrice = (req: Request, res: Response) => {
    const payload: JwtPayload | false = this.authorize(req.headers.authorization, res);
    if (payload === false) return;
    if (payload.permission !== 'Raktarvezeto') return res.sendStatus(403);

    mssql.query`UPDATE Parts SET price = ${req.body.price} WHERE partID = ${req.params.partID};`
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => res.status(400).send({ msg: err as string }));
  };

  public incomingParts = (req: Request, res: Response) => {
    mssql
      .query(
        `INSERT INTO Storage (row, column, level, partID, currentPieces)
        VALUES(${req.params.row}, ${req.params.column}, ${req.params.level}, ${req.params.partID}, ${req.params.currentPieces})
        ON DUPLICATE KEY UPDATE 'currentPieces = currentPieces+${req.params.currentPieces}'`
      )
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          msg: err as string,
        });
      });
  };
}
