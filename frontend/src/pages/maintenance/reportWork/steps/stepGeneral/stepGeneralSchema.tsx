import * as z from "zod";

export const selectSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).nullable();

export const schema = z.object({
  dateDone: z.string().or(z.date()),
  totalDuration: z.number(),
  waitingMin: z.number(),
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
  reportedCount: z.number().nullable(),
});

export type TypeValues = z.input<typeof schema>;
