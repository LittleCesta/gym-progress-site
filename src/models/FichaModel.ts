import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// ===== ZOD (validação dos dados de entrada) =====

export const FichaInputSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().optional().or(z.literal("")),
  peso: z.number().min(0).max(200).default(0),
  peito: z.number().min(0).max(200).default(0),
  abdomen: z.number().min(0).max(200).default(0),
  ombros: z.number().min(0).max(200).default(0),
  quadricepsEsquerdo: z.number().min(0).max(150).default(0),
  quadricepsDireito: z.number().min(0).max(150).default(0),
  panturrilhaEsquerda: z.number().min(0).max(150).default(0),
  panturrilhaDireita: z.number().min(0).max(150).default(0),
  bicepsEsquerdo: z.number().min(0).max(150).default(0),
  bicepsDireito: z.number().min(0).max(150).default(0),
});

export type FichaInput = z.infer<typeof FichaInputSchema>;

// ===== MONGOOSE (persistência no banco) =====

const modelName = "fichas";

export interface IFicha extends Document, FichaInput {
  criadoEm: Date;
}

const FichaMongooseSchema = new Schema<IFicha>(
  {
    nome: { type: Schema.Types.String, required: true, unique: true },
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

export default mongoose.model<IFicha>(modelName, FichaMongooseSchema);
