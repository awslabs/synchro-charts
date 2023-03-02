import { ConnectedComponentPageGenerator } from './types';
import { DATA_STREAMS } from './chart/constants';
import { DATA_STREAM } from '../../../../testing/__mocks__/mockWidgetProperties';

export const describeStatus = (
  pageGenerator: ConnectedComponentPageGenerator,
  tag: string,
  options: { errors?: boolean; loading?: boolean } = { errors: true, loading: true }
) => {
  describe('status', () => {
    if (options.errors) {
      describe('errors', () => {
        it('displays error when errors are present', async () => {
          const page = await pageGenerator(
            {},
            {
              dataStreams: [{ ...DATA_STREAM, error: 'error!' }],
            }
          );
          await page.waitForChanges();
          const container = await page.find(`${tag} >>> *`);
          const warning = await container.find("[data-testid='warning'");
          expect(warning).not.toBeNull();
        });

        it('does not display error when error is not present', async () => {
          const page = await pageGenerator(
            {},
            {
              dataStreams: [{ ...DATA_STREAM, error: undefined }],
            }
          );
          await page.waitForChanges();
          const container = await page.find(`${tag} >>> *`);
          const warning = await container.find("[data-testid='warning'");
          expect(warning).toBeNull();
        });
      });
    }

    if (options.loading) {
      describe('loading', () => {
        describe('first loader', () => {
          it('displays loader when loading and has no data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: true,
                dataStreams: [],
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).not.toBeNull();
          });

          it('does not display loader when loading and has data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: true,
                dataStreams: DATA_STREAMS,
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).toBeNull();
          });

          it('does not display loader when not loading and has data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: false,
                dataStreams: DATA_STREAMS,
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).toBeNull();
          });

          it('does not display loader when not loading and has data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: false,
                dataStreams: [],
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).toBeNull();
          });
        });

        describe('second loader', () => {
          it('displays loader when not loading, is currently fetching, and has no data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: false,
                isFetching: true,
                dataStreams: [],
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).not.toBeNull();
          });

          it('does not display loader when loading, not fetching, and there is data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: false,
                isFetching: false,
                dataStreams: DATA_STREAMS,
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).toBeNull();
          });

          it('does not display loader when not loading, is currently fetching, but has no data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: false,
                isFetching: true,
                dataStreams: DATA_STREAMS,
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).toBeNull();
          });

          it('does not display loader when not loading and has no data', async () => {
            const page = await pageGenerator(
              {},
              {
                isLoading: false,
                isFetching: false,
                dataStreams: [],
              }
            );
            await page.waitForChanges();
            const container = await page.find(`${tag} >>> *`);
            const loader = await container.find("[data-testid='loading']");
            expect(loader).toBeNull();
          });
        });
      });
    }
  });
};
