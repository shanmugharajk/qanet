import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import nextRoutes from './nextRoutes';

const port = parseInt(process.env.PORT as string, 10) || 3000;

const server = express();

// middlewares
// parse application/json
server.use(bodyParser.json());

// api routes
server.use('/api', routes);

// nextjs requests
server.all('*', nextRoutes.router)

// start server
nextRoutes.app.prepare().then(() => {
  server.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});
