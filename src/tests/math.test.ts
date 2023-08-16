import {
    floor, ceil, round, abs, acos, acosh, asin, asinh,
    atan, atanh, cbrt, clztt, cos, cosh, exp, expm,
    fround, log, logten, logonep, logtwo, hypot, sign, sin,
    sinh, sqrt, tan, tanh, trunc, imul, pow,
    max, min, random, listmax, listmin, sum, avg,

    Euler, LNTEN, LNTWO, LOGTWOE,
    LOGTENE, PI, SQRTONETWO, SQRTTWO
} from "../runtime/functions/math";
import assert from "assert";
import { MK_NUMBER } from "../runtime/values";
import Environment from "../runtime/environment";

function compare(a: number, b: number, accuracy: number = 0.95) {
    const biggest = Math.max(Math.abs(a), Math.abs(b))
    const epsilon = biggest * accuracy
    if (Math.abs(a - b) > epsilon) {
        throw (new Error("message"))
    }
}

describe("constants", () => {
    it("should have correct values", () => {
        compare(Euler.value as any, 2.718281828459045);
        compare(LNTEN.value as any, 2.302585092994046);
        compare(LNTWO.value as any, 0.6931471805599453);
        compare(LOGTWOE.value as any, 1.4426950408889634);
        compare(LOGTENE.value as any, 0.4342944819032518);
        compare(PI.value as any, 3.141592653589793);
        compare(SQRTONETWO.value as any, 0.7071067811865476);
        compare(SQRTTWO.value as any, 1.4142135623730951);
    });
});

describe("floor", () => {
    it("should return the floor of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)

        for (const input of tests) {
            assert.deepStrictEqual((floor as any).call([MK_NUMBER(input)], new Environment())?.value, Math.floor(input));
        }
    });
});

describe("ceil", () => {
    it("should return the ceil of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            assert.deepStrictEqual((ceil as any).call([MK_NUMBER(input)], new Environment())?.value, Math.ceil(input));
        }
    });
});

describe("round", () => {
    it("should return the round of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            assert.deepStrictEqual((round as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.round(input));
        }
    });
});

describe("abs", () => {
    it("should return the absolute value of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            assert.deepStrictEqual((abs as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.abs(input));
        }
    });
});

describe("acos", () => {
    it("should return the acos of a number", () => {
        const tests = [
            1,
            0,
            -1
        ]
        for (const input of tests) {
            compare((acos as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.acos(input));
        }
    });
});

describe("acosh", () => {
    it("should return the acosh of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((acosh as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.acosh(input));
        }
    });
});

describe("asin", () => {
    it("should return the asin of a number", () => {
        const tests = [
            1,
            0,
            -1
        ]
        for (const input of tests) {
            compare((asin as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.asin(input));
        }
    });
});

describe("asinh", () => {
    it("should return the asinh of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((asinh as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.asinh(input));
        }
    });
});

describe("atan", () => {
    it("should return the atan of a number", () => {
        const tests = [
            1,
            0,
            -1,
        ]
        for (const input of tests) {
            compare((atan as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.atan(input));
        }
    });
});

describe("atanh", () => {
    it("should return the atanh of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((atanh as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.atanh(input));
        }
    });
});

describe("cbrt", () => {
    it("should return the cbrt of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((cbrt as any).call([MK_NUMBER(input)], new Environment()), Math.cbrt(input));
        }
    });
});

describe("clztt", () => {
    it("should return the clztt of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((clztt as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.clz32(input));
        }
    });
});

describe("cos", () => {
    it("should return the cos of a number", () => {
        const tests = [
            0,
            Math.PI / 2,
            Math.PI
        ]
        for (const input of tests) {
            compare((cos as any).call([MK_NUMBER(input)], new Environment()), Math.cos(input));
        }
    });
});

describe("cosh", () => {
    it("should return the cosh of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((cosh as any).call([MK_NUMBER(input)], new Environment()), Math.cosh(input));
        }
    });
});

describe("exp", () => {
    it("should return the exp of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((exp as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.exp(input));
        }
    });
});

describe("expm", () => {
    it("should return the expm of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((expm as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.expm1(input));
        }
    });
});

describe("fround", () => {
    it("should return the fround of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((fround as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.fround(input));
        }
    });
});

describe("log", () => {
    it("should return the log of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((log as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.log(input));
        }
    });
});

describe("logten", () => {
    it("should return the logten of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((logten as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.log10(input));
        }
    });
});

describe("logonep", () => {
    it("should return the logonep of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((logonep as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.log1p(input));
        }
    });
});

describe("logtwo", () => {
    it("should return the logtwo of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((logtwo as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.log2(input));
        }
    });
});

describe("hypot", () => {
    it("should return the hypot of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((hypot as any).call([MK_NUMBER(input), MK_NUMBER(input)], new Environment()).value as any, Math.hypot(input, input));
        }
    });
});

describe("sign", () => {
    it("should return the sign of a number", () => {
        const tests = [
            0,
            1,
            -1,
            2,
            -2,
        ]
        for (const input of tests) {
            compare((sign as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.sign(input));
        }
    });
});

describe("sin", () => {
    it("should return the sin of a number", () => {
        const tests = [
            0,
            Math.PI / 2,
            Math.PI,
        ]
        for (const input of tests) {
            compare((sin as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.sin(input));
        }
    });
});

describe("sinh", () => {
    it("should return the sinh of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((sinh as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.sinh(input));
        }
    });
});

describe("sqrt", () => {
    it("should return the sqrt of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((sqrt as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.sqrt(input));
        }
    });
});

describe("tan", () => {
    it("should return the tan of a number", () => {
        const tests = [
            0,
            Math.PI / 4,
            Math.PI / 2,
        ]
        for (const input of tests) {
            compare((tan as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.tan(input));
        }
    });
});

describe("tanh", () => {
    it("should return the tanh of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((tanh as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.tanh(input));
        }
    });
});

describe("trunc", () => {
    it("should return the trunc of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((trunc as any).call([MK_NUMBER(input)], new Environment()).value as any, Math.trunc(input));
        }
    });
});
/*
describe("potwo", () => {
    it("should return the potwo of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((potwo as any).call([MK_NUMBER(input)], new Environment()).value as any, input);
        }
    });
});
*/
describe("imul", () => {
    it("should return the imul of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((imul as any).call([MK_NUMBER(input), MK_NUMBER(5)], new Environment()).value as any, Math.imul(input, 5));
        }
    });
});

describe("pow", () => {
    it("should return the pow of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((pow as any).call([MK_NUMBER(input), MK_NUMBER(2)], new Environment()).value as any, Math.pow(input, 2));
        }
    });
});

describe("max", () => {
    it("should return the max of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            let r = Math.floor(Math.random() * 10);
            assert.deepEqual((max as any).call([MK_NUMBER(input), MK_NUMBER(r)], new Environment()).value as any, Math.max(r, input));
        }
    });
});

describe("min", () => {
    it("should return the min of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            let r = Math.floor(Math.random() * 10);
            assert.deepEqual((min as any).call([MK_NUMBER(input), MK_NUMBER(r)], new Environment()).value as any, Math.min(r, input));
        }
    });
});

describe("random", () => {
    it("should return the random of a number", () => {
        let last = 0;
        for (const i in Array(5)) {
            let c = (random as any).call([], new Environment()).value as any;
            if (
                c === last
            ) {
                throw new Error("random is not random");
            }

            last = c;
        }
    });
});
/*
describe("listmax", () => {
    it("should return the listmax of a number", () => {
        const tests = Array.from({length: 5}).map(() => Math.random() * 10)
        for (const [input, expected] of tests) {
            compare((listmax as any).call([MK_NUMBER(input)], new Environment()).value as any, expected);
        }
    });
});

describe("listmin", () => {
    it("should return the listmin of a number", () => {
        const tests = Array.from({length: 5}).map(() => Math.random() * 10)
        for (const [input, expected] of tests) {
            compare((listmin as any).call([MK_NUMBER(input)], new Environment()).value as any, expected);
        }
    });
});
*/
describe("sum", () => {
    it("should return the sum of a number", () => {
        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((sum as any).call([MK_NUMBER(input), MK_NUMBER(input)] as any, new Environment()).value as any, input * 2);
        }
    });
});

describe("avg", () => {
    it("should return the avg of a number", () => {

        const tests = Array.from({ length: 5 }).map(() => Math.random() * 10)
        for (const input of tests) {
            compare((avg as any).call([MK_NUMBER(input)], new Environment()).value as any, input);
        }
    });
});