import { evaluate } from "../runtime/interpreter";
import assert from "assert";
import Environment from "../runtime/environment";
import { NumericLiteral, Identifier, AssignmentExpression, BinaryExpression, Program, VariableDeclaration } from "../frontend/ast";
import { RuntimeValue } from "../runtime/values";

describe("interpreter", () => {
    describe("evaluate", () => {
        it("should evaluate a numeric literal", () => {
            const ast: NumericLiteral = { kind: "NumericLiteral", value: 42 };
            const env = new Environment();
            const expected = { type: "number", value: 42 };
            const actual = evaluate(ast, env);
            assert.deepEqual(actual, expected);
        });

        it("should evaluate an identifier", () => {
            const ast: Identifier = { kind: "Identifier", symbol: "x" };
            const env = new Environment();
            env.declare("x", { type: "number", value: 42 } as RuntimeValue, false);
            const expected = { type: "number", value: 42 };
            const actual = evaluate(ast, env);
            assert.deepEqual(actual, expected);
        });

        it("should evaluate an assignment expression", () => {
            const ast: AssignmentExpression = {
                kind: "AssignmentExpression",
                asignee: { kind: 'Identifier', symbol: 'a' } as Identifier,
                value: { kind: 'NumericLiteral', value: 42 } as NumericLiteral
            }
            const env = new Environment();
            env.declare('a', { type: 'number', value: 42 } as RuntimeValue, false)
            const expected = { type: "number", value: 42 };
            const actual = evaluate(ast, env);
            assert.deepEqual(actual, expected);
            assert.deepEqual(env.lookup("a"), expected);
        });

        it("should evaluate a binary expression", () => {
            const ast: BinaryExpression = {
                kind: "BinaryExpression", operator: "+", left: { kind: "NumericLiteral", value: 40 } as NumericLiteral, right: { kind: "NumericLiteral", value: 2 } as NumericLiteral
            };
            const env = new Environment();
            const expected = { type: "number", value: 42 };
            const actual = evaluate(ast, env);
            assert.deepEqual(actual, expected);
        });

        it("should evaluate a program", () => {
            const ast: Program = {
                kind: "Program", body: [{ kind: "NumericLiteral", value: 42 } as NumericLiteral]
            };
            const env = new Environment();
            const expected = { type: "number", value: 42 };
            const actual = evaluate(ast, env);
            assert.deepEqual(actual, expected);
        });

        it("should evaluate a variable declaration", () => {
            const ast: VariableDeclaration = {
                kind: "VariableDeclaration",
                constant: false, identifier: 'x',
                value: { kind: "NumericLiteral", value: 42 } as NumericLiteral
            };
            const env = new Environment();
            const expected = { type: "number", value: 42 };
            const actual = evaluate(ast, env);
            assert.deepEqual(actual, expected);
            assert.deepEqual(env.lookup("x"), expected);
        });

        /*
        it("should throw an error for an unknown AST node", () => {
            assert.throws(
                () => evaluate(
                    { kind: "UnknownNode" } as any, new Environment()
                ), /This AST Node has not yet been setup for interplation/
            );
        });
        */
    });
});