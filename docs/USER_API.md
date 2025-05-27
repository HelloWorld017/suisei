# Suisei User API

## Primitives
### `state(intialValue: T): ReadwriteRef<T>`
### `derive((selector: VariableSelector) => T): Variable<T>`
### `deriveRef((selector: RefSelector) => T): Ref<T>`
### `map(variable: Variable<T>, mapFn: (_: T) => T2): Variable<T2>`
### `mapRef(ref: Ref<T>, mapFn: (_: T) => T2): Ref<T2>`
### `asReadonly(ref: StateRef<T>): ReadonlyRef<T>`
### `asReadwrite(ref: ReadonlyRef<T>, onWrite: (value: T) => void): ReadwriteRef<T>`
### `decompose(variable: Variable<T>): DecomposeProxy<T>`
### `decomposeRef(ref: Ref<T>): DecomposeRefProxy<T>`
### `effect(fn: EffectFn, opts?: { timing?: 'layout' | null }): void`
### `future(variable: Variable<T>): Promise<Ref<T>>`
### `useOnce(variable: Variable<T>): Promise<T>`
### `useOnceRef(ref: Ref<T>): T`
### `consume(context: Context<T>): T`
### `wait(promise: Promise<T>): Generator<T>`
### `waitForRender(updateFn: () => void, opts?: { suspense?: boolean | 'all' }): Promise<() => void>`

## Components
### `<Fragment>`
### `<Html>`
### `<Lazy>`
### `<Match>`
### `<Suspense>`
