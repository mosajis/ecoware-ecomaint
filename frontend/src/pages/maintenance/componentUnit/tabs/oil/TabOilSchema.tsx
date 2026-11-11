import { z } from "zod";

export const schema = z.object({
  component: z.any().nullable(),
  compCounter: z.any().nullable(),
  spareType: z.any().nullable(),
  compJob: z.any().nullable(),
  employee: z.any().nullable(),
  installation: z.any().nullable(),

  tankCapacity: z.number().nullable(),
  laboratoryCode: z.string().nullable(),
  samplingPosition: z.string().nullable(),
  oilGrade: z.string().nullable(),
  orderNo: z.number().nullable(),
});

export type SchemaValue = z.infer<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  component: null,
  compCounter: null,
  spareType: null,
  compJob: null,
  employee: null,
  installation: null,

  tankCapacity: null,
  laboratoryCode: "",
  samplingPosition: "",
  oilGrade: "",
  orderNo: null,
};
