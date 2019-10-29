import next from 'next';
import express from 'express';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

const handle = app.getRequestHandler();

const router = express.Router();

router.get('/signin/:redirectUrl', (req, res) => {
  return app.render(req, res, '/signin', {
    redirectUrl: req.params.redirectUrl
  });
});

router.get('/signup/:redirectUrl', (req, res) => {
  return app.render(req, res, '/signup', {
    redirectUrl: req.params.redirectUrl
  });
});

router.all('*', (req, res) => {
  return handle(req, res);
});

export default { router, app };
