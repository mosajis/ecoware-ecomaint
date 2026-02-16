import * as z from "zod";

export const schema = z.object({
  component: z
    .object({
      compId: z.number(),
      compNo: z.string().nullable(),
      serialNo: z.string().nullable(),
      tblLocation: z
        .object({
          locationId: z.number(),
          name: z.string().nullable(),
        })
        .nullable(),
    })
    .nullable(),

  location: z
    .object({
      locationId: z.number(),
      name: z.string().nullable(),
    })
    .nullable(),

  title: z.string().nullable(),

  failureSeverity: z
    .object({
      failureSeverityLevelId: z.number(),
      name: z.string().nullable(),
    })
    .nullable(),

  failureStatus: z
    .object({
      failureStatusId: z.number(),
      name: z.string().nullable(),
    })
    .nullable(),

  failureGroupFollow: z
    .object({
      failureGroupFollowId: z.number(),
      name: z.string().nullable(),
    })
    .nullable(),

  maintClass: z
    .object({
      maintClassId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintCause: z
    .object({
      maintCauseId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintType: z
    .object({
      maintTypeId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  totalWait: z.number().nullable(),

  failureDesc: z.string().nullable(),
  actionDesc: z.string().nullable(),
  followDesc: z.string().nullable(),

  failureDateTime: z.date().nullable(),
  nextFollowDate: z.date().nullable(),
  closeDate: z.date().nullable(),

  requestNo: z.string().nullable(),

  reportedBy: z
    .object({
      userId: z.number(),
      uName: z.string().nullable(),
      uUserName: z.string().nullable(),
    })
    .nullable(),

  discipline: z
    .object({
      discId: z.number(),
      name: z.string().nullable(),
    })
    .nullable(),
});

export type SchemaValue = z.infer<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  component: null,
  location: null,
  title: null,
  failureSeverity: null,
  failureStatus: null,
  failureGroupFollow: null,
  totalWait: null,
  failureDesc: null,
  actionDesc: null,
  followDesc: null,
  failureDateTime: new Date(),
  nextFollowDate: null,
  closeDate: null,
  requestNo: null,
  reportedBy: null,
  discipline: null,
};
