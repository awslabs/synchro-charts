import { newSpecPage } from '@stencil/core/testing';
import { ScDial } from '../sc-dial';

describe('sc-dial', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDial],
      html: `<sc-dial></sc-dial>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-dial>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-dial>
    `);
  });
});
