/**
 * The type of an AST node.
 */
export type NodeType =
    // STATEMENTS
    | "Program"
    | "VariableDeclaration"

    // EXPRESSIONS
    | "AssignmentExpression"
    | "MemberExpression"
    | "CallExpression"

    // LITERALS
    | "Property"
    | "ObjectLiteral"
    | "NumericLiteral"
    | "Identifier"
    | "BinaryExpression";

/**
 * Represents a statement in the AST.
 */
export interface Statement {
    kind: NodeType;
}

/**
 * Represents a program in the AST.
 */
export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

/**
 * Represents a variable declaration in the AST.
 */
export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration";
    constant: boolean;
    identifier: string;
    value?: Expression;
}

/**
 * Represents an expression in the AST.
 */
export interface Expression extends Statement { }

/**
 * Represents an assignment expression in the AST.
 */
export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression";
    asignee: Expression;
    value: Expression;
}

/**
 * Represents a binary expression in the AST.
 */
export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string; // For now, this is a string. But it should be specific to the operators.
}

export interface CallExpression extends Expression {
    kind: "CallExpression";
    args: Expression[];
    caller: Expression;
}

export interface MemberExpression extends Expression {
    kind: "BinaryExpression";
    object: Expression;
    property: Expression;
    computed: boolean;
}

/**
 * Represents a numeric literal in the AST.
 */
export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

/**
 * Represents an identifier in the AST.
 */
export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    value: number;
}

/**
 * Represents a property in the AST.
 */
export interface Property extends Expression {
    kind: "Property";
    key: string;
    value?: Expression;
}

/**
 * Represents an object literal in the AST.
 */
export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral";
    properties: Property[];
}