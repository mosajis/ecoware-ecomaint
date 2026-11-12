import { z } from "zod";

export const schema = z.object({
  tankCapacity: z.number().nullable(),
  laboratoryCode: z.string().nullable(),
  samplingPosition: z.string().nullable(),
  oilDesc: z.string().nullable(),
  orderNo: z.number().nullable(),
});

export type SchemaValue = z.infer<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  tankCapacity: null,
  laboratoryCode: "",
  samplingPosition: "",
  oilDesc: "",
  orderNo: null,
};
