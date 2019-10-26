import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import routes from './routes';

const port = parseInt(process.env.PORT as string, 10) || 3000;

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

const handle = app.getRequestHandler();

const server = express();

// middlewares
// parse application/json
server.use(bodyParser.json());

// api routes
server.use('/api', routes);

// nextjs requests
server.all('*', (req, res) => {
  return handle(req, res);
});

// start server
app.prepare().then(() => {
  server.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});
