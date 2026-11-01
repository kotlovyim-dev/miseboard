export interface HelperContext {
  now: () => Date;
}
export type Helper = (args: unknown[], context: HelperContext) => unknown;
export type HelperRegistry = Readonly<Record<string, Helper>>;

export const defaultHelpers: HelperRegistry = {};
