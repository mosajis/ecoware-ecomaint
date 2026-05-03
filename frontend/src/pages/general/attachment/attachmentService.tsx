import Axios from "axios";
import { TypeTblAttachment } from "@/core/api/generated/api";
import { configAxios } from "@/config";
import { api } from "@/service/axios";

const axios = Axios.create({
  baseURL: configAxios.httpURL,
});

export type CreateAttachmentPayload = {
  file: File;
  title: string;
  attachmentTypeId: number;
  isUserAttachment: boolean;
  createdEmployeeId: number;
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
  form.append("createdEmployeeId", String(payload.createdEmployeeId));

  try {
    const res = await api.post<TypeTblAttachment>("tblAttachment", {
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
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
  window.open(configAxios.httpURL + `/tblAttachment/${id}/download`, "_blank");
}
