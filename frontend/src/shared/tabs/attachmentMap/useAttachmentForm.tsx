import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";

import { atomUser } from "@/pages/auth/auth.atom";
import { tblAttachment, TypeTblAttachment } from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";
import { createAttachment } from "@/pages/general/attachment/AttachmentService";
import {
  existingAttachmentSchema,
  newAttachmentSchema,
} from "./AttachmentMapSchema";
import {
  ExistingAttachmentFormValues,
  NewAttachmentFormValues,
  AttachmentFormMode,
  MapRelationConfig,
  AttachmentMapService,
} from "./AttachmentType";
import { toast } from "sonner";

interface UseAttachmentFormProps<T> {
  open: boolean;
  relationConfig: MapRelationConfig;
  mapService: AttachmentMapService<T>;
  onSuccess: (data: T) => void;
  onClose: () => void;
}

export function useAttachmentForm<T>({
  open,
  relationConfig,
  mapService,
  onSuccess,
  onClose,
}: UseAttachmentFormProps<T>) {
  const [activeTab, setActiveTab] = useState<AttachmentFormMode>("new");
  const [submitting, setSubmitting] = useState(false);
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<
    number | null
  >(null);

  const [attachments, setAttachments] = useState<TypeTblAttachment[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  const user = useAtomValue(atomUser);

  // ======================
  // Forms
  // ======================
  const existingForm = useForm<ExistingAttachmentFormValues>({
    resolver: zodResolver(existingAttachmentSchema),
    defaultValues: { selectedAttachmentId: null },
    mode: "onChange",
  });

  const newForm = useForm<NewAttachmentFormValues>({
    resolver: zodResolver(newAttachmentSchema),
    defaultValues: {
      title: "",
      attachmentType: {
        attachmentTypeId: 0,
        name: "",
      },
      isUserAttachment: true,
      file: new File([], ""),
    },
    mode: "onChange",
  });

  const selectedFile = newForm.watch("file");

  // ======================
  // Auto title
  // ======================
  useEffect(() => {
    const fileName = selectedFile?.name?.trim();

    if (!fileName) {
      newForm.setValue("title", "");
      return;
    }

    const lastDot = fileName.lastIndexOf(".");
    const nameWithoutExt =
      lastDot === -1 ? fileName : fileName.substring(0, lastDot);

    const current = newForm.getValues("title");

    if (!current?.trim()) {
      newForm.setValue("title", nameWithoutExt);
    }
  }, [selectedFile, newForm]);

  // ======================
  // Load attachments
  // ======================
  const loadAttachments = useCallback(async () => {
    setLoadingAttachments(true);
    try {
      const res = await tblAttachment.getAll({
        include: { tblAttachmentType: true },
      });

      setAttachments(res.items ?? []);
    } finally {
      setLoadingAttachments(false);
    }
  }, []);

  // ======================
  // Reset
  // ======================
  const resetForms = useCallback(() => {
    existingForm.reset({ selectedAttachmentId: null });

    newForm.reset({
      title: "",
      attachmentType: null,
      isUserAttachment: true,
      file: new File([], ""),
    });

    setSelectedAttachmentId(null);
  }, [existingForm, newForm]);

  useEffect(() => {
    if (!open) return;

    resetForms();
    loadAttachments();
  }, [open, resetForms, loadAttachments]);

  // ======================
  // Normalize relationId (IMPORTANT)
  // ======================
  const filterId =
    relationConfig.filterId == null ? undefined : relationConfig.filterId;

  // ======================
  // Existing submit
  // ======================
  const handleExistingSubmit = useCallback(async () => {
    if (!selectedAttachmentId) {
      toast.error("Please select an attachment");
      return;
    }

    setSubmitting(true);

    try {
      const mapPayload = {
        orderNo: 0,

        ...buildRelation(relationConfig.relName, relationConfig.filterKey, {
          [relationConfig.filterKey]: filterId,
        }),

        ...buildRelation(relationConfig.attachmentField, "attachmentId", {
          attachmentId: selectedAttachmentId,
        }),

        ...buildRelation("tblEmployee", "employeeId", user?.tblEmployee),
      };

      const result = await mapService.create(mapPayload);

      if (result) {
        onSuccess(result);
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedAttachmentId,
    relationConfig,
    filterId,
    mapService,
    user?.tblEmployee?.employeeId,
    onSuccess,
    onClose,
  ]);

  // ======================
  // New submit
  // ======================
  const handleNewSubmit = useCallback(
    async (values: NewAttachmentFormValues) => {
      setSubmitting(true);

      try {
        const newAttachment = await createAttachment({
          title: values.title,
          attachmentTypeId: values.attachmentType?.attachmentTypeId || 0,
          isUserAttachment: values.isUserAttachment,
          file: values.file,
          createdEmployeeId: user?.tblEmployee?.employeeId as number,
        });

        if (!newAttachment) {
          throw new Error("Failed to create attachment");
        }

        const mapPayload = {
          orderNo: 0,

          ...buildRelation(relationConfig.relName, relationConfig.filterKey, {
            [relationConfig.filterKey]: filterId,
          }),

          ...buildRelation(
            relationConfig.attachmentField,
            "attachmentId",
            newAttachment,
          ),

          ...buildRelation("tblEmployee", "employeeId", user?.tblEmployee),
        };

        const result = await mapService.create(mapPayload);

        if (result) {
          onSuccess(result);
          onClose();
        }
      } finally {
        setSubmitting(false);
      }
    },
    [
      relationConfig,
      filterId,
      mapService,
      user?.tblEmployee?.employeeId,
      onSuccess,
      onClose,
    ],
  );

  return {
    activeTab,
    setActiveTab,
    submitting,

    selectedAttachmentId,
    setSelectedAttachmentId,

    attachments,
    loadingAttachments,

    existingForm,
    newForm,

    handleExistingSubmit,
    handleNewSubmit,
  };
}
