import { error, warn } from '../runtime/log';
import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression, Property, ObjectLiteral, CallExpression, MemberExpression } from './ast';
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
        const left = this.parseObjectExpression(); // TODO: Switch this into ObjectExpression

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
     * Parses an object literal expression and returns an AST node representing the expression.
     * @returns The AST node representing the object literal expression.
     * @throws If an unexpected token is encountered while parsing the expression.
     */
    private parseObjectExpression(): Expression {

        if (this.at().type !== TokenType.OpenBrace) {
            return this.parseAdditiveExpression();
        }

        this.eatToken(); // Advance past the '{'
        const properties = new Array<Property>();

        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            const key = this.except(TokenType.Identifier, "Unexpected token founded inside object expression. Expected identifier").value;

            if (this.at().type === TokenType.Comma) {
                this.eatToken();
                properties.push({
                    kind: 'Property',
                    key
                });

                continue;
            } else if (this.at().type === TokenType.CloseBrace) {
                properties.push({
                    kind: 'Property',
                    key
                });
                break;
            }

            this.except(TokenType.Colon, "Unexpected token founded inside object expression. Expected colon");
            const value = this.parseExpression();

            properties.push({
                kind: 'Property',
                key,
                value
            });

            if (this.at().type !== TokenType.CloseBrace) {
                this.except(TokenType.Comma, "Unexpected token founded inside object expression. Expected comma");
            }

        }

        this.except(TokenType.CloseBrace, "Unexpected token founded inside object expression. Expected closing brace");
        return { kind: "ObjectLiteral", properties } as ObjectLiteral;
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
        let left = this.parseCallMemberExpression();

        while (['/', '*', '%'].includes(this.at().value)) {
            const operator = this.eatToken().value;
            const right = this.parseCallMemberExpression();

            left = {
                kind: 'BinaryExpression',
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left;
    }

    private parseCallMemberExpression(): Expression {
        const member = this.parseMemberExpression();

        if (this.at().type === TokenType.OpenParentesis) {
            return this.parseCallExpression(member);
        }

        return member;
    }

    private parseCallExpression(caller: Expression): Expression {
        let callerExpression = {
            kind: 'CallExpression',
            caller,
            args: this.parseArguments()
        } as CallExpression;

        if (this.at().type === TokenType.OpenParentesis) {
            callerExpression = this.parseCallExpression(callerExpression) as CallExpression;
        }

        return callerExpression;
    }

    private parseArguments(): Expression[] {
        this.except(TokenType.OpenParentesis, "Unexpected token founded inside arguments list. Expected opening parentesis");

        const args = this.at().type === TokenType.CloseParentesis ? [] : this.parseArgumentsList();

        this.except(TokenType.CloseParentesis, "Unexpected token founded inside arguments list. Expected closing parentesis");

        return args;
    }

    private parseArgumentsList(): Expression[] {
        const args = [this.parseAssignmentExpression()];

        while (this.notEOF() && this.at().type === TokenType.Comma) {
            this.eatToken();
            args.push(this.parseAssignmentExpression());
        }

        return args;
    }

    private parseMemberExpression(): Expression {
        let object: Expression = this.parsePrimaryExpression();

        while ([TokenType.Dot, TokenType.OpenBracket].includes(this.at().type)) {
            const operator = this.eatToken();
            let property: Expression;
            let computed = operator.type !== TokenType.Dot;

            if (operator.type === TokenType.Dot) {
                property = this.parsePrimaryExpression();

                if (property.kind !== 'Identifier') {
                    error("Cannot use a non-identifier as a property name");
                    process.exit(1);
                }
            } else {
                property = this.parseExpression();
                this.except(TokenType.CloseBracket, "Unexpected token founded inside member expression. Expected closing bracket");
            }

            object = {
                kind: 'MemberExpression',
                object,
                property,
                computed
            } as Expression;
        }

        return object;
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