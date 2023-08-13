import { warn } from '../runtime/log';
import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression } from './ast';
import { tokenize, Token, TokenType } from './lexer';

/**
 * A parser for the source code.
 */
export default class Parser {
    private tokens: Token[] = [];

    /**
     * Checks if there are more tokens to parse.
     * @returns True if there are more tokens to parse, false otherwise.
     */
    private notEOF(): boolean {
        return this.tokens[0].type !== TokenType.EOF;
    }

    /**
     * Gets the token at the given index.
     * @param index - The index of the token to get.
     * @returns The token at the given index.
     */
    private at(index: number = 0): Token {
        return this.tokens?.[index];
    }

    /**
     * Eats the next token.
     * @returns The eaten token.
     */
    private eatToken(): Token {
        return this.tokens.shift()!;
    }

    /**
     * Expects the next token to be of the given type. If it is not, an error is thrown.
     * @param type - The type of the expected token.
     * @param message - The error message to display if the token is not of the expected type.
     * @returns The expected token.
     */
    private except(type: TokenType, message: string): Token {
        const prev = this.eatToken();

        if (!prev || prev.type !== type) {
            console.error("Parser Error:\n", message, prev, "- Excepting:", type);
            process.exit(1);
        }

        return prev;
    }

    /**
     * Produces an AST from the given source code.
     * @param sourceCode - The source code to parse.
     * @returns The AST produced from the source code.
     */
    public produceAST(sourceCode: string): Program {

        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.notEOF()) {
            program.body.push(this.parseStatement());
        }

        return program;
    }

    /**
     * Parses a statement.
     * @returns The parsed statement.
     */
    private parseStatement(): Statement {
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parseVariableDeclaration();
            default:
                return this.parseExpression();
        }
    }

    /**
     * Parses a variable declaration.
     * @returns The parsed variable declaration.
     */
    private parseVariableDeclaration(): Statement {
        const isConstant = this.eatToken().type === TokenType.Const;
        const identifier = this.except(TokenType.Identifier, "Expected identifier after variable declaration keyword").value;

        if (this.at().type === TokenType.Semicolon) {
            this.eatToken();

            if (isConstant) {
                console.error("Parser Error:\n", "Constant declaration must have a value");
                process.exit(1);
            }

            return { kind: 'VariableDeclaration', constant: false, identifier } as VariableDeclaration;
        }

        this.except(TokenType.Equals, "Expected '=' after variable declaration identifier");
        const declaration = {
            kind: 'VariableDeclaration',
            constant: isConstant,
            identifier,
            value: this.parseExpression(),
        } as VariableDeclaration;

        if (this.at().type === TokenType.Semicolon) {
            this.eatToken();
        } else {
            warn("';' after variable declaration is optional. But it's a good practice to use it.");
        }
        return declaration;
    }

    /**
     * Parses an expression.
     * @returns The parsed expression.
     */
    private parseExpression(): Expression {
        return this.parseAssignmentExpression();
    }

    /**
     * Parses an assignment expression.
     * @returns The parsed assignment expression.
     */
    private parseAssignmentExpression(): Expression {
        const left = this.parseAdditiveExpression(); // TODO: Switch this into ObjectExpression

        if (this.at().type === TokenType.Equals) {
            this.eatToken(); // Advance past the '='
            const value = this.parseAssignmentExpression();
            return {
                value,
                asignee: left,
                kind: 'AssignmentExpression'
            } as AssignmentExpression;
        }

        return left;
    }

    /**
     * Parses an additive expression.
     * @returns The parsed additive expression.
     */
    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression();

        while (['+', '-'].includes(this.at().value)) {
            const operator = this.eatToken().value;
            const right = this.parseMultiplicativeExpression();

            left = {
                kind: 'BinaryExpression',
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left;
    }

    /**
     * Parses a multiplicative expression.
     * @returns The parsed multiplicative expression.
     */
    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression();

        while (['/', '*', '%'].includes(this.at().value)) {
            const operator = this.eatToken().value;
            const right = this.parsePrimaryExpression();

            left = {
                kind: 'BinaryExpression',
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left;
    }

    /**
     * Parses a primary expression.
     * @returns The parsed primary expression.
     */
    private parsePrimaryExpression(): Expression {

        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return { kind: 'Identifier', symbol: this.eatToken().value } as Identifier;

            case TokenType.Number:
                return { kind: 'NumericLiteral', value: parseFloat(this.eatToken().value) } as NumericLiteral;

            case TokenType.OpenParentesis: {
                this.eatToken();
                const value = this.parseExpression();
                this.except(
                    TokenType.CloseParentesis,
                    "Unexpected token founded inside parhentesised expression. Expected closing parentesis"
                );
                return value;
            }

            default:
                console.error(`Unexpected token: ${tk}`)
                process.exit(1);
        }
    }
}