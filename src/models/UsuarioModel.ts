import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// ===== ZOD (validação dos dados de entrada) =====

export const UsuarioInputSchema = z.object({
  email: z.email(),
  senha: z.string().min(6).max(12),
});
export type UsuarioInput = z.infer<typeof UsuarioInputSchema>;

// ===== MONGOOSE (persistência no banco) =====
const modelName = "usuarios";
export interface IUsuario extends Document, UsuarioInput {
  criadoEm: Date;
}

const UsuarioMongooseSchema = new Schema<IUsuario>(
  {
    email: { type: Schema.Types.String, required: true },
    senha: { type: Schema.Types.String, required: true },
    criadoEm: { type: Schema.Types.Date, default: Date.now },
  },
  { collection: modelName },
);

export default mongoose.model<IUsuario>(modelName, UsuarioMongooseSchema);
