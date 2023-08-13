import chalk from "chalk";

/**
 * Logs an info message to the console with a blue background and white text.
 * @param args - The arguments to log.
 */
export function info(...args: any[]) {
    console.info(
        chalk.bgBlue.white(' INFO '),
        ...args
    )
}

/**
 * Logs a warning message to the console with a yellow background and black text.
 * @param args - The arguments to log.
 */
export function warn(...args: any[]) {
    console.warn(
        chalk.bgYellow.black(' WARN '),
        ...args
    )
}

/**
 * Logs an error message to the console with a red background and white text.
 * @param args - The arguments to log.
 */
export function error(...args: any[]) {
    console.error(
        chalk.bgRed.white(' ERROR '),
        ...args
    )
}