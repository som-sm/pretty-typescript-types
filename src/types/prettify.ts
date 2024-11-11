type PrettifyIgnore =
    | Date
    | RegExp
    | Error
    | Map<any, any>
    | Set<any>
    | WeakMap<any, any>
    | WeakSet<any>
    | ReadonlyMap<any, any>
    | ReadonlySet<any>
    | Promise<any>;

export type Prettify<T> = T extends PrettifyIgnore
    ? T
    : { [P in keyof T]: Prettify<T[P]> };
