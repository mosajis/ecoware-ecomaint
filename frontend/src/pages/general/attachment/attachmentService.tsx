// attachmentService.ts
import { TypeTblAttachment } from "@/core/api/generated/api";
import { api } from "@/service/axios";
import axios from "axios";
import { toast } from "sonner";

export type CreateAttachmentPayload = {
  file: File;
  title: string;
  attachmentTypeId: number;
  isUserAttachment: boolean;
  createdUserId: number;
};

/**
 * Create attachment using FormData (file upload) with Axios
 */
export async function createAttachment(
  payload: CreateAttachmentPayload,
): Promise<TypeTblAttachment> {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("title", payload.title);
  form.append("attachmentTypeId", String(payload.attachmentTypeId));
  form.append("isUserAttachment", String(payload.isUserAttachment));
  form.append("createdUserId", String(payload.createdUserId));

  try {
    const res = await axios.post<TypeTblAttachment>(
      "http://localhost:5273/tblAttachment",
      form,
    );
    return res.data;
  } catch (err: any) {
    if (err.response) {
      throw new Error(
        `Failed to create attachment: ${err.response.status} ${err.response.statusText}`,
      );
    }
    throw new Error(`Failed to create attachment: ${err.message}`);
  }
}

export function downloadAttachment(id: number) {
  window.open(`http://localhost:5273/tblAttachment/${id}/download`, "_blank");
}
