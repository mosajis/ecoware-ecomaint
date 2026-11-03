export type CounterAlert = {
  start: {
    lastDoneCount: number | null;
    lastDone?: Date | null;
  };
  value: {
    currentValue?: number | null;
    currentDate?: Date | null;
  };
  end: {
    nextDueCount: number | null;
    nextDueDate?: Date | null;
  };
  info: {
    compJobCounterId: number;
    componentName?: string | null;
    jobDescTitle: string;
    frequency?: number | null;
    status: boolean | null;
  };
};
