import Environment from "./environment";

/**
 * The possible value types.
 */
export type ValueType = "null" | "number" | "boolean" | "object" | "native-function";

/**
 * The interface for a runtime value.
 */
export interface RuntimeValue {
    type: ValueType;
}

/**
 * The interface for a null value.
 */
export interface NullValue extends RuntimeValue {
    type: "null";
    value: null;
}
/**
 * 
 * Creates a null value.
 * @returns The null value.
 */
export const MK_NULL = () => ({ type: "null", value: null }) as NullValue;

/**
 * The interface for a boolean value.
 */
export interface BooleanValue extends RuntimeValue {
    type: "boolean";
    value: boolean;
}

/**
 * Creates a boolean value.
 * @param value - The boolean value.
 * @returns The boolean value.
 */
export const MK_BOOL = (value: boolean = true) => ({ type: "boolean", value }) as BooleanValue;

/**
 * The interface for a number value.
 */
export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
}

/**
 * Creates a number value.
 * @param value - The number value.
 * @returns The number value.
 */
export const MK_NUMBER = (value: number = 0) => ({ type: "number", value }) as NumberValue;

/**
 * The interface for an object value.
 */
export interface ObjectValue extends RuntimeValue {
    type: "object";
    properties: Map<string, RuntimeValue>;
}

/**
 * The function that is called when the native function is invoked.
 * @param args The arguments passed to the function.
 * @param env The environment in which the function is called.
 * @returns The result of the function call.
 */
export type FunctionCall = (args: RuntimeValue[], env: Environment) => RuntimeValue;

/**
 * A value that represents a native function.
 */
export interface NativeFunctionValue extends RuntimeValue {
    type: "native-function";
    /**
     * The function that is called when the native function is invoked.
     * @param args The arguments passed to the function.
     * @param env The environment in which the function is called.
     * @returns The result of the function call.
     */
    call: FunctionCall;
}

/**
 * Creates a new native function value.
 * @param call The function that is called when the native function is invoked.
 * @returns The new native function value.
 */
export const MK_NATIVE_FUNCTION = (call: FunctionCall) => ({ type: "native-function", call }) as NativeFunctionValue;