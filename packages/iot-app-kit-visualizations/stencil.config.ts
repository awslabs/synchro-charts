import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'iot-app-kit-visualizations',
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
  tsconfig: './tsconfig.build.json',
  testing: {
    setupFilesAfterEnv: ['<rootDir>/configuration/jest/setupTests.ts', 'jest-extended'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['/typings/', '/src/testing/', '/cypress', '/src/scripts', '/src/storybook-plugins'],
    testPathIgnorePatterns: ['/src/testing', '/dist', '/www'],
    coverageReporters: ['text-summary', 'cobertura', 'html', 'json-summary'],
    moduleNameMapper: {
      '\\.(css|scss|svg)$': 'identity-obj-proxy',
      'd3-format': 'd3-format/dist/d3-format',
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
