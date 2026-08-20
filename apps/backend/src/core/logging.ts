import winston from "winston";
import { env } from "./env";

const { combine, prettyPrint, timestamp, align, printf } = winston.format;

export default winston.createLogger({
	level: env.NODE_ENV === "development" ? "info" : "error",
	format: combine(
		timestamp(),
		prettyPrint({ colorize: true }),
		align(),
		printf((info) => `[${info.level}]: ${info.message}`),
	),
});
