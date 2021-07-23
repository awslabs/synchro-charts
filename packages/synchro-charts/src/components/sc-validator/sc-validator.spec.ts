import { newSpecPage } from '@stencil/core/testing';
import { CustomHTMLElement } from '../../utils/types';
import { Components } from '../../components';
import { ScValidator } from './sc-validator';
import { update } from '../charts/common/tests/merge';

const newScValidator = async (overrides: Partial<Components.ScValidator> = {}) => {
  const page = await newSpecPage({
    components: [ScValidator],
    html: `<div id="container" style="width: ${100}px; height: ${100}px"></div>`,
    supportsShadowDom: false,
  });
  const validator = page.doc.createElement('sc-validator') as CustomHTMLElement<Components.ScValidator>;

  const defaultProps: Components.ScValidator = {};
  update(validator, { ...defaultProps, ...overrides });

  page.body.appendChild(validator);

  await page.waitForChanges();
  return { page, validator };
};

it('skips validation if the viewport is undef', async () => {
  // Does not throw error and break the test
  await newScValidator();
});

it('passes the validation if the static viewport is valid', async () => {
  // Does not throw error and break the test
  await newScValidator({ viewport: { start: new Date(), end: new Date().toISOString() } });
});

it('passes the validation if the live viewport is valid', async () => {
  // Does not throw error and break the test
  await newScValidator({ viewport: { duration: '1h' } });
});

it('throws an error if the viewport contains a string that is not an ISO time string', async () => {
  try {
    await newScValidator({ viewport: { start: 'you', end: 'shall not pass' } });
  } catch (err) {
    expect(err.toString()).toContain('Unable to parse');
  }
});

it('throws an error if the duration is not a valid duration string like 1h', async () => {
  try {
    await newScValidator({ viewport: { duration: 'oh noes' } });
  } catch (err) {
    expect(err.toString()).toContain('Unable to parse');
  }
});
