/* eslint-disable */
import { initFPSMetering } from '../../../src/utils/fps';
import { DAY_IN_MS, SECOND_IN_MS } from '../../../src/utils/time';
import { avg, standardDeviation } from '../../utils';

const root = '/tests/sc-webgl-chart/performance';

type PerfTestCase = {
  // The minimum frames per second which will be considered a passing test
  minFPS: number;
  // Duration in ms the test runs
  testDuration: number;
  // Duration of each round in ms
  roundFrequency: number;
  // Data added per round
  dataPerRound: number;
  // Incremental increase in MS of the viewport per frame
  viewportSpeed?: number;
};

const RUN_EACH_TEST_NUM_TIMES = 1;

const testCases: PerfTestCase[] = [
  /**
   * Short period of time with large amount of data coming in
   */
  {
    minFPS: 15,
    testDuration: 5 * SECOND_IN_MS,
    roundFrequency: SECOND_IN_MS / 10,
    dataPerRound: 15000,
  },
  /**
   * At near-idle, should have a very high FPS
   */
  {
    minFPS: 60,
    testDuration: 10 * SECOND_IN_MS,
    roundFrequency: SECOND_IN_MS / 10,
    dataPerRound: 1,
  },
  /**
   * We want to have a series of test cases which are all similar except in duration
   * to help demonstrate how our performance varies over time.
   */
  {
    minFPS: 18,
    testDuration: 5 * SECOND_IN_MS,
    roundFrequency: SECOND_IN_MS / 50,
    dataPerRound: 2000,
  },
  {
    minFPS: 11,
    testDuration: 15 * SECOND_IN_MS,
    roundFrequency: SECOND_IN_MS / 50,
    dataPerRound: 2000,
  },
  /**
   * With View Port speed
   */
  {
    minFPS: 10,
    testDuration: 5 * SECOND_IN_MS,
    roundFrequency: SECOND_IN_MS / 50,
    dataPerRound: 2000,
    viewportSpeed: DAY_IN_MS,
  },
  {
    minFPS: 7,
    testDuration: 15 * SECOND_IN_MS,
    roundFrequency: SECOND_IN_MS / 50,
    dataPerRound: 2000,
    viewportSpeed: DAY_IN_MS,
  },
];

describe.skip('line chart', () => {
  beforeEach(() => {
    // We want to wait a little bit which gives the browser time to collect garbage and chill.
    cy && cy.wait(SECOND_IN_MS);
  });

  const results: any = {};

  describe('with all data being added within the viewport', () => {
    testCases.forEach(({ viewportSpeed, minFPS, roundFrequency, dataPerRound, testDuration }) => {
      const testName = `${viewportSpeed != null ? `view port moving at a rate of ${viewportSpeed}ms ` : ''}with ${dataPerRound} data per round, coming in at a frequency of ${roundFrequency}ms, a min FPS will be ${minFPS} over a duration of ${Math.floor(
        testDuration / SECOND_IN_MS
      )}sec`;
      results[testName] = {};
      new Array(RUN_EACH_TEST_NUM_TIMES).fill(0).forEach((_, runNum) => {
        it(`RUN ${runNum + 1}: ${testName}`, () => {
          cy.visit(
            `${root}/sc-line-chart-stream-data?viewportSpeed=${viewportSpeed || 0}&roundFrequency=${roundFrequency}&dataPerRound=${dataPerRound}`
          );
          cy.get('sc-line-chart').should('exist');

          const { fps, stop } = initFPSMetering();

          cy.wait(testDuration).then(() => {
            const fpsResults = fps();
            results[testName].median = results[testName].median ? [...results[testName].median, fpsResults.median] : [fpsResults.median];
            results[testName].average = results[testName].average ? [...results[testName].average, fpsResults.average] : [fpsResults.average];
            expect(fpsResults.average).to.be.gte(minFPS);
            stop();
          });
        });
      });
    });
  });

  after('output perf results', () => {
    const translatedResults: TestCaseResults = {};
    Object.keys(results).forEach(testName => {
      const testResults = results[testName];
      translatedResults[testName] = {
        numberOfRuns: RUN_EACH_TEST_NUM_TIMES,
        average: Math.floor(avg(testResults.average)),
        median: Math.floor(avg(testResults.median)),
        stdDevMedian: Math.floor(standardDeviation(testResults.median)),
        stdDevAverage: Math.floor( standardDeviation(testResults.average) ),
      }
    });
    cy.writeFile(`performance_reports/perf.sc-chart-perf-${new Date().toISOString()}.json`, translatedResults);
  });
})

