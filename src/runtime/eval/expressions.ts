import { AssignmentExpression, BinaryExpression, Identifier } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { MK_NULL, NumberValue, RuntimeValue } from "../values";

function evaluateNumericBinaryExpression(lhs: NumberValue, rhs: NumberValue, operator: string): NumberValue {
    let value: number = 0;

    switch (operator) {
        case '+': value = lhs.value + rhs.value; break;
        case '-': value = lhs.value - rhs.value; break;
        case '*': value = lhs.value * rhs.value; break;
        case '/': value = lhs.value / rhs.value; break;
        case '%': value = lhs.value % rhs.value; break;
        default: {
            console.error('This binary operator has not yet been setup for interplation.', operator);
            process.exit(1);
        }
    }

    return { value, type: 'number' }
}

/**
 * Evaluates a binary expression by evaluating its left and right operands and applying the operator.
 * @param binop - The binary expression to evaluate.
 * @param env - The environment to use for evaluation.
 * @returns The value of the evaluated binary expression.
 */
export function evaluateBinaryExpression(binop: BinaryExpression, env: Environment): RuntimeValue {

    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (
        !(lhs.type === 'number' && rhs.type === 'number')
    ) {
        return MK_NULL()
    }

    return evaluateNumericBinaryExpression(lhs as NumberValue, rhs as NumberValue, binop.operator);

}

/**
 * Evaluates an identifier by looking up its value in the environment.
 * @param identifier - The identifier to evaluate.
 * @param env - The environment to use for evaluation.
 * @returns The value of the evaluated identifier.
 */
export function evaluateIdentifier(identifier: Identifier, env: Environment): RuntimeValue {
    const value = env.lookup(identifier.symbol);
    return value;
}


/**
 * Evaluates an assignment expression by assigning a new value to the variable in the environment.
 * @param node - The assignment expression to evaluate.
 * @param env - The environment to use for evaluation.
 * @returns The new value of the variable.
 */
export function evaluateAssignment(node: AssignmentExpression, env: Environment): RuntimeValue {
    if (node.asignee.kind !== 'Identifier') {
        console.error('Invalid LHS of assignment expression. Expected identifier.', JSON.stringify(node.asignee));
        process.exit(1);
    }

    const name = (node.asignee as Identifier).symbol;
    return env.assign(name, evaluate(node.value, env));
}
