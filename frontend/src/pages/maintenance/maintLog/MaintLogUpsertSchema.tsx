import * as z from "zod";

export const selectSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).nullable();

export const schema = z.object({
  dateDone: z.string().or(z.date()),
  totalDuration: z.number().min(0, "must be positive"),
  waitingMin: z.number().min(0, "must be positive"),
  unexpected: z.number().min(0).max(2, "Invalid unexpected type"),
  history: z.string().default(""),

  maintType: selectSchema({
    maintTypeId: z.number(),
    descr: z.string().nullable(),
  })
    .nullable()
    .refine((val) => val !== null, {
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

  reportedCount: z.number().nullable().optional(),
});

export const buildSchema = (isCounter: boolean) =>
  schema.superRefine((data, ctx) => {
    if (isCounter && (!data.reportedCount || data.reportedCount === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Counter value is required and must be greater than 0",
        path: ["reportedCount"],
      });
    }
  });

export type TypeValues = z.input<typeof schema>;
