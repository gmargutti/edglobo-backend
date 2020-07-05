import INewsRepository from '../Repositories/NewsRepositories/INewsRepository';
import News from '../@types/News';

export default class NewsController {
    private repository: INewsRepository

    constructor(newsRepository: INewsRepository) {
      this.repository = newsRepository;
    }

    public async create(news: News) {
      const created = await this.repository.create(news);
      return created;
    }

    public async read(newsId?: string) {
      const news = await this.repository.read(newsId);
      return news;
    }

    public async update(newsId: string, news: News) {
      const updated = await this.repository.update(newsId, news);
      return updated;
    }

    public async delete(newsId: string) {
      const deleted = await this.repository.delete(newsId);
      return deleted;
    }
}
