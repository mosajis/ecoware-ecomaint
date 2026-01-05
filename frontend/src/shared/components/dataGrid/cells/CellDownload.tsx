import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { downloadAttachment } from '@/pages/general/attachment/attachmentService'
import { FC, useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'

type CellDownloadProps = {
  attachmentId?: number | null
}

const CellDownload: FC<CellDownloadProps> = ({ attachmentId }) => {
  const [loading, setLoading] = useState(false)

  if (!attachmentId) return '-'

  const handleDownload = async () => {
    setLoading(true)
    downloadAttachment(attachmentId).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Tooltip title='Download file'>
      <IconButton
        size='small'
        loading={loading}
        onClick={handleDownload}
        disabled={loading}
        sx={{ border: 0, width: 28, height: 28, color: '#3580e4ff' }}
      >
        <DownloadRoundedIcon fontSize='small' />
      </IconButton>
    </Tooltip>
  )
}

export default CellDownload
