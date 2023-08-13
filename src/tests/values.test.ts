import { MK_NULL, MK_BOOL, MK_NUMBER } from "../runtime/values";
import assert from "assert";

describe("values", () => {
    describe("MK_NULL", () => {
        it("should create a null value", () => {
            const expected = { type: "null", value: null };
            const actual = MK_NULL();
            assert.deepEqual(actual, expected);
        });
    });

    describe("MK_BOOL", () => {
        it("should create a true boolean value by default", () => {
            const expected = { type: "boolean", value: true };
            const actual = MK_BOOL();
            assert.deepEqual(actual, expected);
        });

        it("should create a boolean value with the specified value", () => {
            const expected = { type: "boolean", value: false };
            const actual = MK_BOOL(false);
            assert.deepEqual(actual, expected);
        });
    });

    describe("MK_NUMBER", () => {
        it("should create a number value with the default value of 0", () => {
            const expected = { type: "number", value: 0 };
            const actual = MK_NUMBER();
            assert.deepEqual(actual, expected);
        });

        it("should create a number value with the specified value", () => {
            const expected = { type: "number", value: 42 };
            const actual = MK_NUMBER(42);
            assert.deepEqual(actual, expected);
        });
    });
});