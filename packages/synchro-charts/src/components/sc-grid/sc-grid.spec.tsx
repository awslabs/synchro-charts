import { newSpecPage } from '@stencil/core/testing';
import { ScGrid } from './sc-grid';

const SOME_CHILD = 'some child node';

const newGridSpecPage = async () => {
  const page = await newSpecPage({
    components: [ScGrid],
    html: `<sc-grid>${SOME_CHILD}</sc-grid>`,
    supportsShadowDom: false,
  });
  await page.waitForChanges();

  return { page };
};

it('renders child node', async () => {
  const { page } = await newGridSpecPage();

  const grid = page.body.querySelector('sc-grid') as HTMLElement;
  expect(grid.innerHTML).toContain(SOME_CHILD);
});
