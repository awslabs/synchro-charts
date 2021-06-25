/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const csv = require('convert-array-to-csv');

const PERFORMANCE_REPORTS_DIR = 'performance_reports';
const perfPath = path.resolve(PERFORMANCE_REPORTS_DIR);
console.info(`Generating report from performance reports in: ${perfPath}`);

const fileNames = fs.readdirSync(perfPath).filter(filename => filename.includes('perf.'));

const aggregatedReport = {};

const isoMatcher = new RegExp(/(?<year>[0-9]{4})-?(?<month>1[0-2]|0[1-9])-?(?<day>3[01]|0[1-9]|[12][0-9])/);

fileNames.forEach(fileName => {
  const rawContent = fs.readFileSync(`${perfPath}/${fileName}`);
  const content = JSON.parse(rawContent);
  const timeStampIndex = fileName.match(isoMatcher).index;
  const category = fileName.slice(0, timeStampIndex);
  if (aggregatedReport[category] == null) {
    aggregatedReport[category] = {};
  }
  aggregatedReport[category][fileName] = content;
});

const reportFileJson = `${perfPath}/aggregate-perf-report-${new Date().toISOString()}.json`;

fs.writeFileSync(reportFileJson, JSON.stringify(aggregatedReport, null, 2));

console.info(`wrote aggregated performance JSON report at: ${reportFileJson}`);

const rows = [
  ['category', 'file name', 'test case', 'number of runs', 'average', 'median', 'stdDevMedian', 'stdDevAverage'],
];
Object.keys(aggregatedReport).forEach(category => {
  Object.keys(aggregatedReport[category]).forEach(fileName => {
    Object.keys(aggregatedReport[category][fileName]).forEach(testCase => {
      const values = Object.keys(aggregatedReport[category][fileName][testCase]).map(
        attr => aggregatedReport[category][fileName][testCase][attr]
      );
      rows.push([category, fileName, testCase, ...values]);
    });
  });
});

const reportFileCsv = `${perfPath}/aggregate-perf-report-${new Date().toISOString()}.csv`;
fs.writeFileSync(reportFileCsv, csv.convertArrayToCSV(rows));
console.info(`wrote aggregated performance CSV report at: ${reportFileCsv}`);
