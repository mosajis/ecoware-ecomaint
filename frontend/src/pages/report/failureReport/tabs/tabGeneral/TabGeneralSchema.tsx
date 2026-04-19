import * as z from "zod";

export const schema = z.object({
  // Basic Info
  title: z.string(),
  requestNo: z.string(),
  failureDateTime: z.date().or(z.string()),

  // Component & Location
  component: z
    .object({
      compId: z.number(),
      compNo: z.string().nullable().optional(),
      serialNo: z.string().nullable().optional(),
      functionId: z.number().nullable().optional(),
      tblLocation: z
        .object({
          locationId: z.number(),
          name: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .refine((val) => val !== null),

  // Status & Severity
  failureSeverity: z
    .object({
      failureSeverityLevelId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .refine((val) => val !== null),

  failureStatus: z
    .object({
      failureStatusId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .refine((val) => val !== null),

  failureGroupFollow: z
    .object({
      failureGroupFollowId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  nextFollowDate: z.string().nullable().optional(),

  // Maintenance Info
  maintClass: z
    .object({
      maintClassId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .refine((val) => val !== null),

  maintCause: z
    .object({
      maintCauseId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .refine((val) => val !== null),

  maintType: z
    .object({
      maintTypeId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .refine((val) => val !== null),

  // Descriptions
  failureDesc: z.string(),
  downTime: z.number(),
  followDesc: z.string().nullable().optional(),
});

export type SchemaValue = z.input<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  downTime: 0,
  title: "",
  requestNo: "",
  failureDesc: "",
  failureDateTime: new Date(),
  component: null,
  failureSeverity: null,
  failureStatus: null,
  failureGroupFollow: null,
  nextFollowDate: null,
  maintClass: null,
  maintCause: null,
  maintType: null,
  followDesc: null,
};
