import * as z from "zod";

export const schema = z.object({
  // Basic Info
  title: z.string().min(1, "Title is required"),
  requestNo: z.string().nullable().optional(),
  failureDateTime: z.date(),

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
    .refine((val) => val !== null, "Component is required"),

  // Status & Severity
  failureSeverity: z
    .object({
      failureSeverityLevelId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  failureStatus: z
    .object({
      failureStatusId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  failureGroupFollow: z
    .object({
      failureGroupFollowId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  nextFollowDate: z.date().nullable().optional(),

  // Maintenance Info
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

  // Descriptions
  failureDesc: z.string().nullable().optional(),
  followDesc: z.string().nullable().optional(),
});

export type SchemaValue = z.input<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  title: null as any,
  requestNo: null,
  failureDateTime: new Date(),
  component: null,
  failureSeverity: null,
  failureStatus: null,
  failureGroupFollow: null,
  nextFollowDate: null,
  maintClass: null,
  maintCause: null,
  maintType: null,
  failureDesc: null,
  followDesc: null,
};
