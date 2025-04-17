import express, { Request, Response, NextFunction } from 'express';
import { getRequest } from '../services/pbsService';

const router = express.Router();

router.get('/pbs-api/*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pbsPath = req.params[0];

    const response = await getRequest(`/${pbsPath}`, {
     'platform-slug': 'partnerplayer',
      ...req.query,
    });

    res.json(response);
  } catch (err) {
    next(err);
    console.log(err);
  }
});

export default router;