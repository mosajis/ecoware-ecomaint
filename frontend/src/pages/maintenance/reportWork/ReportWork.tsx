import TabsComponent from './ReportWorkTabs'
import { useEffect, useState, useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import { tblComponentUnit, tblJobDescription } from '@/core/api/generated/api'
import { useParams } from '@tanstack/react-router'

type ComponentUnit = {
  compId: number
  compNo: string
}

type JobDescription = {
  jobDescId: number
  jobDescTitle: string
}

const ReportWork = () => {
  const { compId } = useParams({ strict: false }) as { compId?: string }
  const numericCompId = compId ? Number(compId) : null

  /* -------- Component Units -------- */
  const [componentItems, setComponentItems] = useState<ComponentUnit[]>([])
  const [componentValue, setComponentValue] = useState<ComponentUnit | null>(
    null
  )
  const [loadingComponent, setLoadingComponent] = useState(true)

  // useEffect(() => {
  //   let mounted = true;
  //   setLoadingComponent(true);

  //   tblComponentUnit.getAll()
  //     .then((res) => {
  //       if (!mounted) return;
  //       const items = res?.items ?? [];
  //       setComponentItems(items);

  //       if (numericCompId) {
  //         const selected = items.find((c) => c.compId === numericCompId) ?? null;
  //         setComponentValue(selected);
  //       }
  //     })
  //     .finally(() => {
  //       if (mounted) setLoadingComponent(false);
  //     });

  //   return () => {
  //     mounted = false;
  //   };
  // }, [numericCompId]);

  /* -------- Job Description -------- */
  const [jobDescItems, setJobDescItems] = useState<JobDescription[]>([])
  const [jobDescValue, setJobDescValue] = useState<JobDescription | null>(null)
  const [loadingJobDesc, setLoadingJobDesc] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoadingJobDesc(true)

    tblJobDescription
      .getAll()
      .then(res => {
        if (!mounted) return
        const items = res?.items ?? []
        // setJobDescItems(items);
      })
      .finally(() => {
        if (mounted) setLoadingJobDesc(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const isDisabled = !!numericCompId || loadingComponent

  /* ======================= render ======================= */

  return (
    <Box>
      {/* Header */}
      <Box mb={1.5} display={'flex'} gap={1.5}>
        <AsyncSelectField<ComponentUnit>
          label='Component Unit'
          value={componentValue}
          disabled={isDisabled}
          request={tblComponentUnit.getAll}
          extractRows={data => data.items ?? []}
          columns={[{ field: 'compNo', headerName: 'Component No', flex: 1 }]}
          getRowId={row => row.compId}
          getOptionLabel={row => row.compNo}
          // onChange={setComponentValue}
          onChange={() => {}}
        />

        <AsyncSelectField<JobDescription>
          label='Job Description'
          value={jobDescValue}
          disabled={isDisabled}
          request={tblJobDescription.getAll}
          extractRows={data => data.items ?? []}
          columns={[{ field: 'jobDescTitle', headerName: 'Title', flex: 1 }]}
          getRowId={row => row.jobDescId}
          getOptionLabel={row => row.jobDescTitle}
          // onChange={setJobDescValue}
          onChange={() => {}}
        />
      </Box>

      <TabsComponent />
    </Box>
  )
}

export default ReportWork
