/**
 * The type of a token.
 */
export enum TokenType {
    // Literal Types
    Number,
    Identifier,

    // Keywords
    Let,
    Const,

    // Grouping / Operators
    Equals,
    Semicolon,
    OpenParentesis,
    CloseParentesis,
    BinaryOperator,

    // Misc
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
    "const": TokenType.Const,
}

/**
 * A token in the source code.
 */
export interface Token {
    type: TokenType;
    value: string;
}

/**
 * Creates a new token with the given type and value.
 * @param value - The value of the token.
 * @param type - The type of the token.
 * @returns The new token.
 */
function token(value: string = "", type: TokenType): Token {
    return {
        type,
        value,
    };
}

/**
 * Checks if a character is an alphabetic character.
 * @param char - The character to check.
 * @returns True if the character is an alphabetic character, false otherwise.
 */
function isAlpha(char: string): boolean {
    return char.toUpperCase() !== char.toLowerCase();
}

/**
 * Checks if a character is an integer character.
 * @param char - The character to check.
 * @returns True if the character is an integer character, false otherwise.
 */
function isInteger(char: string): boolean {
    const code = char.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]

    return code >= bounds[0] && code <= bounds[1];
}

/**
 * Checks if a character is a whitespace character.
 * @param char - The character to check.
 * @returns True if the character is a whitespace character, false otherwise.
 */
function isSkipable(char: string): boolean {
    return [' ', '\n', '\t'].includes(char);
}

/**
 * Tokenizes the given source code.
 * @param sourceCode - The source code to tokenize.
 * @returns The tokens in the source code.
 */
export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split('');

    while (src.length > 0) {
        if (src[0] === '(') {
            tokens.push(token(src.shift()!, TokenType.OpenParentesis));
        } else if (src[0] === ')') {
            tokens.push(token(src.shift()!, TokenType.CloseParentesis));
        } else if (['+', '-', '*', '/', '%'].includes(src[0])) {
            tokens.push(token(src.shift()!, TokenType.BinaryOperator));
        } else if (src[0] === '=') {
            tokens.push(token(src.shift()!, TokenType.Equals));
        } else if (src[0] === ';') {
            tokens.push(token(src.shift()!, TokenType.Semicolon));
        } else {
            // Handle multi-char tokens

            if (isInteger(src[0])) {
                let num = "";
                while (src.length > 0 && isInteger(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));
            } else if (isAlpha(src[0])) {
                let ident = "";
                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }

                const reserved = KEYWORDS?.[ident];

                if (
                    Number.isInteger(Number(reserved))
                ) {
                    tokens.push(token(ident, reserved));
                } else if (!reserved) {
                    tokens.push(token(ident, TokenType.Identifier));
                } else {
                    console.log(`Unexpected token ${src[0]}`);
                    process.exit(1);
                }
            } else if (isSkipable(src[0])) {
                src.shift();
            } else {
                console.log(`Unexpected token ${src[0]}`);
                process.exit(1);
            }
        }
    }

    tokens.push(token("", TokenType.EOF));

    return tokens;
}