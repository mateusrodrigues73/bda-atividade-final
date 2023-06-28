import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import produtoRoute from './routes/produto.js';

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200,
};

app.get('/', (req, res) => {
  res.send({express: `Servidor Express Iniciado na porta ${port}!`});
});

console.log('Servidor inicializado!');

app.listen(port,() => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/produtos', produtoRoute);
