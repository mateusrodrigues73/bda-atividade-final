import { MongoClient } from 'mongodb';

const server = '127.0.0.1';
const port = '27017';
const db = 'loja';
const uri = `mongodb://${server}:${port}`;
const client = new MongoClient(uri);

await client.connect();

if (client.db('admin').command({ 'ping': 1 })) {
  console.log('Conectado ao Banco MongoDB!');
  console.log('');
}
else {
  throw Error('Erro ao conectar ao banco!!');
}

export {client, db};
