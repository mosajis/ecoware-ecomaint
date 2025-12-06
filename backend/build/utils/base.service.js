export class BaseService {
    model;
    maxLimit;
    softDelete;
    softDeleteField;
    allowedIncludes;
    constructor(model, options = {}) {
        this.model = model;
        this.maxLimit = options.maxLimit ?? 5000;
        this.softDelete = options.softDelete ?? false;
        this.softDeleteField = options.softDeleteField ?? "deletedAt";
        this.allowedIncludes = options.allowedIncludes ?? [];
    }
    // 🧠 ایجاد رکورد جدید
    async create(data) {
        return this.model.create({ data });
    }
    // 🧱 دریافت همه با فیلتر، pagination و include امن
    async findAll({ where = {}, orderBy = { createdAt: "desc" }, include = {}, page = 1, perPage = 20, skip = undefined, take = undefined, } = {}) {
        // Soft-delete filter
        if (this.softDelete) {
            where[this.softDeleteField] = null;
        }
        // Safe pagination
        const safePerPage = Math.min(Number(perPage) || 20, this.maxLimit);
        const safeSkip = skip ?? (page && perPage ? (page - 1) * safePerPage : undefined);
        // Include whitelist
        const safeInclude = Object.fromEntries(Object.entries(include).filter(([key]) => this.allowedIncludes.includes(key)));
        const [items, total] = await Promise.all([
            this.model.findMany({
                where,
                orderBy,
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
    async findOne(where, include = {}) {
        if (this.softDelete) {
            where[this.softDeleteField] = null;
        }
        const safeInclude = Object.fromEntries(Object.entries(include).filter(([key]) => this.allowedIncludes.includes(key)));
        return this.model.findFirst({ where, include: include });
    }
    // ✏️ بروزرسانی
    async update(where, data) {
        return this.model.update({ where, data });
    }
    // ❌ حذف (soft یا hard)
    async delete(where, { force = false } = {}) {
        if (this.softDelete && !force) {
            return this.model.update({
                where,
                data: { [this.softDeleteField]: new Date() },
            });
        }
        return this.model.delete({ where });
    }
    // ❌ حذف همه با فیلتر
    async deleteAll(where = {}, { force = false } = {}) {
        if (this.softDelete && !force) {
            return this.model.updateMany({
                where,
                data: { [this.softDeleteField]: new Date() },
            });
        }
        return this.model.deleteMany({ where });
    }
    // 🔢 شمارش رکوردها
    async count(where = {}) {
        if (this.softDelete) {
            where[this.softDeleteField] = null;
        }
        return this.model.count({ where });
    }
}
