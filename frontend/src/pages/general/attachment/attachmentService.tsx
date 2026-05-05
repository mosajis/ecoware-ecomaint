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

export async function downloadAttachment(id: number) {
  const res = await api.get(`/tblAttachment/${id}/download`, {
    responseType: "blob",
  });

  const blob = new Blob([res.data]);
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const disposition =
    res.headers?.["content-disposition"] ||
    res.headers?.["Content-Disposition"];

  let fileName = `attachment-${id}`;

  if (disposition) {
    const match = disposition.match(/filename="?(.*?)"?$/);
    if (match?.[1]) fileName = match[1];
  }

  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}
