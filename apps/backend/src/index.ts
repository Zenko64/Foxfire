/**
 * @name Index
 * @description Foxfire Backend Entrypoint.
 * @author Simi
 */
import { serveHttp } from "./core/http";
import logger from "./core/logger";
import { checkDb } from "./db";

console.log(
	`
  ___        ___ _         
 | __|____ _| __(_)_ _ ___ 
 | _/ _ \\ \\ / _|| | '_/ -_)
 |_|\\___/_\\_\\_| |_|_| \\___|
                           
`,
);
logger.info("Starting up FoxFire...");
(async () => {
	await checkDb();
})().then(() => {
	serveHttp();
	logger.info("Foxfire Running!");
});
