import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import NewsRepositoryMongo from '../Repositories/NewsRepositories/NewsRepositoryMongo';
import INewsRepository from '../Repositories/NewsRepositories/INewsRepository';
import News from '../@types/News';
import NewsMongo from '../Models/Mongo/NewsMongo';
import NewsController from '../Controllers/NewsController';

dotenv.config({
  path: '.env.test',
});

const repo = new NewsRepositoryMongo();
const controller = new NewsController(repo);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
});

test('Deve dicionar uma Notícia ao banco de dados utilizando o NewsRepository', async () => {
  const news: News = {
    conteudo: 'Primeira publicação feita em 04/06/2020',
    titulo: 'Publicação de Notícias no MongoDB',
    dataPublicacao: new Date(),
  };
  const created = await controller.create(news);
  expect(created).toBeInstanceOf(NewsMongo);
});

test('Deve falhar ao adicionar uma Notícia faltando alguma das propriedades utilizando o NewsRepository', async () => {
  const news: News = {
    conteudo: '',
    titulo: 'Não Informado',
    dataPublicacao: new Date(),
  };
  let error;
  try {
    const createFail = await controller.create(news);
  } catch (err) {
    error = err;
  }
  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'Não foi possível inserir a Notícia no banco de dados', name: 'CUSTOM_ERROR' });
});

test('Deve atualizar as propriedades da Notícia no banco de dados utilizando o NewsRepository', async () => {
  const news: News = {
    conteudo: 'Deve Ser Alterado',
    titulo: 'Alteração',
    dataPublicacao: new Date(),
  };

  const created = await controller.create(news);
  const toUpdate = {
    ...news,
    conteudo: 'Foi atualizado!',
  };
  const updated = await controller.update(`${created.id}`, toUpdate);
  expect(updated.conteudo).toBe('Foi atualizado!');
});

test('Deve falhar ao tentar atualizar uma notícia por conta de o ID informado estar inválido', async () => {
  const news: News = {
    titulo: 'Inexistente',
    conteudo: 'Não foi cadastrado',
    dataPublicacao: new Date(),
  };
  const created = await controller.create(news);
  let error;
  try {
    const updated = await controller.update(`${created.id}1`, news);
  } catch (err) {
    error = err;
  }
  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'O ID informado é inválido!', name: 'CastError' });
});

test('Deve falhar ao tentar atualizar uma notícia por de um dos campos estarem vazios', async () => {
  const news: News = {
    conteudo: 'Conteudo',
    titulo: 'Titulo',
    dataPublicacao: new Date(),
  };
  const created = await controller.create(news);
  let error;
  try {
    const updated = await controller.update(`${created.id}`, { ...news, titulo: '' });
    console.log(updated);
  } catch (err) {
    error = err;
  }
  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'Não foi possível inserir a Notícia no banco de dados', name: 'CUSTOM_ERROR' });
});

test('Deve falhar ao tentar atualizar uma notícia por conta de o ID informado não existir no banco de dados', async () => {
  const news = {
    titulo: 'Inexistente',
    conteudo: 'Não foi cadastrado',
    dataPublicacao: new Date(),
  };
  const randomId = mongoose.Types.ObjectId().toHexString();
  let error;
  try {
    const updated = await controller.update(randomId, news);
  } catch (err) {
    error = err;
  }
  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'Não foi possível encontrar uma notícia com o ID informado', name: 'CUSTOM_ERROR' });
});

test('Deve remover uma notícia pré-existente utilizando o NewsRepository', async () => {
  const news: News = {
    titulo: 'Deletar',
    conteudo: 'Teste Delete Notícia',
    dataPublicacao: new Date(),
  };

  const created = await controller.create(news);
  const deleted = await controller.delete(`${created.id}`);
  expect(deleted).toBeInstanceOf(NewsMongo);
});

test('Deve falhar ao tentar remover uma notícia por conta de o ID informado ser incorreto', async () => {
  const randomId = mongoose.Types.ObjectId().toHexString();

  let error;
  try {
    const deleted = await controller.delete(randomId);
  } catch (err) {
    error = err;
  }
  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'Não foi possível encontrar uma notícia com o ID informado', name: 'CUSTOM_ERROR' });
});

test('Deve falhar ao tentar remover uma notícia informando um ID inválido', async () => {
  const id = '123456';

  let error;
  try {
    const deleted = await controller.delete(id);
  } catch (err) {
    error = err;
  }
  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'O ID informado é inválido!', name: 'CastError' });
});

test('Deve retornar uma lista contendo todas as notícias do banco de dados', async () => {
  const news = await controller.read();
  expect(news).toBeInstanceOf(Array);
});

test('Deve retornar um único registro correspondente ao ID informado', async () => {
  const news: News = {
    titulo: 'Leitura',
    conteudo: 'Leitura de uma única notícia',
    dataPublicacao: new Date(),
  };

  const created = await controller.create(news);
  const read = await controller.read(`${created.id}`);
  expect(read).toBeInstanceOf(NewsMongo);
});

test('Deve falhar ao tentar retornar uma notícia por conta do ID inválido', async () => {
  const id = '12346';

  let error;
  try {
    const read = await controller.read(id);
  } catch (err) {
    error = err;
  }

  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'O ID informado é inválido!', name: 'CastError' });
});

test('Deve falhar ao tentar retornar uma notícia por conta de não existir nenhuma com o ID informado', async () => {
  const randomId = mongoose.Types.ObjectId().toHexString();

  let error;
  try {
    const read = await controller.read(randomId);
  } catch (err) {
    error = err;
  }
  const { message, name } = error;
  expect({ message, name }).toStrictEqual({ message: 'Não foi possível encontrar uma notícia com o ID informado', name: 'CUSTOM_ERROR' });
});

afterAll(() => {
  NewsMongo.collection.drop();
  mongoose.disconnect();
});
