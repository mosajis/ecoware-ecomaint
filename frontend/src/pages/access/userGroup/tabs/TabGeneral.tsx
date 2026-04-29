import { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { atomUserGroupId } from "../UserGroupAtom";
import { tblUserGroup } from "@/core/api/generated/api";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TabGeneral = () => {
  const [userGroupId, setUserGroupId] = useAtom(atomUserGroupId);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    const load = async () => {
      if (!userGroupId) return;

      setIsFetching(true);
      try {
        const res = await tblUserGroup.getById(userGroupId);

        reset({
          name: res?.name ?? "",
          description: res?.description ?? "",
        });
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, [userGroupId, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (userGroupId) {
        await tblUserGroup.update(userGroupId, data);
      } else {
        const newGroup = await tblUserGroup.create(data);
        setUserGroupId(newGroup.userGroupId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, m: 1.5 }}>
      <TextField
        size="small"
        label="Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        disabled={isFetching}
      />

      <TextField
        size="small"
        label="Description"
        multiline
        rows={4}
        {...register("description")}
        fullWidth
        disabled={isFetching}
      />

      <Box display="flex" justifyContent="flex-start">
        <Button
          variant={!isDirty ? "outlined" : "contained"}
          color="secondary"
          onClick={handleSubmit(onSubmit)}
          loading={isLoading || isFetching}
          disabled={!isDirty}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TabGeneral;
