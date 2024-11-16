export const SUPPORTED_QUICKINFO_KINDS = [
    "type",
    "var",
    "local var",
    "property",
    "parameter",
    "let",
    "const",
];

export const PRETTIFY_STRING = `type PrettifyIgnore =
    | string
    | number
    | boolean
    | bigint
    | symbol
    | Date
    | RegExp
    | Error
    | Map<unknown, unknown>
    | Set<unknown>
    | WeakMap<WeakKey, unknown>
    | WeakSet<WeakKey>
    | ReadonlyMap<unknown, unknown>
    | ReadonlySet<unknown>
    | Promise<unknown>;

type PrettifyConfig = { depth: number };

type PrettifyDefaultConfig = { depth: 4 };

type PrettifyHelper<T, Config extends PrettifyConfig, Counter extends never[]> = [
    T,
] extends [PrettifyIgnore]
    ? T
    : Counter["length"] extends Config["depth"]
      ? T
      : {
            [P in keyof T]: PrettifyHelper<T[P], Config, [...Counter, never]>;
        };

export type Prettify<
    T,
    Config extends PrettifyConfig = PrettifyDefaultConfig,
> = PrettifyHelper<T, Config, []>;
`;
