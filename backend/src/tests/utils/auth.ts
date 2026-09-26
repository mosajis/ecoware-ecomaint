import { api } from "./testApp";

const TEST_USERNAME = process.env.TEST_USERNAME ?? "";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "";

let cachedToken: string | null = null;
let inFlight: Promise<string> | null = null;

export async function getAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    if (!TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error(
        "Set TEST_USERNAME / TEST_PASSWORD in .env to get auth token",
      );
    }

    const { status, json } = await api("POST", "/auth/login", {
      body: { username: TEST_USERNAME, password: TEST_PASSWORD },
    });

    if (status !== 200 || !json?.accessToken) {
      throw new Error(
        `Test login failed: status=${status} body=${JSON.stringify(json)}`,
      );
    }

    cachedToken = json.accessToken as string;
    return cachedToken;
  })();

  return inFlight;
}
