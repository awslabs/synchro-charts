import { newSpecPage } from '@stencil/core/testing';
import { MonitorGrid } from './monitor-grid';

const SOME_CHILD = 'some child node';

const newGridSpecPage = async () => {
  const page = await newSpecPage({
    components: [MonitorGrid],
    html: `<monitor-grid>${SOME_CHILD}</monitor-grid>`,
    supportsShadowDom: false,
  });
  await page.waitForChanges();

  return { page };
};

it('renders child node', async () => {
  const { page } = await newGridSpecPage();

  const grid = page.body.querySelector('monitor-grid') as HTMLElement;
  expect(grid.innerHTML).toContain(SOME_CHILD);
});
