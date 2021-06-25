import { trendLinePoints } from './trendLinePoints';

it('returns empty list when given nothing', () => {
  expect(
    trendLinePoints({
      trendResults: [],
      dataStreams: [],
      displayedDate: new Date(),
    })
  ).toBeEmpty();
});
