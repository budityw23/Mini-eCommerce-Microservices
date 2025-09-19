# Coding Standards

- **Language**: Node.js with CommonJS modules. Services will migrate to Express-based implementations in later phases.
- **Linting**: Run `npm run lint` before committing. All lint warnings are treated as errors.
- **Formatting**: Use Prettier via `npm run format:write`.
- **Testing**: Use Jest. Run `npm test` (or `npm test --workspace <package>`) before pushing changes.
- **Directory Layout**: Place runtime code under `src/` and tests under `__tests__/` inside each workspace.
- **Environment Variables**: Each service will consume `.env` files once implemented. Keep secrets out of source control.
