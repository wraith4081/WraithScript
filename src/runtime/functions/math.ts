import Environment from "../environment";
import { MK_NATIVE_FUNCTION, MK_NULL, MK_NUMBER, NumberValue } from "../values";

const constants = {
    Euler: 2.718281828459045,
    LN10: 2.302585092994046,
    LN2: 0.6931471805599453,
    LOG10E: 0.4342944819032518,
    LOG2E: 1.4426950408889634,
    PI: 3.141592653589793,
    SQRT1_2: 0.7071067811865476,
    SQRT2: 1.4142135623730951
}

const _floor = (value: number) => Math.floor(value); // NOT NEEDED YET
const _ceil = (value: number) => ~~value + _sign(value); // NOT NEEDED YET
const _round = (value: number) => value % 1 > 0.5 ? _ceil(value) : _floor(value); // NOT NEEDED YET

const _abs = (value: number) => value < 0 ? -value : value; // NOT NEEDED YET

const _acos = (x: number) => {
    /*
    if (x > 1 || x < -1) return NaN;

    const iterations = 30;
    const k = 0.6072529350088813; // 1 / sqrt(2)
    let y = x;
    let z = 0;
    let angle = Math.PI / 2;

    for (let i = 0; i < iterations; i++) {
        const d = y >= 0 ? 1 : -1;
        const delta = d * Math.atan(Math.pow(k, i));
        angle -= delta;
        z += d * (1 << i);
        y = x * Math.cos(angle) + z * Math.sin(angle);
    }

    return angle;
    */

    return Math.acos(x);
} // DONT WORKING

const _acosh = (x: number) => _log(x + _sqrt(x * x - 1));
const _asin = (x: number) => Math.asin(x) // _atan(x / _sqrt(1 - x ^ 2));
const _asinh = (x: number) => _log(x + _sqrt(x * x + 1));
const _atan = (x: number) => Math.atan(x) //_atan2(x, 1);

function _atan2(y: number, x: number) {
    const iterations = 30;
    const k = 0.6072529350088813; // 1 / sqrt(2)
    let angle = 0;
    let z = 0;

    for (let i = 0; i < iterations; i++) {
        const d = y >= 0 ? 1 : -1;
        const delta = d * Math.atan(Math.pow(k, i));
        angle += d * delta;
        z += d * (x >> i);
        y -= d * (y >= 0 ? 1 << i : -(1 << i));
    }

    return angle;
}

// TESTED
function _sin(x: number) {
    /*
    x = x % (2 * Math.PI);
    var mxx = -x * x;
    var sin = 1;
    var n = 0;
    var term = 1;
    for (var i = 1; i <= 20; i++) {
        n = n + 2;
        term = term * mxx / (n * (n + 1));
        sin = sin + term
    }
    sin = x * sin;
    return sin;
    */

    return Math.sin(x);
}


const _atanh = (x: number) => Math.log((1 + x) / (1 - x)) / 2;
const _cbrt = (x: number) => x < 0 ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3);
const _clz32 = (x: number) => {
    /*
    const iterations = 30;
    let y = x, z = 0;

    for (let i = 0; i < iterations; i++) {
        const d = y >= 0 ? 1 : -1;
        z += d * (1 << i);
        y = x >> z;
    }

    return z;
    */

    return Math.clz32(x);
}

const _cos = (x: number) => _sin(x + Math.PI / 2); // TESTED
const _cosh = (x: number) => (_exp(x) + _exp(-x)) / 2; // TESTED
const _exp = (x: number) => constants.Euler ** (x); // TESTED
const _expm1 = (x: number) => _exp(x) - 1; // TESTED
const _fround = (x: number) => Math.fround(x); // TESTED BUT NOT REAL IMPLEMENTATION
const _hypot = (x: number, y: number) => _sqrt(x * x + y * y); // TESTED BUT HAS SOME ISSUES
const _imul = (x: number, y: number) => Math.imul(x, y) //x * y; // TESTED BUT NOT REAL IMPLEMENTATION
const _log = (x: number) => Math.log(x); // TESTED BUT SHOULD BE NATIVE
const _log10 = (x: number) => Math.log(x) / constants.LN10; // TESTED BUT SHOULD BE NATIVE
const _log1p = (x: number) => Math.log(1 + x) / constants.LN10; // TESTED BUT SHOULD BE NATIVE
const _log2 = (x: number) => Math.log(x) / constants.LN2; // TESTED BUT SHOULD BE NATIVE
const _pow = (x: number, y: number) => x ** y; // TESTED
// const random;
const _sign = (x: number) => x == 0 ? 0 : x < 0 ? -1 : 1; // TESTED
const _sinh = (x: number) => (_exp(x) - _exp(-x)) / 2; // TESTED
const _sqrt = (x: number) => x ** 0.5; // TESTED
const _tan = (x: number) => _sin(x) / _cos(x); // TESTED
const _tanh = (x: number) => (_exp(x) - _exp(-x)) / (_exp(x) + _exp(-x)); // TESTED
const _trunc = (x: number) => x < 0 ? _ceil(x) : _floor(x); // TESTED

const _listmax = (args: NumberValue[], env: Environment) => {
    let max = args[0].value;
    for (let i = 1; i < args.length; i++) {
        if (args[i].value > max) max = args[i].value;
    }

    return MK_NUMBER(max);
} // TESTED

const _listmin = (args: NumberValue[], env: Environment) => {
    let min = args[0].value;
    for (let i = 1; i < args.length; i++) {
        if (args[i].value < min) min = args[i].value;
    } // TESTED

    return MK_NUMBER(min);
}

const _sum = (args: NumberValue[], env: Environment) => {
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        sum += args[i].value;
    }

    return MK_NUMBER(sum);
} // TESTED

// https://graphics.stanford.edu/~seander/bithacks.html
const _max = (x: number, y: number) => x < y ? y : x // x ^ ((x ^ y) & -(x < y)); // TESTED
const _min = (x: number, y: number) => x < y ? x : y // y ^ ((x ^ y) & -(x < y)); // TESTED
// const _po2 = (v: number) => v % 2 === 0 // v && !(v & (v - 1)); // TESTED

const singleFunc = (fn: (value: number) => number) => (args: NumberValue[], env: Environment) => {
    if (args.length !== 1 || args.some(x => x.type !== 'number')) return MK_NULL();
    return MK_NUMBER(fn(args[0].value)) as any;
}

const doubleFunc = (fn: (x: number, y: number) => number) => (args: NumberValue[], env: Environment) => {
    if (args.length !== 2 || args.some(x => x.type !== 'number')) return MK_NULL();
    return MK_NUMBER(fn(args[0].value, args[1].value)) as any;
}

export const floor = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_floor)(args, env));
export const ceil = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_ceil)(args, env));
export const round = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_round)(args, env));
export const abs = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_abs)(args, env));
export const acos = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_acos)(args, env));
export const acosh = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_acosh)(args, env));
export const asin = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_asin)(args, env));
export const asinh = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_asinh)(args, env));
export const atan = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_atan)(args, env));
export const atanh = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_atanh)(args, env));
export const cbrt = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_cbrt)(args, env));
export const clztt = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_clz32)(args, env));
export const cos = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_cos)(args, env));
export const cosh = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_cosh)(args, env));
export const exp = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_exp)(args, env));
export const expm = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_expm1)(args, env));
export const fround = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_fround)(args, env));
export const log = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_log)(args, env));
export const logten = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_log10)(args, env));
export const logonep = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_log1p)(args, env));
export const logtwo = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_log2)(args, env));
export const sign = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_sign)(args, env));
export const sin = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_sin)(args, env));
export const sinh = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_sinh)(args, env));
export const sqrt = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_sqrt)(args, env));
export const tan = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_tan)(args, env));
export const tanh = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_tanh)(args, env));
export const trunc = MK_NATIVE_FUNCTION((args: any[], env: Environment) => singleFunc(_trunc)(args, env));
/*export const potwo = MK_NATIVE_FUNCTION((args: any[], env: Environment) =>
    args[0].type === 'number'
        ? MK_NUMBER(_po2(args[0].value) ? 1 : 0)
        : MK_NULL() as any);
*/
export const hypot = MK_NATIVE_FUNCTION((args: any[], env: Environment) => doubleFunc(_hypot)(args, env));
export const imul = MK_NATIVE_FUNCTION((args: any[], env: Environment) => doubleFunc(_imul)(args, env));
export const pow = MK_NATIVE_FUNCTION((args: any[], env: Environment) => doubleFunc(_pow)(args, env));
export const max = MK_NATIVE_FUNCTION((args: any[], env: Environment) => doubleFunc(_max as any)(args, env));
export const min = MK_NATIVE_FUNCTION((args: any[], env: Environment) => doubleFunc(_min as any)(args, env));

export const random = MK_NATIVE_FUNCTION((args: any[], env: Environment) => MK_NUMBER(Math.random()) as any); // TODO: Make this a real random number

export const listmax = MK_NATIVE_FUNCTION((args: any[], env: Environment) => MK_NUMBER(_listmax(args, env).value as any) as any);
export const listmin = MK_NATIVE_FUNCTION((args: any[], env: Environment) => MK_NUMBER(_listmin(args, env).value as any) as any);
export const sum = MK_NATIVE_FUNCTION((args: any[], env: Environment) =>
    args.every(arg => arg.type == 'number')
        ? MK_NUMBER(_sum(args, env) ? 1 : 0)
        : MK_NULL() as any);
export const avg = MK_NATIVE_FUNCTION((args: any[], env: Environment) => MK_NUMBER(_sum(args as any, env)?.value as any / args.length) as any);

export const Euler = MK_NUMBER(constants.Euler);
export const LNTEN = MK_NUMBER(constants.LN10);
export const LNTWO = MK_NUMBER(constants.LN2);
export const LOGTENE = MK_NUMBER(constants.LOG10E);
export const LOGTWOE = MK_NUMBER(constants.LOG2E);
export const PI = MK_NUMBER(constants.PI);
export const SQRTONETWO = MK_NUMBER(constants.SQRT1_2);
export const SQRTTWO = MK_NUMBER(constants.SQRT2);


export const functionsList = [
    'floor',
    'ceil',
    'round',
    'abs',
    'acos',
    'acosh',
    'asin',
    'asinh',
    'atan',
    'atanh',
    'cbrt',
    'clz32',
    'cos',
    'cosh',
    'exp',
    'expm1',
    'fround',
    'log',
    'log10',
    'log1p',
    'log2',
    'hypot',
    'sign',
    'sin',
    'sinh',
    'sqrt',
    'tan',
    'tanh',
    'trunc',
    'po2',
    'imul',
    'pow',
    'max',
    'min',
    'random',
    'listmax',
    'listmin',
    'sum',
    'avg'
];

export const constantsList = [
    'Euler',
    'LN10',
    'LN2',
    'LOG10E',
    'LOG2E',
    'PI',
    'SQRT1_2',
    'SQRT2'
];