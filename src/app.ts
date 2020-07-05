import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './Routes';
import NewsRepositoryMongo from './Repositories/NewsRepositories/NewsRepositoryMongo';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.example.env',
});

class App {
    public server: express.Express

    public Repositories: any

    constructor() {
      this.server = express();
      this.middlewares();
      this.routes();
      this.database();
      this.Repositories = this.getRepositories();
    }

    private middlewares() {
      this.server.use(express.json());
      this.server.use(cors());
    }

    private routes() {
      this.server.use(routes);
    }

    private database() {
      mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    private getRepositories() {
      return {
        NewsRepository: new NewsRepositoryMongo(),
      };
    }
}

export default new App();
