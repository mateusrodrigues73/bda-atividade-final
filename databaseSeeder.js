import { readFile } from 'fs/promises';
import { client } from './database/connection.js';

const produtosJson = './tests/databaseCollections/loja.produtos.json';
const usuariosJson = './tests/databaseCollections/loja.usuarios.json';
const forunsJson = './tests/databaseCollections/loja.foruns.json';

const produtoCollection = client.db('loja').collection('produtos');
const usuariollection = client.db('loja').collection('usuarios');
const forumCollection = client.db('loja').collection('foruns');

try {
  let result;

  const jsonFileProdutos = await readFile(produtosJson);
	const produtos = JSON.parse(jsonFileProdutos);
  result = await produtoCollection.insertMany(produtos);
  result?.acknowledged && console.log('Produtos inseridos com sucesso');

  const jsonFileUsuarios = await readFile(usuariosJson);
	const usuarios = JSON.parse(jsonFileUsuarios);
  result = await usuariollection.insertMany(usuarios);
  result?.acknowledged && console.log('Usuários inseridos com sucesso');

  const jsonFileForuns = await readFile(forunsJson);
	const foruns = JSON.parse(jsonFileForuns);
  result = await forumCollection.insertMany(foruns);
  result?.acknowledged && console.log('Fóruns inseridos com sucesso');
} catch (error) {
	console.log('Erro ao inserir coleções');
	console.log(error);
}
finally {
	process.exit(0);
}




