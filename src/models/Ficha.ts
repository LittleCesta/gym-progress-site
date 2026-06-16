import mongoose, { Schema, Document } from "mongoose";

const modelName = "fichas";
interface IMedidas extends Document {
  fichaId: mongoose.Types.ObjectId;
  peso: number;
  peito: number;
  abdomen: number;
  ombros: number;
  quadricepsEsquerdo: number;
  quadricepsDireito: number;
  panturrilhaEsquerda: number;
  panturrilhaDireita: number;
  bicepsEsquerdo: number;
  bicepsDireito: number;
}

export interface IFicha extends IMedidas {
  nome: string;
  email: string;
  criadoEm: Date;
}

const FichaSchema = new Schema<IFicha>(
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

// FichaSchema.index({ nome: 1 }, { collation: { locale: "pt", strength: 2 } });

export default mongoose.model<IFicha>(modelName, FichaSchema);
