export type VariadicFunc<T extends any[], R> = (...args: T) => R;
export type UnaryFunction<T, R> = (input: T) => R;

function pipe<A extends any[], R>(f1: VariadicFunc<A, R>): R;
function pipe<A extends any[], B, R>(f1: VariadicFunc<A, B>, f2: UnaryFunction<B, R>): R;

function pipe<A extends any[], B, C, R>(f1: VariadicFunc<A, B>, f2: UnaryFunction<B, C>, f3: UnaryFunction<C, R>): R;

function pipe<A extends any[], B, C, D, R>(
  f1: VariadicFunc<A, B>,
  f2: UnaryFunction<B, C>,
  f3: UnaryFunction<C, D>,
  f4: UnaryFunction<D, R>
): R;

function pipe<A extends any[], B, C, D, E, R>(
  f1: VariadicFunc<A, B>,
  f2: UnaryFunction<B, C>,
  f3: UnaryFunction<C, D>,
  f4: UnaryFunction<D, E>,
  f5: UnaryFunction<E, R>
): R;

// type Pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7, R8, R9> = (
//   variadic: (...args: TArgs) => R1,
//   secondFn: (value: R1) => R2,
//   thirdFn: (value: R2) => R3,
//   fourthFn: (value: R3) => R4,
//   fifthFn: (value: R4) => R5,
//   sixthFn: (value: R5) => R6,
//   seventhFn: (value: R6) => R7,
//   eighthFn: (value: R7) => R8,
//   ninthFn: (value: R8) => R9
// ) => R9;
