import { Component, h, Prop } from '@stencil/core';

/**
 * Expandable Input
 *
 * An stylized input which grows as you type into it.
 */
@Component({
  tag: 'iot-app-kit-vis-expandable-input',
  styleUrl: 'sc-expandable-input.css',
  shadow: false,
})
export class ScExpandableInput {
  @Prop() value!: string;
  @Prop() onValueChange!: (value: string) => void;
  @Prop() isDisabled?: boolean;

  onChange = (e: Event) => {
    const span = e.target as HTMLSpanElement;
    this.onValueChange(span.innerText);
  };

  render() {
    const { value, isDisabled = false } = this;
    return (
      <span
        data-test-tag="expandable-input"
        contentEditable={!isDisabled}
        class={`sc-expandable-input aws-util-font-size-1 ${isDisabled ? 'disabled' : ''}`}
        // spellCheck={('false' as unknown) as boolean}
        onBlur={this.onChange}
      >
        {value}
      </span>
    );
  }
}
