## Environment Setup
IoT App Kit Visualizations runs on node and uses yarn for package management. Specific versions are required in order to keep builds working with the current monorepo tooling.

- Node: any `v14` or higher
- Yarn: any `v1`, but not `v2` or higher

## Building IoT App Kit Visualizations
With supported versions of node and yarn installed, you're ready to build and run IoT App Kit Visualizations locally. 

1. Run `yarn bootstrap` from the root of the repo. This will install dependencies and build all of the packages. Note: this is different from running `lerna bootstrap` which will install dependencies, but doesn't build packages.

2. Navigate to `packages/iot-app-kit-visualizations` and run `yarn start`.