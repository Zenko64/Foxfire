import { serveHttp } from "./core/http";
import logger from "./core/logger";

console.log(
	`
  ___        ___ _         
 | __|____ _| __(_)_ _ ___ 
 | _/ _ \\ \\ / _|| | '_/ -_)
 |_|\\___/_\\_\\_| |_|_| \\___|
                           
`,
);
logger.info("Starting up FoxFire...");
serveHttp();
