import { TextField, Box } from "@mui/material";

const GeneralTab = (props: any) => {
  const { name, setName, description, setDescription } = props;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, m: 1 }}>
      <TextField
        size="small"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />
      <TextField
        size="small"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        multiline
        fullWidth
      />
    </Box>
  );
};

export default GeneralTab;
