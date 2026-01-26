import * as z from "zod";

export const schema = z.object({
  compType: z
    .object({
      compTypeId: z.number(),
      compName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  location: z
    .object({
      locationId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  parentComp: z
    .object({
      compId: z.number(),
      compNo: z.string().nullable(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "ComponentType is required",
    }),
  vendor: z
    .object({
      addressId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  status: z
    .object({
      compStatusId: z.number(),
      compStatusName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  compNo: z.string().min(1, "Component No is required"),
  serialNo: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  assetNo: z.string().nullable().optional(),
  comment1: z.string().nullable().optional(),
  comment2: z.string().nullable().optional(),
  comment3: z.string().nullable().optional(),
  isCritical: z.boolean().nullable().optional(),
  orderNo: z.number().nullable().optional(),
});

export type SchemaValue = z.infer<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  compType: null,
  location: null,
  parentComp: null,
  vendor: null,
  status: null,
  compNo: "",
  serialNo: null,
  assetNo: null,
  comment1: null,
  comment2: null,
  comment3: null,
  isCritical: false,
  orderNo: null,
};
