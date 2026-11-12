import Elysia, { t } from "elysia";
import { prisma } from "@/utils/prisma";
import { authPlugin } from "../auth/auth.guard";

const WaitingAnalysisSchema = t.Object({
  summary: t.Object({
    totalEvents: t.Number(),
    totalHours: t.Number(),
    averageDurationHours: t.Number(),
    daysWithWaiting: t.Number(),
  }),

  reasonGroups: t.Array(
    t.Object({
      waitingReasonGroupId: t.Nullable(t.Number()),
      name: t.String(),
      events: t.Number(),
      hours: t.Number(),
      shareOfHours: t.Number(),
    }),
  ),

  reasons: t.Array(
    t.Object({
      waitingReasonId: t.Nullable(t.Number()),
      reasonCode: t.String(),
      reasonNameEn: t.String(),
      reasonNameFa: t.Nullable(t.String()),
      reasonGroup: t.Nullable(t.String()),
      events: t.Number(),
      hours: t.Number(),
      shareOfHours: t.Number(),
    }),
  ),

  nptClasses: t.Array(
    t.Object({
      waitingNptClassId: t.Nullable(t.Number()),
      name: t.String(),
      events: t.Number(),
      hours: t.Number(),
    }),
  ),

  operationPhases: t.Array(
    t.Object({
      waitingOperationPhaseId: t.Nullable(t.Number()),
      name: t.String(),
      events: t.Number(),
      hours: t.Number(),
    }),
  ),

  shifts: t.Array(
    t.Object({
      waitingShiftId: t.Nullable(t.Number()),
      name: t.String(),
      events: t.Number(),
      hours: t.Number(),
    }),
  ),

  topEvents: t.Array(
    t.Object({
      waitingEventId: t.Number(),
      eventCode: t.Nullable(t.String()),
      startDateTime: t.Date(),
      endDateTime: t.Date(),
      durationHours: t.Number(),

      reason: t.Nullable(
        t.Object({
          code: t.String(),
          nameEn: t.String(),
          nameFa: t.Nullable(t.String()),
        }),
      ),

      reasonGroup: t.Nullable(t.String()),
      operationPhase: t.Nullable(t.String()),
      nptClass: t.Nullable(t.String()),
    }),
  ),
});

const WaitingDashboardSchema = t.Object({
  summary: t.Object({
    totalHours: t.Number(),
    totalEvents: t.Number(),
    installationsWithWaiting: t.Number(),
    daysWithWaiting: t.Number(),
    averageDurationHours: t.Number(),
  }),

  worstInstallation: t.Nullable(
    t.Object({
      instId: t.Number(),
      name: t.String(),
      hours: t.Number(),
      events: t.Number(),
    }),
  ),

  topReason: t.Nullable(
    t.Object({
      waitingReasonId: t.Nullable(t.Number()),
      reasonCode: t.String(),
      reasonNameEn: t.String(),
      reasonNameFa: t.Nullable(t.String()),
      hours: t.Number(),
      events: t.Number(),
    }),
  ),

  installations: t.Array(
    t.Object({
      instId: t.Number(),
      name: t.String(),
      caption: t.Nullable(t.String()),
      hours: t.Number(),
      events: t.Number(),
      daysWithWaiting: t.Number(),
      averageDurationHours: t.Number(),
    }),
  ),

  reasonGroups: t.Array(
    t.Object({
      waitingReasonGroupId: t.Nullable(t.Number()),
      name: t.String(),
      hours: t.Number(),
      events: t.Number(),
      shareOfHours: t.Number(),
    }),
  ),

  rigReasonGroups: t.Array(
    t.Object({
      instId: t.Number(),
      installationName: t.String(),
      reasonGroup: t.String(),
      hours: t.Number(),
    }),
  ),

  monthly: t.Array(
    t.Object({
      month: t.String(),
      hours: t.Number(),
      events: t.Number(),
    }),
  ),
});

export const ControllerWaiting = new Elysia()
  .use(authPlugin)
  .group("/waiting", (app) =>
    app

      // =====================================================
      // WAITING ANALYSIS
      // =====================================================
      .get(
        "/analysis",
        async ({ headers, query }) => {
          const instId = Number(query.instId ?? headers["x-inst-id"] ?? 0);

          if (!instId) {
            throw new Error("Installation ID is required");
          }

          const startDate = query.startDate
            ? new Date(query.startDate)
            : undefined;

          const endDate = query.endDate ? new Date(query.endDate) : undefined;

          const where = {
            instId,

            ...(startDate || endDate
              ? {
                  startDateTime: {
                    ...(startDate ? { gte: startDate } : {}),
                    ...(endDate ? { lte: endDate } : {}),
                  },
                }
              : {}),
          };

          const events = await prisma.tblWaitingEvent.findMany({
            where,

            include: {
              tblWaitingReason: {
                include: {
                  tblWaitingReasonGroup: true,
                },
              },

              tblWaitingReasonGroup: true,
              tblWaitingNptClass: true,
              tblWaitingOperationPhase: true,
              tblWaitingShift: true,
            },

            orderBy: {
              durationHours: "desc",
            },
          });

          // ===============================================
          // SUMMARY
          // ===============================================

          const totalEvents = events.length;

          const totalHours = events.reduce(
            (sum, item) => sum + Number(item.durationHours),
            0,
          );

          const averageDurationHours =
            totalEvents > 0 ? totalHours / totalEvents : 0;

          const waitingDays = new Set(
            events.map((item) => {
              const date = item.startDateTime;

              return [date.getFullYear(), date.getMonth(), date.getDate()].join(
                "-",
              );
            }),
          );

          // ===============================================
          // REASON GROUPS
          // ===============================================

          const reasonGroupMap = new Map<
            string,
            {
              waitingReasonGroupId: number | null;
              name: string;
              events: number;
              hours: number;
            }
          >();

          for (const event of events) {
            const group =
              event.tblWaitingReason?.tblWaitingReasonGroup ??
              event.tblWaitingReasonGroup;

            const key = group?.waitingReasonGroupId
              ? String(group.waitingReasonGroupId)
              : "unknown";

            const name = group?.groupName ?? "Unspecified";

            const current = reasonGroupMap.get(key) ?? {
              waitingReasonGroupId: group?.waitingReasonGroupId ?? null,
              name,
              events: 0,
              hours: 0,
            };

            current.events += 1;
            current.hours += Number(event.durationHours);

            reasonGroupMap.set(key, current);
          }

          const reasonGroups = [...reasonGroupMap.values()]
            .map((item) => ({
              ...item,
              shareOfHours: totalHours > 0 ? item.hours / totalHours : 0,
            }))
            .sort((a, b) => b.hours - a.hours);

          // ===============================================
          // REASONS
          // ===============================================

          const reasonMap = new Map<
            string,
            {
              waitingReasonId: number | null;
              reasonCode: string;
              reasonNameEn: string;
              reasonNameFa: string | null;
              reasonGroup: string | null;
              events: number;
              hours: number;
            }
          >();

          for (const event of events) {
            const reason = event.tblWaitingReason;

            const key = reason?.waitingReasonId
              ? String(reason.waitingReasonId)
              : "unknown";

            const current = reasonMap.get(key) ?? {
              waitingReasonId: reason?.waitingReasonId ?? null,
              reasonCode: reason?.reasonCode ?? "CUSTOM",
              reasonNameEn:
                reason?.reasonNameEn ?? event.customReason ?? "Unspecified",
              reasonNameFa: reason?.reasonNameFa ?? null,
              reasonGroup:
                reason?.tblWaitingReasonGroup?.groupName ??
                event.tblWaitingReasonGroup?.groupName ??
                null,
              events: 0,
              hours: 0,
            };

            current.events += 1;
            current.hours += Number(event.durationHours);

            reasonMap.set(key, current);
          }

          const reasons = [...reasonMap.values()]
            .map((item) => ({
              ...item,
              shareOfHours: totalHours > 0 ? item.hours / totalHours : 0,
            }))
            .sort((a, b) => b.hours - a.hours);

          // ===============================================
          // NPT CLASS
          // ===============================================

          const nptClassMap = new Map<
            string,
            {
              waitingNptClassId: number | null;
              name: string;
              events: number;
              hours: number;
            }
          >();

          for (const event of events) {
            const item = event.tblWaitingNptClass;

            const key = item?.waitingNptClassId
              ? String(item.waitingNptClassId)
              : "unknown";

            const current = nptClassMap.get(key) ?? {
              waitingNptClassId: item?.waitingNptClassId ?? null,
              name: item?.nptClassName ?? "Unspecified",
              events: 0,
              hours: 0,
            };

            current.events += 1;
            current.hours += Number(event.durationHours);

            nptClassMap.set(key, current);
          }

          const nptClasses = [...nptClassMap.values()].sort(
            (a, b) => b.hours - a.hours,
          );

          // ===============================================
          // OPERATION PHASE
          // ===============================================

          const operationPhaseMap = new Map<
            string,
            {
              waitingOperationPhaseId: number | null;
              name: string;
              events: number;
              hours: number;
            }
          >();

          for (const event of events) {
            const item = event.tblWaitingOperationPhase;

            const key = item?.waitingOperationPhaseId
              ? String(item.waitingOperationPhaseId)
              : "unknown";

            const current = operationPhaseMap.get(key) ?? {
              waitingOperationPhaseId: item?.waitingOperationPhaseId ?? null,
              name: item?.phaseName ?? "Unspecified",
              events: 0,
              hours: 0,
            };

            current.events += 1;
            current.hours += Number(event.durationHours);

            operationPhaseMap.set(key, current);
          }

          const operationPhases = [...operationPhaseMap.values()].sort(
            (a, b) => b.hours - a.hours,
          );

          // ===============================================
          // SHIFT
          // ===============================================

          const shiftMap = new Map<
            string,
            {
              waitingShiftId: number | null;
              name: string;
              events: number;
              hours: number;
            }
          >();

          for (const event of events) {
            const item = event.tblWaitingShift;

            const key = item?.waitingShiftId
              ? String(item.waitingShiftId)
              : "unknown";

            const current = shiftMap.get(key) ?? {
              waitingShiftId: item?.waitingShiftId ?? null,
              name: item?.shiftName ?? "Unspecified",
              events: 0,
              hours: 0,
            };

            current.events += 1;
            current.hours += Number(event.durationHours);

            shiftMap.set(key, current);
          }

          const shifts = [...shiftMap.values()].sort(
            (a, b) => b.hours - a.hours,
          );

          // ===============================================
          // TOP EVENTS
          // ===============================================

          const topEvents = events.slice(0, 10).map((event) => ({
            waitingEventId: event.waitingEventId,
            eventCode: event.eventCode,

            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,

            durationHours: Number(event.durationHours),

            reason: event.tblWaitingReason
              ? {
                  code: event.tblWaitingReason.reasonCode,
                  nameEn: event.tblWaitingReason.reasonNameEn,
                  nameFa: event.tblWaitingReason.reasonNameFa,
                }
              : null,

            reasonGroup:
              event.tblWaitingReason?.tblWaitingReasonGroup?.groupName ??
              event.tblWaitingReasonGroup?.groupName ??
              null,

            operationPhase: event.tblWaitingOperationPhase?.phaseName ?? null,

            nptClass: event.tblWaitingNptClass?.nptClassName ?? null,
          }));

          return {
            summary: {
              totalEvents,
              totalHours,
              averageDurationHours,
              daysWithWaiting: waitingDays.size,
            },

            reasonGroups,
            reasons,
            nptClasses,
            operationPhases,
            shifts,
            topEvents,
          };
        },

        {
          query: t.Object({
            instId: t.Optional(t.Numeric()),
            startDate: t.Optional(t.String()),
            endDate: t.Optional(t.String()),
          }),

          response: WaitingAnalysisSchema,

          detail: {
            tags: ["Waiting"],
            summary: "Waiting analysis by installation",
          },
        },
      )

      // =====================================================
      // WAITING DASHBOARD
      // =====================================================
      .get(
        "/dashboard",
        async ({ query }) => {
          const startDate = query.startDate
            ? new Date(query.startDate)
            : undefined;

          const endDate = query.endDate ? new Date(query.endDate) : undefined;

          const instId = query.instId ? Number(query.instId) : undefined;

          const events = await prisma.tblWaitingEvent.findMany({
            where: {
              ...(instId ? { instId } : {}),

              ...(startDate || endDate
                ? {
                    startDateTime: {
                      ...(startDate ? { gte: startDate } : {}),
                      ...(endDate ? { lte: endDate } : {}),
                    },
                  }
                : {}),
            },

            include: {
              tblInstallation: true,

              tblWaitingReason: {
                include: {
                  tblWaitingReasonGroup: true,
                },
              },

              tblWaitingReasonGroup: true,
            },
          });

          // ===============================================
          // SUMMARY
          // ===============================================

          const totalEvents = events.length;

          const totalHours = events.reduce(
            (sum, item) => sum + Number(item.durationHours),
            0,
          );

          const installationIds = new Set(events.map((item) => item.instId));

          const waitingDays = new Set(
            events.map((item) => {
              const date = item.startDateTime;

              return [date.getFullYear(), date.getMonth(), date.getDate()].join(
                "-",
              );
            }),
          );

          // ===============================================
          // INSTALLATIONS
          // ===============================================

          const installationMap = new Map<
            number,
            {
              instId: number;
              name: string;
              caption: string | null;
              hours: number;
              events: number;
              days: Set<string>;
            }
          >();

          for (const event of events) {
            const installation = event.tblInstallation;

            const current = installationMap.get(event.instId) ?? {
              instId: installation.instId,
              name: installation.name,
              caption: installation.caption,
              hours: 0,
              events: 0,
              days: new Set<string>(),
            };

            current.hours += Number(event.durationHours);
            current.events += 1;

            current.days.add(event.startDateTime.toISOString().slice(0, 10));

            installationMap.set(event.instId, current);
          }

          const installations = [...installationMap.values()]
            .map((item) => ({
              instId: item.instId,
              name: item.name,
              caption: item.caption,

              hours: item.hours,
              events: item.events,

              daysWithWaiting: item.days.size,

              averageDurationHours:
                item.events > 0 ? item.hours / item.events : 0,
            }))
            .sort((a, b) => b.hours - a.hours);

          const worstInstallation = installations[0]
            ? {
                instId: installations[0].instId,
                name: installations[0].name,
                hours: installations[0].hours,
                events: installations[0].events,
              }
            : null;

          // ===============================================
          // REASON GROUPS
          // ===============================================

          const reasonGroupMap = new Map<
            string,
            {
              waitingReasonGroupId: number | null;
              name: string;
              hours: number;
              events: number;
            }
          >();

          for (const event of events) {
            const group =
              event.tblWaitingReason?.tblWaitingReasonGroup ??
              event.tblWaitingReasonGroup;

            const key = group?.waitingReasonGroupId
              ? String(group.waitingReasonGroupId)
              : "unknown";

            const current = reasonGroupMap.get(key) ?? {
              waitingReasonGroupId: group?.waitingReasonGroupId ?? null,

              name: group?.groupName ?? "Unspecified",

              hours: 0,
              events: 0,
            };

            current.hours += Number(event.durationHours);
            current.events += 1;

            reasonGroupMap.set(key, current);
          }

          const reasonGroups = [...reasonGroupMap.values()]
            .map((item) => ({
              ...item,

              shareOfHours: totalHours > 0 ? item.hours / totalHours : 0,
            }))
            .sort((a, b) => b.hours - a.hours);

          // ===============================================
          // TOP REASON
          // ===============================================

          const reasonMap = new Map<
            string,
            {
              waitingReasonId: number | null;
              reasonCode: string;
              reasonNameEn: string;
              reasonNameFa: string | null;
              hours: number;
              events: number;
            }
          >();

          for (const event of events) {
            const reason = event.tblWaitingReason;

            const key = reason?.waitingReasonId
              ? String(reason.waitingReasonId)
              : "unknown";

            const current = reasonMap.get(key) ?? {
              waitingReasonId: reason?.waitingReasonId ?? null,

              reasonCode: reason?.reasonCode ?? "CUSTOM",

              reasonNameEn:
                reason?.reasonNameEn ?? event.customReason ?? "Unspecified",

              reasonNameFa: reason?.reasonNameFa ?? null,

              hours: 0,
              events: 0,
            };

            current.hours += Number(event.durationHours);
            current.events += 1;

            reasonMap.set(key, current);
          }

          const reasons = [...reasonMap.values()].sort(
            (a, b) => b.hours - a.hours,
          );

          const topReason = reasons[0] ?? null;

          // ===============================================
          // RIG × REASON GROUP
          // For Heatmap
          // ===============================================

          const rigReasonGroupMap = new Map<
            string,
            {
              instId: number;
              installationName: string;
              reasonGroup: string;
              hours: number;
            }
          >();

          for (const event of events) {
            const group =
              event.tblWaitingReason?.tblWaitingReasonGroup ??
              event.tblWaitingReasonGroup;

            const groupName = group?.groupName ?? "Unspecified";

            const key = `${event.instId}-${groupName}`;

            const current = rigReasonGroupMap.get(key) ?? {
              instId: event.instId,
              installationName: event.tblInstallation.name,
              reasonGroup: groupName,
              hours: 0,
            };

            current.hours += Number(event.durationHours);

            rigReasonGroupMap.set(key, current);
          }

          const rigReasonGroups = [...rigReasonGroupMap.values()];

          // ===============================================
          // MONTHLY TREND
          // Gregorian YYYY-MM
          // Frontend can convert to Jalali
          // ===============================================

          const monthlyMap = new Map<
            string,
            {
              month: string;
              hours: number;
              events: number;
            }
          >();

          for (const event of events) {
            const month = event.startDateTime.toISOString().slice(0, 7);

            const current = monthlyMap.get(month) ?? {
              month,
              hours: 0,
              events: 0,
            };

            current.hours += Number(event.durationHours);
            current.events += 1;

            monthlyMap.set(month, current);
          }

          const monthly = [...monthlyMap.values()].sort((a, b) =>
            a.month.localeCompare(b.month),
          );

          return {
            summary: {
              totalHours,
              totalEvents,

              installationsWithWaiting: installationIds.size,

              daysWithWaiting: waitingDays.size,

              averageDurationHours:
                totalEvents > 0 ? totalHours / totalEvents : 0,
            },

            worstInstallation,
            topReason,

            installations,
            reasonGroups,
            rigReasonGroups,
            monthly,
          };
        },

        {
          query: t.Object({
            instId: t.Optional(t.Numeric()),
            startDate: t.Optional(t.String()),
            endDate: t.Optional(t.String()),
          }),

          response: WaitingDashboardSchema,

          detail: {
            tags: ["Waiting"],
            summary: "Waiting dashboard",
          },
        },
      ),
  );
