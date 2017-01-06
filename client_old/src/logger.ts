import {LogManager} from 'aurelia-framework';

export var log = LogManager.getLogger('ax-client');

export class ConsoleAppender {
  debug(logger, ...rest : any[]): void {
    console.debug(`DEBUG [${logger.id}]`, ...rest);
  }

  info(logger, ...rest : any[]): void {
    console.info(`INFO [${logger.id}]`, ...rest);
  }

  warn(logger, ...rest : any[]): void {
    console.warn(`WARN [${logger.id}]`, ...rest);
  }

  error(logger, ...rest : any[]): void {
    console.error(`ERROR [${logger.id}]`, ...rest);
  }
}