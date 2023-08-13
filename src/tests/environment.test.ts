import assert from "assert";
import Environment from "../runtime/environment";
import { BooleanValue, RuntimeValue } from "../runtime/values";

describe("Environment", () => {
    describe("declare", () => {
        it("should declare a variable", () => {
            const env = new Environment(undefined, true);
            const expected = { type: "number", value: 42 } as RuntimeValue;
            const actual = env.declare("x", expected);
            assert.deepEqual(actual, expected);
            assert.deepEqual(env.lookup("x"), expected);
        });

        it("should declare a constant", () => {
            const env = new Environment(undefined, true);
            const expected = { type: "boolean", value: true } as BooleanValue;
            const actual = env.declare("x", expected, true);
            assert.deepEqual(actual, expected);
            assert.deepEqual(env.lookup("x"), expected);
            assert.throws(() => env.assign("x", { type: "boolean", value: false } as BooleanValue), /Cannot reasign to constant variable x/);
        });

        it("should throw an error for a redeclared variable", () => {
            const env = new Environment(undefined, true);
            env.declare("x", { type: "number", value: 42 } as RuntimeValue);
            assert.throws(() => env.declare("x", { type: "number", value: 43 } as RuntimeValue), /Cannot redeclare variable x/);
        });
    });

    describe("assign", () => {
        it("should assign a value to a variable", () => {
            const env = new Environment(undefined, true);
            env.declare("x", { type: "number", value: 42 } as RuntimeValue, false);
            const expected = { type: "number", value: 43 } as RuntimeValue;
            const actual = env.assign("x", expected);
            assert.deepEqual(actual, expected);
            assert.deepEqual(env.lookup("x"), expected);
        });

        it("should throw an error for an undeclared variable", () => {
            const env = new Environment(undefined, true);
            assert.throws(() => env.assign("x", { type: "number", value: 42 } as RuntimeValue), /Variable x is not defined/);
        });

        it("should throw an error for a constant variable", () => {
            const env = new Environment(undefined, true);
            env.declare("x", { type: "number", value: 42 } as RuntimeValue, true);
            assert.throws(() => env.assign("x", { type: "number", value: 43 } as RuntimeValue), /Cannot reasign to constant variable x/);
        });
    });

    describe("lookup", () => {
        it("should look up the value of a variable", () => {
            const env = new Environment(undefined, true);
            env.declare("x", { type: "number", value: 42 } as RuntimeValue);
            const expected = { type: "number", value: 42 };
            const actual = env.lookup("x");
            assert.deepEqual(actual, expected);
        });

        it("should throw an error for an undefined variable", () => {
            const env = new Environment(undefined, true);
            assert.throws(() => env.lookup("x"), /Variable x is not defined/);
        });
    });

    describe("resolve", () => {
        it("should resolve a variable in the current environment", () => {
            const env = new Environment(undefined, true);
            env.declare("x", { type: "number", value: 42 } as RuntimeValue);
            const expected = env;
            const actual = env.resolve("x");
            assert.deepEqual(actual, expected);
        });

        it("should resolve a variable in a parent environment", () => {
            const parent = new Environment(undefined, true);
            parent.declare("x", { type: "number", value: 42 } as RuntimeValue);
            const child = new Environment(parent);
            const expected = parent;
            const actual = child.resolve("x");
            assert.deepEqual(actual, expected);
        });

        it("should throw an error for an undefined variable", () => {
            const env = new Environment(undefined, true);
            assert.throws(() => env.resolve("x"), /Variable x is not defined/);
        });
    });
});