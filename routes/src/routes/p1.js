import { Router } from 'express';

const router = Router();

router.get('/r1', (req, resp) => {
  resp.send('/p1/r1')
});

router.get('/r2', (req, resp) => {
  resp.send('/p1/r2')
});

export default router;
