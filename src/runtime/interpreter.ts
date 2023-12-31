import { RuntimeValue } from './values';
import { AssignmentExpression, BinaryExpression, CallExpression, Identifier, NumericLiteral, ObjectLiteral, Program, Statement, VariableDeclaration } from '../frontend/ast';
import Environment from './environment';
import { evaluateProgram, evaluateVariableDeclaration } from './eval/statements';
import { evaluateAssignment, evaluateBinaryExpression, evaluateCallExpression, evaluateIdentifier, evaluateObjectExpression } from './eval/expressions';

/**
 * Evaluates an AST node and returns a runtime value.
 * @param ast - The AST node to evaluate.
 * @param env - The environment to use for evaluation.
 * @returns The runtime value of the AST node.
 */
export function evaluate(ast: Statement, env: Environment): RuntimeValue {

    // Determine the kind of AST node and evaluate it accordingly.
    switch (ast.kind) {
        case 'NumericLiteral':
            // Evaluate a numeric literal
            return {
                type: 'number',
                value: Number((ast as NumericLiteral).value)
            } as RuntimeValue;

        case 'Identifier':
            // Evaluate an identifier
            return evaluateIdentifier(ast as Identifier, env);

        case 'ObjectLiteral':
            // Evaluate an object literal
            return evaluateObjectExpression(ast as ObjectLiteral, env);

        case 'CallExpression':
            // Evaluate an function call literal
            return evaluateCallExpression(ast as CallExpression, env);

        case 'AssignmentExpression':
            // Evaluate an assignment expression
            return evaluateAssignment(ast as AssignmentExpression, env);

        case 'BinaryExpression':
            // Evaluate a binary expression
            return evaluateBinaryExpression(ast as BinaryExpression, env);

        case 'Program':
            // Evaluate a program
            return evaluateProgram(ast as Program, env);


        // Handle statements
        case 'VariableDeclaration':
            // Evaluate a variable declaration
            return evaluateVariableDeclaration(ast as VariableDeclaration, env);

        // Handle unknown AST nodes
        default:
            console.error('This AST Node has not yet been setup for interplation.', ast);
            process.exit(1);
    }


}