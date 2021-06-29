/**
 * Expandable Input
 *
 * An stylized input which grows as you type into it.
 */
export declare class ScExpandableInput {
    value: string;
    onValueChange: (value: string) => void;
    isDisabled?: boolean;
    onChange: (e: Event) => void;
    render(): any;
}
