import * as model from '../models/usuario.js';

const index = async (req, res) => {
  let listUsuarios;
  console.log(req.query);
  listUsuarios = await model.getAllUsuarios();
  if (!listUsuarios) {
    return res.status(404).send({'message': 'Sem resultados'});
  };
  res.send(listUsuarios);
};

const show = async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  const usuario = await model.getUsuarioById(req.params.id);
  console.log(usuario);
  if(!usuario) {
    res.status(404);
    res.send('Nenhum usuário encontrado!');
  };
  res.send(usuario);
};

const store = async (req, res) => {
  try {
    const formData = req.body;
    console.log('controller:', formData, req.body);
    console.log('controller:', formData, {...req.body});
    const usuario = {
      id_usuario: +formData.id_usuario,
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
    };
    if (await model.insertUsuario(usuario)) {
      res.send({
        mensagem: 'Usuário cadastrado com sucesso',
        usuario: usuario,
      });
    } else {
      throw new Error('Erro ao cadastrar usuário!');
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
      throw new Error('O ID do usuário é obrigatório!');
    };
    const usuario = await model.getUsuarioById(req.params.id);
    if (!usuario) {
      throw new Error('Usuário não encontrado!');
    }
    const newUsuario = {...formData};
    console.log({newUsuario});
    newUsuario.id_usuario = +req.params.id;
    if (!(await model.updateUsuario(newUsuario))) {
      throw new Error('Erro ao atualizar usuário!');
    }
    res.send({
      mensagem: 'Usuário atualizado com sucesso',
      usuario: newUsuario,
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
    const usuario = await model.getUsuarioById(req.params.id);
    if (!usuario) {
      throw new Error('Usuário não encontrado!');
    }
    const id = parseInt(req.params.id)
    if (!(await model.deleteUsuario(id))) {
      throw new Error('Erro ao remover usuário!');
    }
    res.send({
      success: `Usuário de ID:${id} removido com sucesso!`,
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