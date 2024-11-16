/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prettify } from "./prettify";

type T1 = Prettify<{ a: 1 } & { b: 2 }>;
//   ^? type T1 = {
//          a: 1;
//          b: 2;
//      }

type _T2 = { a: 1; b: 2; c: 3 };
type T2 = Prettify<keyof { a: 1; b: 2; c: 3 }>;
//   ^? type T2 = "a" | "b" | "c"

type T3 = Prettify<{ a: { b: 1 } & { c: 2 } }>;
//   ^? type T3 = {
//          a: {
//              b: 1;
//              c: 2;
//          };
//      }

type T4 = Prettify<{ a: { b: 1 } & { c: 2 } & { d: 3 } }>;
//   ^? type T4 = {
//          a: {
//              b: 1;
//              c: 2;
//              d: 3;
//          };
//      }

type _T5 = { a: 1 };
type __T5 = { b: 2 };
type T5 = Prettify<_T5 & __T5>;
//   ^? type T5 = {
//          a: 1;
//          b: 2;
//      }

type SomeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
type T6 = Prettify<SomeRequired<{ a?: 1; b?: 2 }, "a">>;
//   ^? type T6 = {
//          a: 1;
//          b?: 2 | undefined;
//      }

type Merge<T, U> = U & Omit<T, keyof U>;
type T7 = Prettify<Merge<{ a: 1 }, { b: 2 }>>;
//   ^? type T7 = {
//          b: 2;
//          a: 1;
//      }

type Recursive = { a: Recursive };
type T8 = Prettify<Recursive>;
//   ^? type T8 = {
//          a: {
//              a: {
//                  a: {
//                      a: Recursive;
//                  };
//              };
//          };
//      }

type T9 = Prettify<Recursive, { depth: 2 }>;
//   ^? type T9 = {
//          a: {
//              a: Recursive;
//          };
//      }

type T10 = Prettify<Recursive, { depth: 15 }>;
//   ^? type T10 = {
//          a: {
//              a: {
//                  a: {
//                      a: {
//                          a: {
//                              a: {
//                                  a: {
//                                      a: {
//                                          a: {
//                                              a: {
//                                                  a: ...;
//                                              };
//                                          };
//                                      };
//                                  };
//                              };
//                          };
//                      };
//                  };
//              };
//          };
//      }

type T11 = Prettify<Recursive, { depth: 0 }>;
//   ^? type T11 = {
//          a: Recursive;
//      }

type _T12 = { a: { b: { c: 2 } & { d: 3 } } & { e: 4 } };
type T12 = Prettify<_T12, { depth: 2 }>;
//   ^? type T12 = {
//          a: {
//              b: {
//                  c: 2;
//              } & {
//                  d: 3;
//              };
//              e: 4;
//          };
//      }

type _T13 = {
    a: Date;
    b: RegExp;
    c: Error;
    d: Map<1, 1>;
    e: Set<1>;
} & {
    f: WeakMap<{ a: 1 }, 1>;
    g: WeakSet<{ a: 1 }>;
    h: ReadonlyMap<1, 1>;
    i: ReadonlySet<1>;
    j: Promise<1>;
};
type T13 = Prettify<_T13>;
//   ^? type T13 = {
//          a: Date;
//          b: RegExp;
//          c: Error;
//          d: Map<1, 1>;
//          e: Set<1>;
//          f: WeakMap<{
//              a: 1;
//          }, 1>;
//          g: WeakSet<{
//              a: 1;
//          }>;
//          h: ReadonlyMap<1, 1>;
//          i: ReadonlySet<1>;
//          j: Promise<1>;
//      }

type T14 = Prettify<string & { a: 1 }>;
//   ^? type T14 = string & {
//          a: 1;
//      }

type T15 = Prettify<number & { a: 1 }>;
//   ^? type T15 = number & {
//          a: 1;
//      }

type T16 = Prettify<boolean & { a: 1 }>;
//   ^? type T16 = boolean & {
//          a: 1;
//      }

type T17 = Prettify<bigint & { a: 1 }>;
//   ^? type T17 = bigint & {
//          a: 1;
//      }

type T18 = Prettify<symbol & { a: 1 }>;
//   ^? type T18 = symbol & {
//          a: 1;
//      }

type T19 = Prettify<{ a: 1 } | ({ b: 2 } & { c: 3 })>;
//   ^? type T19 = {
//          a: 1;
//      } | {
//          b: 2;
//          c: 3;
//      }

type T20 = Prettify<{ a: 1 } & ({ b: 2 } | { c: 3 })>;
//   ^? type T20 = {
//          a: 1;
//          b: 2;
//      } | {
//          a: 1;
//          c: 3;
//      }
