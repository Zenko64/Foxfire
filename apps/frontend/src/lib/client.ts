import { hc } from "hono/client";
import type { AppType } from "../../../backend/src/core/http/index";

export const client = hc<AppType>("/");
