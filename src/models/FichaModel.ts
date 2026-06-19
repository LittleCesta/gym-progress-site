import mongoose, { Schema, Document } from "mongoose";
import { FichaInput } from "../schemas/FichaSchema";

const modelName = "fichas";

// Estende o tipo do Zod, adicionando só o que é exclusivo do banco
export interface IFicha extends Document, FichaInput {
  criadoEm: Date;
}

const FichaModelSchema = new Schema<IFicha>(
  {
    nome: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, default: "" },
    criadoEm: { type: Schema.Types.Date, default: Date.now },

    peso: { type: Schema.Types.Number, default: 0 },
    peito: { type: Schema.Types.Number, default: 0 },
    abdomen: { type: Schema.Types.Number, default: 0 },
    ombros: { type: Schema.Types.Number, default: 0 },
    quadricepsEsquerdo: { type: Schema.Types.Number, default: 0 },
    quadricepsDireito: { type: Schema.Types.Number, default: 0 },
    panturrilhaEsquerda: { type: Schema.Types.Number, default: 0 },
    panturrilhaDireita: { type: Schema.Types.Number, default: 0 },
    bicepsEsquerdo: { type: Schema.Types.Number, default: 0 },
    bicepsDireito: { type: Schema.Types.Number, default: 0 },
  },
  { collection: modelName },
);

export default mongoose.model<IFicha>(modelName, FichaModelSchema);
