import type { privacyEnum } from "@foxfire/types";
import type z from "zod";

export type PrivacyLevel = z.infer<typeof privacyEnum>;
