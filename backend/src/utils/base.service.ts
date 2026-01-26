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

  // 🧱 دریافت همه با فیلتر، pagination و include امن
  async findAll({
    where = {},
    orderBy = { createdAt: "desc" },
    include = {},
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
    const safePerPage = Math.min(Number(perPage) || 20, this.maxLimit);
    const safeSkip =
      skip ?? (page && perPage ? (page - 1) * safePerPage : undefined);

    // 🆕 اگر orderNo وجود دارد، آن را بر defaultSort اولویت دهید
    let finalOrderBy = orderBy;
    if (await this.hasField("orderNo")) {
      finalOrderBy = {
        orderNo: { sort: "asc", nulls: "last" },
        ...orderBy,
      };
    }

    // Include whitelist
    const safeInclude = Object.fromEntries(
      Object.entries(include).filter(([key]) =>
        this.allowedIncludes.includes(key),
      ),
    );

    const [items, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy: finalOrderBy,
        include: include,
        skip: safeSkip,
        take: take ?? safePerPage,
      }),
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
  async findOne(where: any, include: any = {}) {
    if (this.softDelete) {
      where[this.softDeleteField] = null;
    }

    const safeInclude = Object.fromEntries(
      Object.entries(include).filter(([key]) =>
        this.allowedIncludes.includes(key),
      ),
    );

    return this.model.findFirst({ where, include: include });
  }

  // ✏️ بروزرسانی
  async update(where: any, data: any) {
    return this.model.update({ where, data });
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
