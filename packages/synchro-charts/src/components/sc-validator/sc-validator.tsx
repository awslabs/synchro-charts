import { Component, h, Prop } from '@stencil/core';
import parse from 'parse-duration';
import { MinimalViewPortConfig } from '../../utils/dataTypes';
import { isMinimalStaticViewPort } from '../../utils/predicates';
import { isValidDate } from './validator/dateValidator';

/**
 * Chart validator. It is not meant to validate if the inputs are null or not, rather it will validate if the
 * given inputs make sense.
 *
 * For example, if the viewport.start is a string, we want to check if it is an ISO string and not just
 * 'hello my name is Oliver'
 */
@Component({
  tag: 'sc-validator',
  shadow: false,
})
export class ScValidator {
  @Prop() viewport?: MinimalViewPortConfig;

  validateViewport = () => {
    if (this.viewport != null) {
      if (
        isMinimalStaticViewPort(this.viewport) &&
        (!isValidDate(this.viewport.start) || !isValidDate(this.viewport.end))
      ) {
        throw new Error(`Unable to parse start date: '${this.viewport.start}' and/or end date: '${this.viewport.end}'`);
      }

      if (
        !isMinimalStaticViewPort(this.viewport) &&
        this.viewport.duration === 'string' &&
        parse(this.viewport.duration, 'ms') == null
      ) {
        throw new Error(`Unable to parse duration: '${this.viewport.duration}'`);
      }
    }
  };

  componentWillLoad() {
    this.validateViewport();
  }
}
