import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'fs';

// Create a readline interface for user input/output.
const rl = createInterface({ input, output });

import Parser from "./frontend/parser";
import { evaluate } from './runtime/interpreter';
import { createGlobalEnvironment } from './runtime/environment';

// Define an async function for the REPL
async function repl() {
    // Create a new parser and environment for each loop
    const parser = new Parser();
    const env = createGlobalEnvironment();

    // Print a welcome message
    console.log(`\nWraithScript REPL v0.0.1dev`);

    // Loop until the user exits
    while (true) {

        // Get user input
        const input = await rl.question('> ');

        // Exit if the user enters nothing or "exit"
        if (!input || input === 'exit') {
            process.exit(0);
        }

        // Parse the user input into an AST
        const program = parser.produceAST(input);

        // Evaluate the AST and print the result
        const result = evaluate(program, env);
        console.log(result);
    }
}

/**
 * Runs a WraithScript file.
 * @param filename The path to the file to run.
 */
async function run(filename: string) {
    const parser = new Parser();
    const env = createGlobalEnvironment();

    // Read the file
    const file = fs.readFileSync(filename, 'utf-8');

    // Parse the file into an AST
    const program = parser.produceAST(file);

    // Evaluate the AST and print the result
    const result = evaluate(program, env);
    console.log(result);

    // Exit with a status code of 0
    process.exit(0);
}

/**
 * Parses command-line arguments and runs the appropriate command.
 */
function main(): void {
    if (process.argv.length === 2) {
        repl();
    } else if (process.argv.length === 3) {
        run(process.argv[2]);
    } else {
        console.log('Usage: wraithscript [filename]');
        process.exit(1);
    }
}

main();