import { client, db } from '../../database/connection.js';

const collection = client.db(db).collection('produtos');

/**
 * Retorna produtos ordenados de acordo com o campo definido em orderBy
 * e ordenados na ordem definida por reverse, se verdadeiro ordem reversa (ASC)
 * Rotas da API:
 * GET /produtos
 * GET /produtos?order=${campo}&reverse=${valor}
 * 
 * @param {*} orderBy campo a ser utilizado na ordenacao
 * @param {*} reverse booleano para a determinar a ordem ascendente (true) ou descendente (false)
 * @returns Array de objetos Produto
 */
const getAllProdutos = async (orderBy = 'id_prod', reverse = false) => {
  try {
    let resultados = [];
    let opcoes = {
        sort: {[orderBy]: !reverse ? 1 : -1},
        projection: {_id: 0},
    }
    console.log({ orderBy, opcoes });
    resultados = await collection.find({}, opcoes).toArray();
    return resultados;
  } catch (error) {
    console.log(error);
    return false;
  };
};

/**
 * Busca produto definido por id_prod igual ao campo id_prod
 * Rotas da API:
 *  GET /produtos/${id}
 * @param {*} id_prod ID do produto a ser retornado
 * @returns Retorna um objeto de Produto
 */
const getProdutoById = async (idProd) => {
  try {
    let produto = {};
    console.log({ id: +idProd });
    let filtro = {id_prod: +idProd};
    let opcoes = {projection: {_id: 0}};
    produto = await collection.findOne(filtro, opcoes);
    if (!produto) {
      throw new Error(`Produto com ID:${idProd} não encontrado!`);
    }
    return produto;
  } catch (error) {
    console.log(error);
    return false;
  };
};

//Registra um novo produto no banco, 
//retorna verdadeiro se inserido com sucesso
//API - Testar com cliente HTTP
/**
 * Rota da API:
 *  POST /produtos
 * 
 * @param {*} produto Objeto Produto com os campos a serem inseridos
 * @returns 
 */
const insertProduto = async (produto) => {
  try {
    const result = await collection.insertOne(produto);
    console.log(result.acknowledged && {
      mensagem: 'Produto inserido com sucesso',
      produto: produto,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  };
};

//Atualiza um produto no banco
//retorna verdadeiro se atualizado com sucesso
//API - Testar com cliente HTTP
/**
 * Rota da API:
 *  PUT /produtos/${id}
 * 
 * @param {*} newProduto Objeto com os campos a serem atualizados
 * @returns booleano de confirmação
 */
const updateProduto = async (newProduto) => {
  try {
    const result = await collection.updateOne(
      {id_prod: newProduto.id_prod},
      {$set: newProduto},
    );
    console.log({
      result: result,
      updated: result.modifiedCount > 0,
      produto: newProduto,
    });
    if (result.modifiedCount) {
      return true;
    } else {
      throw new Error('Erro ao atualizar produto!');
    }
  } catch (error) {
    console.log(error);
    return false;
  };
};

//Remove um produto do banco
//API - Testar com cliente HTTP
/**
 * Rota da API:
 *  DELETE /produtos/${id}
 * 
 * @param {*} idProd ID a ser excluído
 * @returns Booleano de confirmação
 */
const deleteProduto = async (idProd) => {
  try {
    const result = await collection.deleteOne({ id_prod: idProd });
    console.log({
      result: result,
      deleted: result.deletedCount > 0,
    })
    return result.deletedCount === 1;
  } catch (error) {
    console.log(error);
    return false;
  };
};

//API - Testar com cliente HTTP
/**
 * Rota da API: 
 *  DELETE /produtos/many
 * 
 * @param {*} ids Array de ids a serem excluídos
 * @returns Booleano para confirmar a exclusão
 */
const deleteManyProdutos = async (ids) => {
  try {
    const result = await collection.deleteMany({id_prod: {$in: ids}});
    console.log({
      result: result,
      deleted: result.deletedCount == ids.length,
    });
    if (result.deletedCount != ids.length){
      throw new Error('Erro, um ou mais produtos não foram deletados!');
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  };
};

/** Filtra Produtos por termo de busca para o campo nome ou descricao 
 * Rotas da API:
 * GET /produtos?field=${campo}&search=${termo}
 * campo => nome || descricao
 * 
 * @param {*} field campo de busca (nome ou descricao)
 * @param {*} term termo de busca (palavra a ser encontrada)
 * @returns Array de objetos Produto
 */
const getFilteredProdutos = async (field = 'nome', term = '') => {
  try {
    let resultados = [];
    console.log({field, term});
    await changeIndexes(field);
    let filtro = {
      $text: {$search: term}
    };
    let opcoes = {
      projection: {_id: 0}
    };
    console.log(opcoes);
    resultados = await collection.find(filtro, opcoes).toArray();
    return resultados;
  } catch (error) {
    console.log(error);
    return false;
  };
};

/**
 * Rota da API:
 * GET /produtos/filter_price/?greater=${min}&less=${max}
 * Parametros:
 * @param {*} greater valor inicial do intervalor
 * @param {*} less valor final do intervalo
 * @param {*} sort ordenar por maior ou menor preco (1,-1)
 * @returns Array de objetos Produto
 */
const getProdutosPriceRange = async (min = 0, max = 0, sort = 1) => {
  try {
    let resultados = [];
    console.log({ min, max });
    let filtro = {
      $and: [
        {preco: { $gte: min }},
        {preco: { $lte: max }},
      ]
    };
    let opcoes = {
      sort: {preco: parseInt(sort)},
      projection: {_id: 0},
    };
    console.log(opcoes);
    resultados = await collection.find(filtro, opcoes).toArray();
    return resultados;
  } catch (error) {
    console.log(error)
    return false;
  };
};

const changeIndexes = async (field) => {
  const indexes = await collection.indexes();
  const textIndexes = indexes.filter(index => index.key?._fts === 'text');
  const indexName = textIndexes[0]?.name;
  if (!indexName || indexName !== field + '_text') {
    if (indexName) {
      await collection.dropIndex(indexName);
    };
    await collection.createIndex({[field]: 'text'});
  };
};

export {
  getAllProdutos,
  getProdutoById,
  insertProduto,
  updateProduto,
  deleteProduto,
  deleteManyProdutos,
  getFilteredProdutos,
  getProdutosPriceRange,
};
