import express from 'express';
import heartController from './controllers/heartController';
import userController from './controllers/userController';

const app = express();
app.use(express.json());

app.use('/users', userController);
app.use('/heart', heartController);

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello express\n');
});

export default app;
