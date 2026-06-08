import { daysAgo } from "@/helper";

/**
 * محاسبه تعداد روزهای تأخیر نسبت به تاریخ سررسید
 *
 * خروجی:
 *  > 0  => دستورکار معوق (Overdue)
 *  = 0  => موعد انجام امروز است
 *  < 0  => هنوز به موعد انجام نرسیده‌ایم
 */
export const calculateOverdueDays = (
  dueDate: Date,
  referenceDate: Date = new Date(),
): number => {
  const due = new Date(dueDate);

  if (isNaN(due.getTime())) {
    return 0;
  }

  return Math.ceil(
    (referenceDate.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
  );
};

/**
 * تعیین بازه زمانی گزارش
 *
 * اولویت:
 * 1- استفاده از startDate و endDate در صورت ارسال
 * 2- استفاده از daysBack در غیر این صورت
 */
export const getDateRange = (query: any) => {
  let startDate: Date;
  let endDate = new Date();

  if (query.startDate && query.endDate) {
    startDate = new Date(query.startDate);
    endDate = new Date(query.endDate);
  } else {
    startDate = daysAgo(query.daysBack ?? 30);
  }

  return { startDate, endDate };
};
