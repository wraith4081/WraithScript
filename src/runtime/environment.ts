import { warn } from "./log";
import { RuntimeValue } from "./values";

/**
 * Represents an environment for variable and constant declarations.
 */
export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;

    private throwErrors: boolean;

    /**
     * Creates a new environment.
     * @param parent - The parent environment, if any.
     */
    constructor(parent?: Environment, throwErrors: boolean = false) {
        this.parent = parent;
        this.variables = new Map();
        this.constants = new Set();

        this.throwErrors = throwErrors;
    }

    /**
     * Declares a variable or constant with the given name and value.
     * @param name - The name of the variable or constant.
     * @param value - The value of the variable or constant.
     * @param constant - Whether the declaration is a constant.
     * @returns The value of the variable or constant.
     */
    public declare(name: string, value: RuntimeValue, constant: boolean = true): RuntimeValue {
        // Check if the variable already exists in this scope.
        if (this.variables.has(name)) {
            const err = `Cannot redeclare variable ${name}. It already exists in this scope.`;

            if (this.throwErrors) {
                throw new Error(err);
            } else {
                console.error(err);
                process.exit(1);
            }
        }

        this.variables.set(name, value);

        // If the variable is a constant, add it to the constants set so it can't be reassigned.
        if (constant) {
            this.constants.add(name);
        }

        return value;
    }

    /**
     * Assigns a value to the variable with the given name.
     * @param name - The name of the variable.
     * @param value - The new value of the variable.
     * @returns The new value of the variable.
     */
    public assign(name: string, value: RuntimeValue): RuntimeValue {
        const environment = this.resolve(name);

        // Check if the variable exists in any scope.
        if (!environment) {
            const err = `Cannot assign to undeclared variable ${name}.`;

            if (this.throwErrors) {
                throw new Error(err);
            } else {
                console.error(err);
                process.exit(1);
            }
        }

        // Check if the variable is a constant.
        if (environment.constants.has(name)) {
            const err = `Cannot reasign to constant variable ${name}.`;

            if (this.throwErrors) {
                throw new Error(err);
            } else {
                console.error(err);
                process.exit(1);
            }
        }

        // Check if the type of the variable is changing.
        if (
            environment.variables.get(name)?.type !== value.type
        ) {
            warn(`It's not recommended to change the type of a variable. ${name} was originally ${environment.variables.get(name)?.type} and is now ${value.type}`)
        }

        environment.variables.set(name, value);

        return value;
    }

    /**
     * Looks up the value of the variable with the given name.
     * @param name - The name of the variable.
     * @returns The value of the variable.
     */
    public lookup(name: string): RuntimeValue {
        const environment = this.resolve(name);

        // Check if the variable exists in any scope.
        if (!environment) {
            const err = `Variable ${name} is not defined.`;

            if (this.throwErrors) {
                throw new Error(err);
            } else {
                console.error(err);
                process.exit(1);
            }
        }

        return environment.variables.get(name)!;
    }

    /**
     * Resolves the environment that contains the variable with the given name.
     * @param name - The name of the variable.
     * @returns The environment that contains the variable.
     */
    public resolve(name: string): Environment {
        // Check if the variable exists in this scope.
        if (this.variables.has(name)) {
            return this;
        }

        // If the variable doesn't exist in this scope, check the parent scope.
        if (!this.parent) {
            const err = `Variable ${name} is not defined.`;

            if (this.throwErrors) {
                throw new Error(err);
            } else {
                console.error(err);
                process.exit(1);
            }
        }

        return this.parent.resolve(name);
    }
}