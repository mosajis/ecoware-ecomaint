import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Divider,
  CircularProgress,
} from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import {
  tblDiscipline,
  tblWorkOrder,
  tblWorkOrderStatus,
  TypeTblDiscipline,
  TypeTblWorkOrder,
  TypeTblWorkOrderStatus,
} from '@/core/api/generated/api'

/* ==================== TYPES ==================== */
interface KPI {
  label: string
  value: string | number
  color: string
}

interface StatusStat {
  workOrderStatusId: number
  name: string
  count: number
  progress: number
}

interface DisciplinePerformance {
  total: number
  completed: number
  overdue: number
}

/* ==================== COLORS ==================== */
const STATUS_COLORS: Record<number, string> = {
  1: '#90caf9',
  2: '#64b5f6',
  3: '#4db6ac',
  4: '#ffb74d',
  5: '#81c784',
  6: '#9575cd',
  7: '#e57373',
  8: '#fff176',
}

const KPI_COLORS = {
  total: '#1976d2',
  open: '#ff9800',
  completed: '#4caf50',
  overdue: '#f44336',
}

/* ==================== KPI CARD COMPONENT ==================== */
interface KPICardProps {
  label: string
  value: string | number
  color: string
}

const KPICard: React.FC<KPICardProps> = ({ label, value, color }) => (
  <Card sx={{ borderTop: `4px solid ${color}`, height: '100%' }}>
    <CardContent>
      <Typography
        variant='caption'
        color='textSecondary'
        display='block'
        mb={1}
      >
        {label}
      </Typography>
      <Typography variant='h5' fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
)

/* ==================== STATUS PROGRESS CARD COMPONENT ==================== */
interface StatusProgressCardProps {
  title: string
  count: number
  progress: number
  color: string
}

const StatusProgressCard: React.FC<StatusProgressCardProps> = ({
  title,
  count,
  progress,
  color,
}) => (
  <Card>
    <CardContent>
      <Stack spacing={1}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='subtitle2' color='textSecondary'>
            {title}
          </Typography>
          <Typography variant='h6' fontWeight={700} sx={{ color }}>
            {count}
          </Typography>
        </Stack>
        <LinearProgress
          variant='determinate'
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': { backgroundColor: color },
          }}
        />
        <Typography variant='caption' align='right'>
          {progress}%
        </Typography>
      </Stack>
    </CardContent>
  </Card>
)

/* ==================== MAIN DASHBOARD ==================== */
const Dashboard: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<TypeTblWorkOrder[]>([])
  const [disciplines, setDisciplines] = useState<TypeTblDiscipline[]>([])
  const [statuses, setStatuses] = useState<TypeTblWorkOrderStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [woRes, discRes, statusRes] = await Promise.all([
          tblWorkOrder.getAll(),
          tblDiscipline.getAll(),
          tblWorkOrderStatus.getAll(),
        ])
        setWorkOrders(woRes.items)
        setDisciplines(discRes.items)
        setStatuses(statusRes.items)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalWO = workOrders.length

  const statusCountMap = useMemo(() => {
    return workOrders.reduce((acc, wo) => {
      if (!wo.workOrderStatusId) return acc
      acc[wo.workOrderStatusId] = (acc[wo.workOrderStatusId] || 0) + 1
      return acc
    }, {} as Record<number, number>)
  }, [workOrders])

  const statusStats: StatusStat[] = useMemo(() => {
    return statuses.map(s => ({
      workOrderStatusId: s.workOrderStatusId,
      name: s.name,
      count: statusCountMap[s.workOrderStatusId] || 0,
      progress: totalWO
        ? Math.round(
            ((statusCountMap[s.workOrderStatusId] || 0) / totalWO) * 100
          )
        : 0,
    }))
  }, [statusCountMap, statuses, totalWO])

  const kpis: KPI[] = useMemo(() => {
    const total = workOrders.length
    const completedStatuses = [5, 7]
    const completedCount = workOrders.filter(
      wo =>
        wo.workOrderStatusId && completedStatuses.includes(wo.workOrderStatusId)
    ).length
    const openCount = total - completedCount
    const completedPercent = total
      ? Math.round((completedCount / total) * 100)
      : 0
    const overdueCount = workOrders.filter(
      wo =>
        wo.dueDate &&
        new Date(wo.dueDate) < new Date() &&
        (!wo.workOrderStatusId ||
          !completedStatuses.includes(wo.workOrderStatusId))
    ).length

    return [
      { label: 'Total WO', value: total, color: KPI_COLORS.total },
      { label: 'Open WO', value: openCount, color: KPI_COLORS.open },
      {
        label: 'Completed',
        value: `${completedPercent}%`,
        color: KPI_COLORS.completed,
      },
      { label: 'Overdue', value: overdueCount, color: KPI_COLORS.overdue },
    ]
  }, [workOrders])

  const disciplinePerformance = useMemo(() => {
    const map: Record<number, DisciplinePerformance> = {}
    workOrders.forEach(wo => {
      if (!wo.respDiscId) return
      map[wo.respDiscId] ??= { total: 0, completed: 0, overdue: 0 }
      map[wo.respDiscId].total++
      if (wo.workOrderStatusId === 5) map[wo.respDiscId].completed++
      if (
        wo.dueDate &&
        new Date(wo.dueDate) < new Date() &&
        (!wo.workOrderStatusId || ![5, 7].includes(wo.workOrderStatusId))
      ) {
        map[wo.respDiscId].overdue++
      }
    })
    return map
  }, [workOrders])

  const disciplineStatusMap = useMemo(() => {
    const map: Record<number, Record<number, number>> = {}
    workOrders.forEach(wo => {
      if (!wo.respDiscId || !wo.workOrderStatusId) return
      map[wo.respDiscId] ??= {}
      map[wo.respDiscId][wo.workOrderStatusId] =
        (map[wo.respDiscId][wo.workOrderStatusId] || 0) + 1
    })
    return map
  }, [workOrders])

  const pieData = useMemo(() => {
    return statusStats.map(s => ({
      id: s.workOrderStatusId,
      label: s.name,
      value: s.count,
      color: STATUS_COLORS[s.workOrderStatusId],
    }))
  }, [statusStats])

  const trendData = useMemo(() => {
    const dayMap: Record<string, { created: number; completed: number }> = {}
    workOrders.forEach(wo => {
      const createdDay = wo.created
        ? new Date(wo.created).toISOString().slice(0, 10)
        : null
      const completedDay = wo.completed
        ? new Date(wo.completed).toISOString().slice(0, 10)
        : null

      if (createdDay) dayMap[createdDay] ??= { created: 0, completed: 0 }
      if (createdDay) dayMap[createdDay].created++
      if (completedDay) dayMap[completedDay] ??= { created: 0, completed: 0 }
      if (completedDay) dayMap[completedDay].completed++
    })

    const days = Object.keys(dayMap).sort()
    return {
      x: days,
      created: days.map(d => dayMap[d].created),
      completed: days.map(d => dayMap[d].completed),
    }
  }, [workOrders])

  if (loading) {
    return (
      <Box p={4} display='flex' justifyContent='center'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box mb={5}>
        <Typography variant='h4' fontWeight={700} mb={1}>
          Work Order Dashboard
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          Real-time monitoring and performance tracking
        </Typography>
      </Box>
      {/* ==================== SECTION 1: KPI CARDS ==================== */}
      <Grid container spacing={3} mb={5}>
        {kpis.map(kpi => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
            <KPICard label={kpi.label} value={kpi.value} color={kpi.color} />
          </Grid>
        ))}
      </Grid>
      {/* ==================== SECTION 2: STATUS OVERVIEW ==================== */}
      <Grid container spacing={3} mb={5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant='h6' fontWeight={600} mb={3}>
                Status Distribution
              </Typography>
              <PieChart
                series={[
                  {
                    data: pieData,
                    innerRadius: 60,
                    outerRadius: 110,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: 'column',
                    position: { vertical: 'top', horizontal: 'right' },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant='h6' fontWeight={600} mb={3}>
                Status Breakdown
              </Typography>
              <Stack spacing={2}>
                {statusStats.map(s => (
                  <StatusProgressCard
                    key={s.workOrderStatusId}
                    title={s.name}
                    count={s.count}
                    progress={s.progress}
                    color={STATUS_COLORS[s.workOrderStatusId]}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* ==================== SECTION 3: TREND CHART ==================== */}
      <Card sx={{ mb: 5 }}>
        <CardContent>
          <Typography variant='h6' fontWeight={600} mb={3}>
            Created vs Completed Trend
          </Typography>
          <BarChart
            height={300}
            xAxis={[{ data: trendData.x, scaleType: 'band' }]}
            series={[
              { data: trendData.created, label: 'Created', color: '#42a5f5' },
              {
                data: trendData.completed,
                label: 'Completed',
                color: '#66bb6a',
              },
            ]}
            margin={{ bottom: 40, left: 40, right: 10, top: 10 }}
          />
        </CardContent>
      </Card>
      <Divider sx={{ my: 5 }} />
      {/* ==================== SECTION 4: DISCIPLINE PERFORMANCE ==================== */}
      <Typography variant='h6' fontWeight={600} mb={3}>
        Discipline Performance Summary
      </Typography>
      <Grid container spacing={3} mb={5}>
        {disciplines.map(discipline => {
          const perf = disciplinePerformance[discipline.discId] || {
            total: 0,
            completed: 0,
            overdue: 0,
          }
          const completedPercent = perf.total
            ? Math.round((perf.completed / perf.total) * 100)
            : 0
          const overduePercent = perf.total
            ? Math.round((perf.overdue / perf.total) * 100)
            : 0

          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={discipline.discId}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant='subtitle1' fontWeight={600} mb={3}>
                    {discipline.name}
                  </Typography>
                  <Stack spacing={2.5}>
                    <Box>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        mb={1}
                      >
                        <Typography variant='caption' fontWeight={500}>
                          Total Orders
                        </Typography>
                        <Typography variant='body2' fontWeight={700}>
                          {perf.total}
                        </Typography>
                      </Stack>
                    </Box>
                    <Box>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        mb={1}
                      >
                        <Typography variant='caption' fontWeight={500}>
                          Completed
                        </Typography>
                        <Typography variant='caption' fontWeight={700}>
                          {completedPercent}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant='determinate'
                        value={completedPercent}
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#4caf50',
                          },
                        }}
                      />
                    </Box>
                    <Box>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        mb={1}
                      >
                        <Typography variant='caption' fontWeight={500}>
                          Overdue
                        </Typography>
                        <Typography
                          variant='caption'
                          fontWeight={700}
                          sx={{ color: '#f44336' }}
                        >
                          {overduePercent}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant='determinate'
                        value={overduePercent}
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#f44336',
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Divider sx={{ my: 5 }} />
      {/* ==================== SECTION 5: DISCIPLINE STATUS DETAILS ==================== */}
      <Typography variant='h6' fontWeight={600} mb={3}>
        Status Distribution by Discipline
      </Typography>
      <Grid container spacing={3}>
        {disciplines.map(discipline => {
          const data = statuses.map(
            s =>
              disciplineStatusMap[discipline.discId]?.[s.workOrderStatusId] || 0
          )

          return (
            <Grid size={{ xs: 12, lg: 6 }} key={discipline.discId}>
              <Card>
                <CardContent>
                  <Typography variant='subtitle1' fontWeight={600} mb={3}>
                    {discipline.name}
                  </Typography>
                  <BarChart
                    height={250}
                    xAxis={[
                      { data: statuses.map(s => s.name), scaleType: 'band' },
                    ]}
                    series={[{ data, label: 'Count' }]}
                    colors={[
                      statuses.map(s => STATUS_COLORS[s.workOrderStatusId]),
                    ]}
                    margin={{ bottom: 30, left: 40, right: 10, top: 10 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Dashboard
