export interface WaitingFilters {
  startDate?: string;
  endDate?: string;
}

export interface WaitingSummary {
  totalHours: number;
  totalEvents: number;
  installationsWithWaiting?: number;
  daysWithWaiting: number;
  averageDurationHours: number;
}

export interface WaitingReasonGroup {
  waitingReasonGroupId: number | null;
  name: string;
  events: number;
  hours: number;
  shareOfHours: number;
}

export interface WaitingReason {
  waitingReasonId: number | null;
  reasonCode: string;
  reasonNameEn: string;
  reasonNameFa: string | null;
  reasonGroup: string | null;
  events: number;
  hours: number;
  shareOfHours: number;
}

export interface WaitingDashboardData {
  summary: WaitingSummary;

  worstInstallation: {
    instId: number;
    name: string;
    hours: number;
    events: number;
  } | null;

  topReason: {
    waitingReasonId: number | null;
    reasonCode: string;
    reasonNameEn: string;
    reasonNameFa: string | null;
    hours: number;
    events: number;
  } | null;

  installations: {
    instId: number;
    name: string;
    caption: string | null;
    hours: number;
    events: number;
    daysWithWaiting: number;
    averageDurationHours: number;
  }[];

  reasonGroups: WaitingReasonGroup[];

  rigReasonGroups: {
    instId: number;
    installationName: string;
    reasonGroup: string;
    hours: number;
  }[];

  monthly: {
    month: string;
    hours: number;
    events: number;
  }[];
}

export interface WaitingAnalysisData {
  summary: WaitingSummary;

  reasonGroups: WaitingReasonGroup[];
  reasons: WaitingReason[];

  nptClasses: {
    waitingNptClassId: number | null;
    name: string;
    events: number;
    hours: number;
  }[];

  operationPhases: {
    waitingOperationPhaseId: number | null;
    name: string;
    events: number;
    hours: number;
  }[];

  shifts: {
    waitingShiftId: number | null;
    name: string;
    events: number;
    hours: number;
  }[];

  topEvents: {
    waitingEventId: number;
    eventCode: string | null;
    startDateTime: string;
    endDateTime: string;
    durationHours: number;

    reason: {
      code: string;
      nameEn: string;
      nameFa: string | null;
    } | null;

    reasonGroup: string | null;
    operationPhase: string | null;
    nptClass: string | null;
  }[];
}
