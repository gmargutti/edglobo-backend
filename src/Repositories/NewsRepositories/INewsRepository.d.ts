import News from '../../@types/News';
import { NewsMongo } from '../../Models/Mongo/NewsMongo';

export default interface INewsRepository{
    public create(news: News): Promise<News>
    public read(newsId?: string): Promise<News[] | News>
    public update(newsId: string, news: News): Promise<News>
    public delete(newsId: string): Promise<News>
}
