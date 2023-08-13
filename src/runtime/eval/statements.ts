import { Program, VariableDeclaration } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { MK_NULL, RuntimeValue } from "../values";

/**
 * Evaluates a program by evaluating each statement in the program's body.
 * @param program - The program to evaluate.
 * @param env - The environment to use for evaluation.
 * @returns The value of the last evaluated statement.
 */
export function evaluateProgram(program: Program, env: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MK_NULL();

    // Evaluate each statement in the program's body
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

/**
 * Evaluates a variable declaration by declaring a new variable in the environment.
 * @param declaration - The variable declaration to evaluate.
 * @param env - The environment to use for evaluation.
 * @returns The value of the declared variable.
 */
export function evaluateVariableDeclaration(declaration: VariableDeclaration, env: Environment): RuntimeValue {
    return env.declare(
        declaration.identifier,
        declaration.value
            ? evaluate(declaration.value, env)
            : MK_NULL(),
        declaration.constant
    );
}
