// Minimal TypeScript shims for TealScript ambient symbols used in contracts
// This file helps the TypeScript compiler used by the tealscript tool
// avoid strict type errors for decorators and runtime helpers.

declare const method: any;
declare const abi: any;
declare function GlobalStateKey<T>(opts: { key: string }): any;
declare function LocalStateKey<T>(opts: { key: string }): any;
declare type Address = any;
declare type uint64 = any;
declare const globals: any;
declare function itob(x: any): any;
declare function len(x: any): any;
declare function log(x: any): void;

// Utility function shims
declare function assert(cond: any, msg?: string): void;

export {};
