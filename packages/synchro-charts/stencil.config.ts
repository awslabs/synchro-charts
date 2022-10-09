import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'synchro-charts',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [nodePolyfills()],
  copy: [{ src: 'globals' }],
  globalStyle: 'src/globals/globals.css',
  testing: {
    setupFilesAfterEnv: ['<rootDir>/configuration/jest/setupTests.ts', 'jest-extended'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['/typings/', '/src/testing/', '/cypress', '/src/scripts', '/src/storybook-plugins'],
    testPathIgnorePatterns: ['/src/testing', '/dist', '/www'],
    coverageReporters: ['text-summary', 'cobertura', 'html', 'json-summary'],
    moduleNameMapper: {
      '\\.(css|scss|svg)$': 'identity-obj-proxy',
      '^d3-(.*)$': 'd3-$1/dist/d3-$1',
    },
    modulePathIgnorePatterns: ['cypress'],
    coverageThreshold: {
      global: {
        branches: 77,
        functions: 77,
        lines: 80,
        statements: 80,
      },
    },
  },
};
