import Elysia from "elysia";
import { jwtPlugin } from "./auth.jwt";
export const authPlugin = new Elysia()
  .use(jwtPlugin)
  .guard({
    as: "scoped",
    async beforeHandle({ headers, jwt, set }) {
      const authHeader = headers["authorization"];
      if (!authHeader) {
        set.status = 401;
        return { error: "Authorization header missing" };
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        set.status = 401;
        return { error: "Invalid Authorization format" };
      }

      try {
        const payload = (await jwt.verify(token)) as any;
        if (!payload?.sub) {
          set.status = 401;
          return { error: "Invalid token" };
        }
      } catch {
        set.status = 401;
        return { error: "Token verification failed" };
      }
    },
  })
  // ✅ as: "scoped" اینجا هم لازمه
  .resolve({ as: "scoped" }, async ({ headers, jwt }) => {
    const token = headers["authorization"]!.split(" ")[1];
    const payload = (await jwt.verify(token)) as any;
    return {
      userId: payload!.sub,
      user: payload,
    };
  });
