import { z } from "zod";

export const schema = z.object({
  workShopNo: z.string().optional(),
  awardingDate: z.string(),
  discipline: z.any(),
  personInCharge: z.any().nullable(),
  personInChargeApprove: z.any().nullable(),
  repairDescription: z.string(),
  followDesc: z.string().optional().nullable(),
  title: z.string(),
});

export type SchemaValue = z.infer<typeof schema>;

export const DEFAULT_VALUES: SchemaValue = {
  awardingDate: new Date().toString(),
  discipline: null,
  personInCharge: null,
  personInChargeApprove: null,
  workShopNo: "",
  repairDescription: "",
  followDesc: "",
  title: "",
};
