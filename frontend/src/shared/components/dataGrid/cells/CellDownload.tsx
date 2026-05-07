import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { downloadAttachment } from "@/pages/general/attachment/AttachmentService";
import { FC } from "react";

type CellDownloadProps = {
  attachmentId?: number | null;
};

const CellDownload: FC<CellDownloadProps> = ({ attachmentId }) => {
  if (!attachmentId) return "-";

  const handleDownload = async () => {
    downloadAttachment(attachmentId);
  };

  return (
    <Tooltip title="Download file">
      <IconButton
        size="small"
        onClick={handleDownload}
        sx={{ border: 0, width: 28, height: 28, color: "#3580e4ff" }}
      >
        <DownloadRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default CellDownload;
