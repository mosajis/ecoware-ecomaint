import * as z from "zod";

export const schema = z.object({
  component: z
    .object({
      compId: z.number(),
      compNo: z.string().nullable(),
    })
    .nullable(),

  title: z.string().nullable(),

  failureSeverity: z
    .object({
      failureSeverityLevelId: z.number(),
      name: z.string(),
    })
    .nullable(),

  failureStatus: z
    .object({
      failureStatusId: z.number(),
      name: z.string(),
    })
    .nullable(),

  failureGroupFollow: z
    .object({
      failureGroupFollowId: z.number(),
      name: z.string(),
    })
    .nullable(),

  failureDesc: z.string().nullable(),
  actionDesc: z.string().nullable(),
  followDesc: z.string().nullable(),

  failureDateTime: z.date().nullable(),
  nextFollowDate: z.date().nullable(),
});

export type SchemaValue = z.infer<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  component: null,
  title: null,
  failureSeverity: null,
  failureStatus: null,
  failureGroupFollow: null,
  failureDesc: null,
  actionDesc: null,
  followDesc: null,
  failureDateTime: null,
  nextFollowDate: null,
};
