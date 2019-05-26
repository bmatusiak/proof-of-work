import { Buffer } from 'buffer';

export interface ISolveOptions {
  timestamp: number;
}

export class Solver {
  public solve(complexity: number, prefix?: Buffer, opts?: ISolveOptions): Buffer;
}

export interface IVerifierOptions {
  readonly size: number;
  readonly n: number;
  readonly complexity: number;
  readonly validity?: number;
  readonly prefix?: Buffer;
}

export class Verifier {
  constructor(options: IVerifierOptions);

  public check(nonce: Buffer, complexity?: number): boolean;
  public reset(): void;
}
