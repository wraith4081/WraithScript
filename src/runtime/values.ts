/**
 * The possible value types.
 */
export type ValueType = "null" | "number" | "boolean";

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