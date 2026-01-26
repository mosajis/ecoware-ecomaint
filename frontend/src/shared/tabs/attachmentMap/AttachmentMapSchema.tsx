import * as z from "zod";

export const existingAttachmentSchema = z.object({
  selectedAttachmentId: z.number().nullable(),
});

export const newAttachmentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  attachmentType: z
    .object({
      attachmentTypeId: z.number(),
      name: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "attachment Type is required",
    }),
  isUserAttachment: z.boolean(),
  file: z.instanceof(File, { message: "File is required" }),
});
