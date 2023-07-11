import { client, db } from '../../database/connection.js';

const collection = client.db(db).collection('usuarios');

const getAllUsuarios = async () => {
  try {
    let resultados = [];
    resultados = await collection.find().toArray();
    return resultados;
  } catch (error) {
    console.log(error);
    return false;
  };
};

const getUsuarioById = async (idUsuario) => {
  try {
    let usuario = {};
    console.log({ id: +idUsuario });
    let filtro = {id_usuario: +idUsuario};
    let opcoes = {projection: {_id: 0}};
    usuario = await collection.findOne(filtro, opcoes);
    if (!usuario) {
      throw new Error(`Usuário com ID:${idUsuario} não encontrado!`);
    }
    return usuario;
  } catch (error) {
    console.log(error);
    return false;
  };
};

const insertUsuario = async (usuario) => {
  try {
    const result = await collection.insertOne(usuario);
    console.log(result.acknowledged && {
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: usuario,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  };
};

const updateUsuario = async (newUsuario) => {
  try {
    const result = await collection.updateOne(
      {id_usuario: newUsuario.id_usuario},
      {$set: newUsuario},
    );
    console.log({
      result: result,
      updated: result.modifiedCount > 0,
      usuario: newUsuario,
    });
    if (result.modifiedCount) {
      return true;
    } else {
      throw new Error('Erro ao atualizar usuário!');
    }
  } catch (error) {
    console.log(error);
    return false;
  };
};

const deleteUsuario = async (idUsuario) => {
  try {
    const result = await collection.deleteOne({ id_usuario: idUsuario });
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
  getAllUsuarios,
  getUsuarioById,
  insertUsuario,
  updateUsuario,
  deleteUsuario,
};