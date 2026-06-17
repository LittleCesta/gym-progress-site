import { z } from "zod";

export const FichaSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().optional().or(z.literal("")),
  peso: z.number().min(0).max(500).default(0),
  peito: z.number().min(0).max(300).default(0),
  abdomen: z.number().min(0).max(300).default(0),
  ombros: z.number().min(0).max(300).default(0),
  quadricepsEsquerdo: z.number().min(0).max(150).default(0),
  quadricepsDireito: z.number().min(0).max(150).default(0),
  panturrilhaEsquerda: z.number().min(0).max(100).default(0),
  panturrilhaDireita: z.number().min(0).max(100).default(0),
  bicepsEsquerdo: z.number().min(0).max(100).default(0),
  bicepsDireito: z.number().min(0).max(100).default(0),
});

export type FichaInput = z.infer<typeof FichaSchema>;
