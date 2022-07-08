## Environment Setup
Synchro Charts runs on node and uses yarn for package management. Specific versions are required in order to keep builds working with the current monorepo tooling.

- Node: any `v16` or higher
- Yarn: any `v1`, but not `v2` or higher

## Building Synchro Charts
With supported versions of node and yarn installed, you're ready to build and run Synchro Charts locally. 

1. Run `yarn bootstrap` from the root of the repo. This will install dependencies and build all of the packages. Note: this is different from running `lerna bootstrap` which will install dependencies, but doesn't build packages.

2. Navigate to `packages/synchro-charts` and run `yarn start`.