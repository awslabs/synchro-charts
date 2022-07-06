import { newE2EPage } from '@stencil/core/testing';

describe('sc-dial', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-dial></sc-dial>');

    const element = await page.find('sc-dial');
    expect(element).toHaveClass('hydrated');
  });
});
