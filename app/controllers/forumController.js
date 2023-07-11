import * as model from '../models/forum.js';

const index = async (req, res) => {
  let listForuns;
  console.log(req.query);
  listForuns = await model.getAllForuns();
  if (!listForuns) {
    return res.status(404).send({'message': 'Sem resultados'});
  };
  res.send(listForuns);
};

const show = async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  const forum = await model.getForumById(req.params.id);
  console.log(forum);
  if(!forum) {
    res.status(404);
    res.send('Nenhum fórum encontrado!');
  };
  res.send(forum);
};

const store = async (req, res) => {
  try {
    const formData = req.body;
    console.log('controller:', formData, req.body);
    console.log('controller:', formData, {...req.body});
    const forum = {
      id_forum: +formData.id_forum,
      titulo: formData.titulo,
      tema: formData.tema,
    };
    if (await model.insertForum(forum)) {
      res.send({
        mensagem: 'Fórum cadastrado com sucesso',
        forum: forum,
      });
    } else {
      throw new Error('Erro ao cadastrar fórum!');
    }
  } catch (error) {
    const mensagem = {erro: error};
    console.log(mensagem);
    res.status(500);
    res.send(mensagem);
  };
};

const update = async (req, res) => {
  try {
    const formData = req.body;
    console.log({query:req.params, body:formData});
    if (!req.params.id || req.params.id == 'undefined') {
      throw new Error('O ID do fórum é obrigatório!');
    };
    const forum = await model.getForumById(req.params.id);
    if (!forum) {
      throw new Error('Fórum não encontrado!');
    }
    const newForum = {...formData};
    console.log({newForum});
    newForum.id_forum = +req.params.id;
    if (!(await model.updateForum(newForum))) {
      throw new Error('Erro ao atualizar fórum!');
    }
    res.send({
      mensagem: 'Fórum atualizado com sucesso',
      forum: newForum,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({Error: error.message});
  };
};

const remove = async (req, res) => {
  let status = 500;
  try {
    console.log({query: req.params});
    if (!req.params.id || !req.params.id === 'undefined') {
      res.status = 400;
      throw new Error('Erro, falta o parâmetro ID na url!');
    }
    const forum = await model.getForumById(req.params.id);
    if (!forum) {
      throw new Error('Fórum não encontrado!');
    }
    const id = parseInt(req.params.id)
    if (!(await model.deleteForum(id))) {
      throw new Error('Erro ao remover fórum!');
    }
    res.send({
      success: `Fórum de ID:${id} removido com sucesso!`,
    });
  } catch (error) {
    console.log(error);
    res.status(status);
    res.send({Error: error.message});
  };
};

export {
  index,
  show,
  store,
  update,
  remove,
};