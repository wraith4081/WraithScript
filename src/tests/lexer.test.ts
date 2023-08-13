import { isAlpha, isInteger, isSkipable, token, tokenize, TokenType } from "../frontend/lexer";
import assert from "assert";

describe("lexer", () => {
    describe("isAlpha", () => {
        it("should return true for an alphabetic character", () => {
            const char = "a";
            const expected = true;
            const actual = isAlpha(char);
            assert.strictEqual(actual, expected);
        });

        it("should return false for a non-alphabetic character", () => {
            const char = "1";
            const expected = false;
            const actual = isAlpha(char);
            assert.strictEqual(actual, expected);
        });
    });

    describe("isInteger", () => {
        it("should return true for an integer character", () => {
            const char = "5";
            const expected = true;
            const actual = isInteger(char);
            assert.strictEqual(actual, expected);
        });

        it("should return false for a non-integer character", () => {
            const char = "a";
            const expected = false;
            const actual = isInteger(char);
            assert.strictEqual(actual, expected);
        });
    });

    describe("isSkipable", () => {
        it("should return true for a whitespace character", () => {
            const char = " ";
            const expected = true;
            const actual = isSkipable(char);
            assert.strictEqual(actual, expected);
        });

        it("should return false for a non-whitespace character", () => {
            const char = "a";
            const expected = false;
            const actual = isSkipable(char);
            assert.strictEqual(actual, expected);
        });
    });

    describe("token", () => {
        it("should create a new token with the given type and value", () => {
            const value = "hello";
            const type = TokenType.Identifier;
            const expected = { type, value };
            const actual = token(value, type);
            assert.deepEqual(actual, expected);
        });

        it("should create a new token with an empty value if none is provided", () => {
            const type = -1;
            const expected = { type, value: "" };
            const actual = token(undefined, type as any);
            assert.deepEqual(actual, expected);
        });
    });
    describe("tokenize", () => {
        it("should tokenize a simple expression", () => {
            const sourceCode = "(1 + 2) * 3;";
            const expected = [
                { type: TokenType.OpenParentesis, value: "(" },
                { type: TokenType.Number, value: "1" },
                { type: TokenType.BinaryOperator, value: "+" },
                { type: TokenType.Number, value: "2" },
                { type: TokenType.CloseParentesis, value: ")" },
                { type: TokenType.BinaryOperator, value: "*" },
                { type: TokenType.Number, value: "3" },
                { type: TokenType.Semicolon, value: ";" },
                { type: TokenType.EOF, value: "" },
            ];
            const actual = tokenize(sourceCode);
            assert.deepEqual(actual, expected);
        });

        it("should tokenize an expression with variables and keywords", () => {
            const sourceCode = "let y = x + (x * 3);";
            const expected = [
                { type: TokenType.Let, value: "let" },
                { type: TokenType.Identifier, value: "y" },
                { type: TokenType.Equals, value: "=" },
                { type: TokenType.Identifier, value: "x" },
                { type: TokenType.BinaryOperator, value: "+" },
                { type: TokenType.OpenParentesis, value: "(" },
                { type: TokenType.Identifier, value: "x" },
                { type: TokenType.BinaryOperator, value: "*" },
                { type: TokenType.Number, value: "3" },
                { type: TokenType.CloseParentesis, value: ")" },
                { type: TokenType.Semicolon, value: ";" },
                { type: TokenType.EOF, value: "" },
            ];
            const actual = tokenize(sourceCode);
            assert.deepEqual(actual, expected);
        });
    });
});