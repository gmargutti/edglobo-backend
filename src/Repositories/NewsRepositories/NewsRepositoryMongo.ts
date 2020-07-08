import INewsRepository from './INewsRepository';
import News from '../../@types/News';
import NewsMongoModel, { NewsMongo } from '../../Models/Mongo/NewsMongo';

export default class NewsRepositoryMongo implements INewsRepository {
  public async create(news: News) {
    try {
      const newModel = new NewsMongoModel(news);
      const saved = await newModel.save();
      return saved;
    } catch (err) {
      const error = new Error();
      error.name = 'CUSTOM_ERROR';
      error.message = 'Não foi possível inserir a Notícia no banco de dados';
      throw error;
    }
  }

  public async read(newsId?: string): Promise<News[] | News> {
    if (newsId) {
      try {
        const newsModelById = await NewsMongoModel.findById(newsId);
        if (!newsModelById) {
          const error = new Error('Não foi possível encontrar uma notícia com o ID informado');
          error.name = 'CUSTOM_ERROR';
          throw error;
        }
        return newsModelById;
      } catch (err) {
        if (err.name === 'CastError') {
          const error = new Error('O ID informado é inválido!');
          error.name = 'CastError';
          throw error;
        } else {
          throw err;
        }
      }
    }
    const newsModels = await NewsMongoModel.find();
    if (!Array.isArray(newsModels)) { return [newsModels]; }
    return newsModels;
  }

  public async update(newsId: string, news: News): Promise<News> {
    try {
      const updated = await NewsMongoModel.findById(newsId) as NewsMongo;

      if (!updated) {
        const error = new Error('Não foi possível encontrar uma notícia com o ID informado');
        error.name = 'CUSTOM_ERROR';
        throw error;
      }

      updated.conteudo = news.conteudo;
      updated.titulo = news.titulo;

      await updated.save();
      return updated;
    } catch (err) {
      if (err.name === 'CastError') {
        const error = new Error('O ID informado é inválido!');
        error.name = 'CastError';
        throw error;
      } else if (err.name === 'CUSTOM_ERROR') {
        throw err;
      } else {
        const error = new Error();
        error.name = 'CUSTOM_ERROR';
        error.message = 'Não foi possível inserir a Notícia no banco de dados';
        throw error;
      }
    }
  }

  public async delete(newsId: string): Promise<News> {
    try {
      const deleted = await NewsMongoModel.findByIdAndDelete(newsId);
      if (!deleted) {
        const error = new Error('Não foi possível encontrar uma notícia com o ID informado');
        error.name = 'CUSTOM_ERROR';
        throw error;
      }
      return deleted;
    } catch (err) {
      if (err.name === 'CastError') {
        const error = new Error('O ID informado é inválido!');
        error.name = 'CastError';
        throw error;
      } else {
        throw err;
      }
    }
  }
}
