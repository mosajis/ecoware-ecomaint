import Axios from "axios";
import { TypeTblAttachment } from "@/core/api/generated/api";
import { configAxios } from "@/config";
import { api } from "@/service/axios";
import { LOCAL_STORAGE } from "@/const";

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
  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY);

  const isProduction = process.env.NODE_ENV === "production";
  const httpURL = isProduction ? "" : `http://localhost:5273`;

  const response = await fetch(`${httpURL}/tblAttachment/${id}/download`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const disposition = response.headers.get("Content-Disposition");

  let fileName = `attachment-${id}.pdf`;

  if (disposition) {
    const match = disposition.match(
      /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i,
    );

    fileName = decodeURIComponent(match?.[1] || match?.[2] || fileName);
  }

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}
