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
  }).refine((val) => val !== null, {
    message: "Maint Type is required",
  }),
  maintCause: selectSchema({
    maintCauseId: z.number(),
    descr: z.string().nullable(),
  }).refine((val) => val !== null, {
    message: "Maint Cause is required",
  }),
  maintClass: selectSchema({
    maintClassId: z.number(),
    descr: z.string().nullable(),
  }).refine((val) => val !== null, {
    message: "Maint Class is required",
  }),
  reportedCount: z.number().nullable(),
});

export type TypeValues = z.input<typeof schema>;
