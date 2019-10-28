import next from 'next';
import express from 'express';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

const handle = app.getRequestHandler();

const router = express.Router();

router.all("*", (req, res) => {
    return handle(req, res);
});

export default { router, app };