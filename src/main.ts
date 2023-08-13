import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Create a readline interface for user input/output.
const rl = createInterface({ input, output });

import Parser from "./frontend/parser";
import { evaluate } from './runtime/interpreter';
import Environment from './runtime/environment';
import { MK_NULL, MK_NUMBER, MK_BOOL } from './runtime/values';

// Define some initial values for the environment
const environments = {
    'x': MK_NUMBER(31),
    'true': MK_BOOL(true),
    'false': MK_BOOL(false),
    'null': MK_NULL()
};

// Define an async function for the REPL
!(async function repl() {
    // Create a new parser and environment for each loop
    const parser = new Parser();
    const env = new Environment();

    // Declare the initial environment values
    Object.entries(environments).forEach(key => env.declare(...key));

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
})();