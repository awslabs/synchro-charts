export declare const initFPSMetering: () => {
    reset: () => void;
    fps: () => {
        average: number;
        median: number;
    };
    stop: () => void;
};
