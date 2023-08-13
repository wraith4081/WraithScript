import { BinaryExpression, Identifier, AssignmentExpression, Expression, NumericLiteral } from "../frontend/ast";
import Environment from "../runtime/environment";
import { evaluateBinaryExpression, evaluateIdentifier, evaluateAssignment } from "../runtime/eval/expressions";
import { MK_NUMBER } from "../runtime/values";
import assert from "assert";

describe("expressions", () => {
    describe("evaluateBinaryExpression", () => {
        it("should evaluate a numeric binary expression", () => {
            const binop: BinaryExpression = {
                kind: "BinaryExpression",
                operator: "+",
                left: { kind: "NumericLiteral", value: 2 } as NumericLiteral,
                right: { kind: "NumericLiteral", value: 3 } as NumericLiteral
            };
            const env = new Environment();
            const expected = MK_NUMBER(5);
            const actual = evaluateBinaryExpression(binop, env);
            assert.deepEqual(actual, expected);
        });

        // TODO: Add more tests for other binary operators
    });

    describe("evaluateIdentifier", () => {
        it("should evaluate an identifier in the environment", () => {
            const identifier: Identifier = { kind: "Identifier", symbol: "x" };
            const env = new Environment();
            env.declare("x", MK_NUMBER(42));
            const expected = MK_NUMBER(42);
            const actual = evaluateIdentifier(identifier, env);
            assert.deepEqual(actual, expected);
        });
    });

    describe("evaluateAssignment", () => {
        it("should assign a value to a variable in the environment", () => {
            const node: AssignmentExpression = {
                kind: "AssignmentExpression",
                asignee: { kind: "Identifier", symbol: "x" } as Identifier,
                value: { kind: "NumericLiteral", value: 42 } as NumericLiteral
            };
            const env = new Environment();
            env.declare("x", MK_NUMBER(3), false);
            const expected = MK_NUMBER(42);
            const actual = evaluateAssignment(node, env);
            assert.deepEqual(actual, expected);
            assert.deepEqual(env.lookup("x"), expected);
        });

        it("should throw an error for an invalid LHS of assignment expression", () => {
            const node: AssignmentExpression = {
                kind: "AssignmentExpression",
                asignee: { kind: "StringLiteral", value: "x" } as any,
                value: { kind: "NumberLiteral", value: 42 } as any
            };
            const env = new Environment(undefined, true);
            assert.throws(() => evaluateAssignment(node, env, true));
        });
    });
});