import winston from "winston";
import { env } from "./env";

const { combine, timestamp, align, printf } = winston.format;

export default winston.createLogger({
	level: env.NODE_ENV === "development" ? "info" : "error",
	format: combine(
		timestamp(),
		align(),
		printf((info) => `[${info.level}]: ${info.message}`),
	),
	transports: [new winston.transports.Console()],
});
