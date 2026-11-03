# 0002. Own expression interpreter instead of eval

Status: accepted

## Context

Users type `{{ }}` expressions into widget properties and query variables. Running them with `eval` or `new Function` would give them access to `window`, cookies and the network. Existing sandboxes (iframes, `vm`, realm shims) add weight and still need care.

## Decision

`packages/engine` parses each expression with `jsep` and evaluates the AST with its own interpreter. Only these nodes are handled: literals, identifiers, member access, unary and binary operators, ternaries, array literals and calls to a registry of named helpers. Anything else (`this`, sequences, function literals, `new`, assignment) is rejected. Property reads skip `__proto__`, `constructor` and `prototype` and only see own properties. One evaluation is limited to 10,000 steps, and arrays to 10,000 items. ESLint bans `eval`, `new Function` and `dangerouslySetInnerHTML` in the repository.

The engine also owns the dependency graph: it extracts the root identifier of each member chain, detects cycles with a depth-first search, sorts the rest topologically and, after a change, re-evaluates only the downstream nodes. Failures are returned as `{ ok: false, error, at }` values; the engine does not throw to callers.

## Consequences

- Expressions cannot reach the page, the network or global objects, because the interpreter has no path to them.
- Missing properties give `undefined`, which matches what users of similar tools expect.
- The language is small: no function literals, no loops, no methods on values. New capabilities are added as helpers.
- Each operator and helper is implemented and tested by hand, which is more code than a library sandbox.
- The engine has no React or DOM dependency and is tested with plain Vitest.
