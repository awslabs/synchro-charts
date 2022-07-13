import { newSpecPage } from '@stencil/core/testing';
import { ScDialBase } from './sc-dial-base';

describe('sc-dial-base', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDialBase],
      html: '<sc-dial-base></sc-dial-base>',
    });
    expect(page.root).toEqualHtml(`
      <sc-dial-base>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-dial-base>
    `);
  });
});
