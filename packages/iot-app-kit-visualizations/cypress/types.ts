type TestCaseResult = {
  numberOfRuns: number;
  average: number;
  median: number;
  stdDevMedian: number;
  stdDevAverage: number;
};

type TestCaseResults = {
  [testName: string]: TestCaseResult;
};
