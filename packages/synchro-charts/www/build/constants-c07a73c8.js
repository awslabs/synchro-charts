const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(2000, 0, 0, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);
const Y_VALUE = 2500;
// test data point dead center of the viewport
const TEST_DATA_POINT_STANDARD = {
    x: (X_MIN.getTime() + X_MAX.getTime()) / 2,
    y: Y_VALUE,
};

export { TEST_DATA_POINT_STANDARD as T, X_MIN as X, Y_VALUE as Y, Y_MIN as a, Y_MAX as b, X_MAX as c };
