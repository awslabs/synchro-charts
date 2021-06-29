export declare const MAX_COLORS_SUPPORTED = 6;
export declare const SEQUENTIAL_BLUES_MUTED: string[][];
export declare const SEQUENTIAL_QUALITATIVE_MUTED: string[][];
export declare const enum PalletScheme {
    BLUE_MUTED = "blue-MUTED",
    QUALITATIVE_MUTED = "qualitative-muted"
}
export declare const getPalette: (pallet: PalletScheme, numColors: number) => string[];
