import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { getAuthToken } from "./auth";
import { api } from "./testApp";

type SkipMap = Partial<
  Record<
    "unauthorized" | "create" | "getOne" | "update" | "list" | "delete",
    boolean
  >
>;

export interface CrudTestOptions<
  TCreate extends Record<string, any>,
  TUpdate extends Record<string, any>,
> {
  name: string;
  path: string;
  primaryKey: string;
  buildCreatePayload: () => TCreate;
  buildUpdatePayload: () => TUpdate;
  assertCreated?: (created: any, payload: TCreate) => void;
  assertUpdated?: (updated: any, payload: TUpdate) => void;
  skip?: SkipMap;
}

const KEEP_TEST_DATA = process.env.KEEP_TEST_DATA === "true";

export function runCrudIntegrationTests<
  TCreate extends Record<string, any>,
  TUpdate extends Record<string, any>,
>(options: CrudTestOptions<TCreate, TUpdate>) {
  const {
    name,
    path,
    primaryKey,
    buildCreatePayload,
    buildUpdatePayload,
    assertCreated,
    assertUpdated,
    skip = {},
  } = options;

  describe(`${name} CRUD (integration)`, () => {
    let token: string;
    let createdId: number | string | undefined;

    beforeAll(async () => {
      token = await getAuthToken();
    });

    afterAll(async () => {
      if (createdId && !KEEP_TEST_DATA) {
        await api("DELETE", `${path}/${createdId}?force=true`, { token });
      } else if (createdId && KEEP_TEST_DATA) {
        console.log(`Created Record ID: ${primaryKey}=${createdId}`);
      }
    });

    if (!skip.unauthorized) {
      it("Send 401 without token", async () => {
        const { status } = await api("GET", path);
        expect(status).toBe(401);
      });
    }

    if (!skip.create) {
      it("Create new record (CREATE)", async () => {
        const payload = buildCreatePayload();
        const { status, json } = await api("POST", path, {
          token,
          body: payload,
        });

        expect(status).toBe(200);
        expect(json).toHaveProperty(primaryKey);
        createdId = json[primaryKey];
        assertCreated?.(json, payload);
      });
    }

    if (!skip.getOne) {
      it("Get created record (GET-ONE)", async () => {
        const { status, json } = await api("GET", `${path}/${createdId}`, {
          token,
        });
        expect(status).toBe(200);
        expect(json[primaryKey]).toBe(createdId);
      });
    }

    if (!skip.update) {
      it("Update created record (UPDATE-ONE)", async () => {
        const payload = buildUpdatePayload();
        const { status, json } = await api("PUT", `${path}/${createdId}`, {
          token,
          body: payload,
        });

        expect(status).toBe(200);
        assertUpdated?.(json, payload);
      });
    }

    if (!skip.list) {
      it("Get all records with created record in it (GET-ALL)", async () => {
        const filter = encodeURIComponent(
          JSON.stringify({ [primaryKey]: createdId }),
        );
        const { status, json } = await api("GET", `${path}?filter=${filter}`, {
          token,
        });

        expect(status).toBe(200);
        expect(json.items.length).toBe(1);
        expect(json.items[0][primaryKey]).toBe(createdId);
      });
    }

    if (!skip.delete) {
      it("Delete created Record (DELETE-ONE)", async () => {
        const { status } = await api(
          "DELETE",
          `${path}/${createdId}?force=true`,
          { token },
        );
        expect(status).toBe(200);

        const check = await api("GET", `${path}/${createdId}`, { token });
        expect(check.status).not.toBe(200);

        createdId = undefined;
      });
    }
  });
}
