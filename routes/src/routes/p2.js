import { Router } from 'express';

const router = Router();

router.get('/r1', (req, resp) => {
  resp.send('/p2/r1')
});

router.get('/r2', (req, resp) => {
  resp.send('/p2/r2')
});

export default router;
