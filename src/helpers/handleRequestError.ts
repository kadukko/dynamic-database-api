import { Request, Response, NextFunction } from 'express';

export default (callback: (req: Request, res: Response, next: NextFunction) => Promise<any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await callback(req, res, next);
  } catch (err) {
    next(err);
  }
};
