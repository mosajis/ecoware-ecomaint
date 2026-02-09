import * as z from "zod";

export const selectSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).nullable();

export const schema = z.object({
  dateDone: z.string().nullable(),
  totalDuration: z.number().nullable(),
  waitingMin: z.number().nullable(),
  unexpected: z.boolean(),

  history: z.string(),

  maintType: selectSchema({
    maintTypeId: z.number(),
    descr: z.string().nullable(),
  }),
  maintCause: selectSchema({
    maintCauseId: z.number(),
    descr: z.string().nullable(),
  }),
  maintClass: selectSchema({
    maintClassId: z.number(),
    descr: z.string().nullable(),
  }),
});

export type TypeValues = z.input<typeof schema>;
