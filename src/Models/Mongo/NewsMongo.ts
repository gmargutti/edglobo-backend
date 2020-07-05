import mongoose, { Schema, Document } from 'mongoose';

export interface NewsMongo extends Document {
  titulo: String
  conteudo: String
  dataPublicacao: Date
}

const NewsSchema = new Schema({
  titulo: { type: String, required: true },
  conteudo: { type: String, required: true },
  dataPublicacao: { type: Date, required: true },
});

export default mongoose.model<NewsMongo>('news', NewsSchema);
