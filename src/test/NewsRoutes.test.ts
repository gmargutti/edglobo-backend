import axios from 'axios';
import mongoose from 'mongoose';
import app from '../app';
import News from '../@types/News';

const TEST_URL = 'http://localhost';
const TEST_PORT = '9999';
const BASE_URL = `${TEST_URL}:${TEST_PORT}`;
const headers = {
  Authorization: '',
};

const server = app.server.listen(TEST_PORT);

beforeAll(async () => {
  const response = await axios({
    url: `${BASE_URL}/auth/new`,
    method: 'GET',
  });
  headers.Authorization = `Bearer ${response.data.token}`;
});

test('Deve dicionar uma Notícia ao banco de dados utilizando o NewsRepository', async () => {
  const news: News = {
    titulo: 'Nova Notícia',
    conteudo: 'Nova Notícia Inserida com Sucesso',
    dataPublicacao: new Date(),
  };
  const response = await axios.post(`${BASE_URL}/news`, news, { headers });
  expect(response.status).toBe(200);
});

test('Deve falhar ao adicionar uma Notícia faltando alguma das propriedades utilizando o NewsRepository', async () => {
  const news = {
    titulo: 'Notícia com erro',
    conteudo: 'Notícia deve gerar erro',
    dataPublicacao: undefined,
  };
  try {
    const response = await axios.post(`${BASE_URL}/news`, news, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    const { message } = err.response.data;
    expect(message).toBe('Não foi possível inserir a Notícia no banco de dados');
  }
});

test('Deve atualizar as propriedades da Notícia no banco de dados utilizando o NewsRepository', async () => {
  const news: News = {
    titulo: 'Atualização Notícia',
    conteudo: 'Notícia será atualizada',
    dataPublicacao: new Date(),
  };
  const responseCreate = await axios.post(`${BASE_URL}/news`, news, { headers });
  const created = responseCreate.data;

  const update = {
    ...news,
    titulo: 'Notícia Atualizada',
    conteudo: 'Notícia foi atualizada com sucesso',
  };

  const responseUpdate = await axios.put(`${BASE_URL}/news/${created._id}`, update, { headers });
  expect(responseUpdate.status).toBe(200);
});

test('Deve falhar ao tentar atualizar uma notícia por conta de o ID informado estar inválido', async () => {
  const news: News = {
    titulo: 'Notícia ID Inválido',
    conteudo: 'ID da notícia foi informado incorretamente',
    dataPublicacao: new Date(),
  };

  const responseCreate = await axios.post(`${BASE_URL}/news`, news, { headers });
  const created = responseCreate.data;

  try {
    const responseUpdate = await axios.put(`${BASE_URL}/news/1`, news, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('O ID informado é inválido!');
  }
});

test('Deve falhar ao tentar atualizar uma notícia por de um dos campos estarem vazios', async () => {
  const news: News = {
    titulo: 'Notícia ID Inválido',
    conteudo: 'ID da notícia foi informado incorretamente',
    dataPublicacao: new Date(),
  };

  const responseCreate = await axios.post(`${BASE_URL}/news`, news, { headers });
  const created = responseCreate.data;

  const update: News = {
    ...news,
    titulo: '',
  };

  try {
    const responseUpdate = await axios.put(`${BASE_URL}/news/${created._id}`, update, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('Não foi possível inserir a Notícia no banco de dados');
  }
});

test('Deve falhar ao tentar atualizar uma notícia por conta de o ID informado não existir no banco de dados', async () => {
  const news: News = {
    titulo: 'Notícia ID Válido',
    conteudo: 'ID da notícia foi informado corretamente',
    dataPublicacao: new Date(),
  };

  const randomId = mongoose.Types.ObjectId().toHexString();

  try {
    const responseUpdate = await axios.put(`${BASE_URL}/news/${randomId}`, news, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('Não foi possível encontrar uma notícia com o ID informado');
  }
});

test('Deve remover uma notícia pré-existente utilizando o NewsRepository', async () => {
  const news: News = {
    titulo: 'Notícia será deletada',
    conteudo: 'Notícia deverá ser deletada para funcionamento correto',
    dataPublicacao: new Date(),
  };

  const responseCreate = await axios.post(`${BASE_URL}/news`, news, { headers });
  const created = responseCreate.data;

  const response = await axios.delete(`${BASE_URL}/news/${created._id}`, { headers });
  expect(response.status).toBe(200);
});

test('Deve falhar ao tentar remover uma notícia por conta de o ID informado não ser encontrado', async () => {
  const randomId = mongoose.Types.ObjectId().toHexString();
  try {
    const response = await axios.delete(`${BASE_URL}/news/${randomId}`, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('Não foi possível encontrar uma notícia com o ID informado');
  }
});

test('Deve falhar ao tentar remover uma notícia informando um ID inválido', async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/news/123`, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('O ID informado é inválido!');
  }
});

test('Deve retornar uma lista contendo todas as notícias do banco de dados', async () => {
  const response = await axios.get(`${BASE_URL}/news`, { headers });
  expect(response.status).toBe(200);
});

test('Deve retornar um único registro correspondente ao ID informado', async () => {
  const news: News = {
    titulo: 'Título',
    conteudo: 'Conteúdo',
    dataPublicacao: new Date(),
  };

  const responseCreate = await axios.post(`${BASE_URL}/news`, news, { headers });
  const created = responseCreate.data;

  const response = await axios.get(`${BASE_URL}/news/${created._id}`, { headers });
  expect(response.status).toBe(200);
});

test('Deve falhar ao tentar retornar uma notícia por conta do ID inválido', async () => {
  try {
    const response = await axios.get(`${BASE_URL}/news/555`, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('O ID informado é inválido!');
  }
});

test('Deve falhar ao tentar retornar uma notícia por conta de não existir nenhuma com o ID informado', async () => {
  const randomId = mongoose.Types.ObjectId().toHexString();

  try {
    const response = await axios.get(`${BASE_URL}/news/${randomId}`, { headers });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('Não foi possível encontrar uma notícia com o ID informado');
  }
});

test('Deve falhar ao tentar fazer uma requisição a uma API protegida ao informar um token inválido', async () => {
  try {
    const response = await axios.get(`${BASE_URL}/news`, { headers: { Authorization: 'Bearer naodefinido' } });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('Token informado não é válido!');
  }
});

test('Deve falhar ao tentar fazer uma requisição sem informar um token', async () => {
  try {
    const response = await axios.get(`${BASE_URL}/news`, { headers: { Authorization: '' } });
    throw new Error('Requisição foi concluída, deveria retornar erro');
  } catch (err) {
    expect(err.response.data.message).toBe('O token deve ser informado obrigatoriamente');
  }
});
