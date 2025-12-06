import { t } from "elysia";
export const buildResponseSchema = (base, full) => {
    const baseKeys = new Set(Object.keys(base.properties));
    const relations = {};
    for (const [key, value] of Object.entries(full.properties)) {
        if (!baseKeys.has(key)) {
            relations[key] = t.Optional(value);
        }
    }
    return t.Object({
        ...base.properties,
        ...relations,
    });
};
