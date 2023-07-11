import { client, db } from '../../database/connection.js';

const collection = client.db(db).collection('foruns');

const getAllForuns = async () => {
  try {
    let resultados = [];
    resultados = await collection.find().toArray();
    return resultados;
  } catch (error) {
    console.log(error);
    return false;
  };
};

const getForumById = async (idForum) => {
  try {
    let forum = {};
    console.log({ id: +idForum });
    let filtro = {id_forum: +idForum};
    let opcoes = {projection: {_id: 0}};
    forum = await collection.findOne(filtro, opcoes);
    if (!forum) {
      throw new Error(`Fórum com ID:${idForum} não encontrado!`);
    }
    return forum;
  } catch (error) {
    console.log(error);
    return false;
  };
};

const insertForum = async (forum) => {
  try {
    const result = await collection.insertOne(forum);
    console.log(result.acknowledged && {
      mensagem: 'Fórum cadastrado com sucesso',
      forum: forum,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  };
};

const updateForum = async (newForum) => {
  try {
    const result = await collection.updateOne(
      {id_forum: newForum.id_forum},
      {$set: newForum},
    );
    console.log({
      result: result,
      updated: result.modifiedCount > 0,
      forum: newForum,
    });
    if (result.modifiedCount) {
      return true;
    } else {
      throw new Error('Erro ao atualizar fórum!');
    }
  } catch (error) {
    console.log(error);
    return false;
  };
};

const deleteForum = async (idForum) => {
  try {
    const result = await collection.deleteOne({ id_forum: idForum });
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

export {
  getAllForuns,
  getForumById,
  insertForum,
  updateForum,
  deleteForum,
};