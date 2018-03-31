import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

export default routes;
