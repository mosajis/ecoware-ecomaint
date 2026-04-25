// base.service.ts
interface BaseServiceOptions {
  maxLimit?: number;
  softDelete?: boolean;
  softDeleteField?: string;
  allowedIncludes?: string[];
}

export class BaseService<T extends { id: any }> {
  private model: any;
  private maxLimit: number;
  private softDelete: boolean;
  private softDeleteField: string;
  private allowedIncludes: string[];

  constructor(model: any, options: BaseServiceOptions = {}) {
    this.model = model;
    this.maxLimit = options.maxLimit ?? 5000;
    this.softDelete = options.softDelete ?? false;
    this.softDeleteField = options.softDeleteField ?? "deletedAt";
    this.allowedIncludes = options.allowedIncludes ?? [];
  }

  // 🆕 بررسی وجود فیلد در model
  private async hasField(fieldName: string): Promise<boolean> {
    try {
      const sample = await this.model.findFirst({ take: 1 });
      return sample ? fieldName in sample : false;
    } catch {
      return false;
    }
  }

  // 🧠 ایجاد رکورد جدید
  async create(data: any) {
    return this.model.create({ data });
  }

  // 🧱 دریافت همه با فیلتر، pagination، include و select
  async findAll({
    where = {},
    orderBy = {},
    include = {},
    select = {}, // 🆕
    page = 1,
    perPage = 20,
    skip = undefined,
    take = undefined,
  }: any = {}) {
    // Soft-delete filter
    if (this.softDelete) {
      where[this.softDeleteField] = null;
    }

    // Safe pagination
    const safePerPage = Math.min(this.maxLimit);
    const safeSkip =
      skip ?? (page && perPage ? (page - 1) * safePerPage : undefined);

    let finalOrderBy: any[] = [];

    // اولویت اول: آیتم‌هایی که کاربر صراحتاً در ورودی orderBy فرستاده است
    if (orderBy && Object.keys(orderBy).length > 0) {
      finalOrderBy = Object.entries(orderBy).map(([field, order]) => ({
        [field]: order,
      }));
    }

    // اولویت دوم: افزودن orderNo به عنوان مرتب‌سازی ثانویه (اگر کاربر خودش آن را تنظیم نکرده باشد)
    if (await this.hasField("orderNo")) {
      const hasOrderNoInInput = Object.keys(orderBy || {}).includes("orderNo");
      if (!hasOrderNoInInput) {
        finalOrderBy.push({
          orderNo: { sort: "asc", nulls: "last" },
        });
      }
    }

    // 🆕 اگر select و include هر دو وجود دارند، select اولویت دارد
    const hasSelect = Object.keys(select).length > 0;
    const hasInclude = Object.keys(include).length > 0;

    // Query options
    const queryOptions: any = {
      where,
      orderBy: finalOrderBy,
      skip: safeSkip,
      take: take ?? safePerPage,
    };

    // 🆕 select یا include (نه هر دو)
    if (hasSelect) {
      queryOptions.select = select;
    } else if (hasInclude) {
      queryOptions.include = include;
    }

    const [items, total] = await Promise.all([
      this.model.findMany(queryOptions),
      this.model.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      perPage: safePerPage,
      totalPages: Math.ceil(total / safePerPage),
    };
  }

  // 🔍 دریافت یک رکورد
  async findOne(where: any, include: any = {}, select: any = {}) {
    // 🆕 select اضافه شد
    if (this.softDelete) {
      where[this.softDeleteField] = null;
    }

    const hasSelect = Object.keys(select).length > 0;
    const hasInclude = Object.keys(include).length > 0;

    const queryOptions: any = { where };

    // 🆕 select یا include (نه هر دو)
    if (hasSelect) {
      queryOptions.select = select;
    } else if (hasInclude) {
      queryOptions.include = include;
    }

    return this.model.findFirst(queryOptions);
  }

  // 🔄 به‌روزرسانی
  async update(where: any, data: any, include: any = {}, select: any = {}) {
    // 🆕 select اضافه شد
    await this.model.update({ where, data });

    const hasSelect = Object.keys(select).length > 0;
    const hasInclude = Object.keys(include).length > 0;

    // 🆕 بازگشت رکورد به‌روزرسانی شده با select یا include
    if (hasSelect || hasInclude) {
      return this.findOne(where, include, select);
    }

    return this.model.findFirst({ where });
  }

  // ❌ حذف (soft یا hard)
  async delete(where: any, { force = false } = {}) {
    if (this.softDelete && !force) {
      return this.model.update({
        where,
        data: { [this.softDeleteField]: new Date() },
      });
    }

    return this.model.delete({ where });
  }

  // ❌ حذف همه با فیلتر
  async deleteAll(where: any = {}, { force = false } = {}) {
    if (this.softDelete && !force) {
      return this.model.updateMany({
        where,
        data: { [this.softDeleteField]: new Date() },
      });
    }

    return this.model.deleteMany({ where });
  }

  // 🔢 شمارش رکوردها
  async count(where: any = {}) {
    if (this.softDelete) {
      where[this.softDeleteField] = null;
    }
    return this.model.count({ where });
  }
}
