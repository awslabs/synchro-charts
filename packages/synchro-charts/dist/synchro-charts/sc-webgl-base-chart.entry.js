import { h, r as registerInstance, i as createEvent, g as getElement } from './index-44bccbc7.js';
import { L as LEGEND_POSITION, S as ScaleType } from './constants-4b21170a.js';
import { T as TREND_TYPE, S as StreamType } from './dataConstants-a26ff694.js';
import './terms-d11f73d5.js';
import { S as SECOND_IN_MS } from './time-f374952b.js';
import './three.module-af3affdd.js';
import { w as webGLRenderer } from './webglContext-25ec9599.js';
import { a as isNumberDataStream } from './predicates-ced25765.js';
import { a as commonjsGlobal } from './_commonjsHelpers-8f072dc7.js';
import { d as getValueAndText, e as getColor, f as getText, h as getValueText, a as getDataPoints, i as isThreshold, j as getNumberAnnotations } from './utils-11cae6c8.js';
import './index-25df4638.js';
import { i as isNumeric } from './number-0c56420d.js';
import { a as getVisibleData } from './dataFilters-8fe55407.js';
import { E as EmptyStatus } from './EmptyStatus-3149dfe5.js';
import { a as DEFAULT_THRESHOLD_OPTIONS, b as DEFAULT_THRESHOLD_OPTIONS_OFF, D as DEFAULT_CHART_CONFIG } from './chartDefaults-c377c791.js';
import { l as lodash_isequal } from './index-b2bbb4e2.js';
import { s as select, t as time, l as linear } from './index-af4372bf.js';
import { g as getTrendValue, T as TREND_LINE_DASH_ARRAY, a as TREND_LINE_STROKE_WIDTH, b as getAllTrendResults } from './trendAnalysis-2c871eae.js';

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_throttle = throttle;

const LOADING_SPINNER_SIZE_PX = 60;
const LoadingStatus = ({ isLoading }) => (h("div", { style: {
        zIndex: '11',
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: isLoading ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    } }, isLoading && h("sc-loading-spinner", { size: LOADING_SPINNER_SIZE_PX })));

const ErrorStatus = ({ hasError, size: { marginLeft, width } }) => {
    return hasError ? (h("div", { style: { position: 'absolute', width: `${width}px` } },
        h("div", { class: "awsui-util-mt-s", style: {
                left: `${marginLeft}px`,
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'row-reverse',
            } },
            h("sc-error-badge", null, "Stopped")))) : (h("div", { "data-test-tag": "error-badge-place-holder", style: { display: 'none' } }));
};

const chartLegendContainerClassName = 'chart-legend-container';
const ChartLegendContainer = ({ legendHeight, config, size: { height, marginRight, marginLeft, marginBottom, marginTop, width }, }, children) => {
    const sharedStyles = {
        position: 'relative',
        overflowY: 'scroll',
        msOverflowStyle: 'none',
    };
    return config.position === LEGEND_POSITION.BOTTOM ? (h("div", { class: chartLegendContainerClassName, style: Object.assign(Object.assign({}, sharedStyles), { top: `${height + marginTop + marginBottom}px`, marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, height: `${legendHeight}px`, width: `${width}px` }) }, children)) : (h("div", { class: chartLegendContainerClassName, style: Object.assign(Object.assign({}, sharedStyles), { top: `${marginTop}px`, marginLeft: `${marginLeft + width + marginRight}px`, width: `${config.width}px`, marginRight: '0', height: `${height}px` }) }, children));
};

/* Data Container is the tracking element used to draw our visualizations for this chart onto */
const DataContainer = ({ size: { width, height, marginLeft, marginTop } }, children) => (h("div", { style: {
        width: `${width}px`,
        height: `${height}px`,
        marginLeft: `${marginLeft}px`,
        marginTop: `${marginTop}px`,
    }, class: "data-container" }, children));

const ANNOTATION_FONT_SIZE = 10;
const ANNOTATION_STROKE_WIDTH = 1.5;

const getX = ({ annotation, width, viewPort, }) => {
    const { start, end } = viewPort;
    return Math.floor((width / (end.getTime() - start.getTime())) * (annotation.value.getTime() - start.getTime()));
};

const TEXT_SELECTOR = 'text.x';
const renderXAnnotationTexts = ({ container, xAnnotations, viewPort, resolution, width, }) => {
    const xTextSelection = select(container)
        .selectAll(TEXT_SELECTOR)
        // x annotations with text to display
        .data(xAnnotations.filter(annotation => getValueAndText({ annotation, resolution, viewPort }) !== ''));
    const getXAnnotationTextX = (a) => -getX({ annotation: a, width, viewPort });
    const padding = 5;
    /** Create */
    xTextSelection
        .enter()
        .append('text')
        .text(annotation => getValueAndText({ annotation, resolution, viewPort }))
        .attr('font-size', ANNOTATION_FONT_SIZE)
        .attr('class', 'x')
        .attr('y', getXAnnotationTextX)
        .attr('x', 0)
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .style('transform', `rotate(90deg) translateY(${-padding}px)`)
        .style('fill', getColor);
    /** Update */
    xTextSelection
        .text(annotation => getValueAndText({ annotation, resolution, viewPort }))
        .attr('y', getXAnnotationTextX)
        .style('fill', getColor);
    /** Delete */
    xTextSelection.exit().remove();
};
const removeXAnnotationTexts = ({ container }) => {
    select(container)
        .selectAll(TEXT_SELECTOR)
        .remove();
};

const getY = ({ annotation, height, viewPort, }) => {
    const { yMax, yMin } = viewPort;
    return height - ((annotation.value - yMin) * height) / (yMax - yMin);
};

const PADDING = 5;
const TEXT_SELECTOR$1 = 'text.y';
const TEXT_VALUE_SELECTOR = 'text.yValueText';
const renderYAnnotationTexts = ({ container, yAnnotations, viewPort, resolution, size: { width, height }, }) => {
    const getYPosition = (annotation) => getY({
        annotation,
        height,
        viewPort,
    });
    /**
     * Y Annotations Text
     */
    const getYAnnotationTextY = (a) => getYPosition(a) - PADDING;
    const yTextSelection = select(container)
        .selectAll(TEXT_SELECTOR$1)
        // x annotations with text to display
        .data(yAnnotations.filter(annotation => getText(annotation) !== ''));
    /** Create */
    yTextSelection
        .enter()
        .append('text')
        .attr('font-size', ANNOTATION_FONT_SIZE)
        .attr('class', 'y')
        .attr('x', width - PADDING)
        .attr('text-anchor', 'end')
        .attr('y', getYAnnotationTextY)
        .text(getText)
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .style('fill', getColor);
    /** Update */
    yTextSelection
        .attr('y', getYAnnotationTextY)
        .text(getText)
        .style('fill', getColor);
    yTextSelection.exit().remove();
    /**
     * Y Annotations Value Text
     */
    const yAnnotationValueTextPadding = 3;
    const yAnnotationValueTextLeftPadding = 8;
    const getYAnnotationValueTextY = (a) => getYPosition(a) + yAnnotationValueTextPadding;
    const yValueTextSelection = select(container)
        .selectAll(TEXT_VALUE_SELECTOR)
        // x annotations with text to display
        .data(yAnnotations.filter(annotation => getValueText({ annotation, resolution, viewPort }) !== ''));
    /** Create */
    yValueTextSelection
        .enter()
        .append('text')
        .attr('font-size', ANNOTATION_FONT_SIZE)
        .attr('class', 'yValueText')
        .attr('x', width + yAnnotationValueTextLeftPadding)
        .attr('text-anchor', 'start')
        .attr('y', getYAnnotationValueTextY)
        .text(annotation => getValueText({ annotation, resolution, viewPort }))
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .style('fill', getColor);
    /** Update */
    yValueTextSelection
        .attr('y', getYAnnotationValueTextY)
        .attr('x', width + yAnnotationValueTextLeftPadding)
        .text(annotation => getValueText({ annotation, resolution, viewPort }))
        .style('fill', getColor);
    yValueTextSelection.exit().remove();
};
const removeYAnnotationTexts = ({ container }) => {
    /**
     * Y Annotations Text
     */
    select(container)
        .selectAll(TEXT_SELECTOR$1)
        .remove();
    /**
     * Y Annotations Value Text
     */
    select(container)
        .selectAll(TEXT_VALUE_SELECTOR)
        .remove();
};

const LINE_SELECTOR = 'line.x';
const renderXAnnotationLines = ({ container, xAnnotations, viewPort, size: { width, height }, }) => {
    /**
     * X Annotations Lines
     */
    const xSelection = select(container)
        .selectAll(LINE_SELECTOR)
        .data(xAnnotations);
    /** Create */
    xSelection
        .enter()
        .append('line')
        .attr('class', 'x')
        .attr('font-size', ANNOTATION_FONT_SIZE)
        .attr('x1', annotation => getX({ annotation, width, viewPort }))
        .attr('x2', annotation => getX({ annotation, width, viewPort }))
        .attr('y1', 0)
        .attr('y2', height)
        .style('stroke', getColor)
        .style('stroke-width', ANNOTATION_STROKE_WIDTH);
    /** Update */
    xSelection
        .attr('x1', annotation => getX({ annotation, width, viewPort }))
        .attr('x2', annotation => getX({ annotation, width, viewPort }))
        .attr('y2', height)
        .attr('stroke', getColor);
    /** Delete */
    xSelection.exit().remove();
};
const removeXAnnotationLines = ({ container }) => {
    /**
     * X Annotations Lines
     */
    select(container)
        .selectAll(LINE_SELECTOR)
        .remove();
};

const LINE_SELECTOR$1 = 'line.y';
const renderYAnnotationLines = ({ container, yAnnotations, viewPort, size: { width, height }, }) => {
    const getYPosition = (annotation) => getY({
        annotation,
        height,
        viewPort,
    });
    /**
     * Y Annotations Lines
     */
    const ySelection = select(container)
        .selectAll(LINE_SELECTOR$1)
        .data(yAnnotations);
    /** Create */
    ySelection
        .enter()
        .append('line')
        .attr('class', 'y')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', getYPosition)
        .attr('y2', getYPosition)
        .style('stroke', getColor)
        .style('stroke-width', ANNOTATION_STROKE_WIDTH);
    /** Update */
    ySelection
        .attr('x2', width)
        .attr('y1', getYPosition)
        .attr('y2', getYPosition)
        .style('stroke', getColor);
    /** Delete */
    ySelection.exit().remove();
};
const removeYAnnotationLines = ({ container }) => {
    /**
     * X Annotations Lines
     */
    select(container)
        .selectAll(LINE_SELECTOR$1)
        .remove();
};

const withinViewport = (viewPort) => {
    return ({ value }) => {
        if (typeof value === 'number') {
            return viewPort.yMin <= value && viewPort.yMax >= value;
        }
        return viewPort.start <= value && viewPort.end >= value;
    };
};
const renderAnnotations = ({ container, resolution, annotations, viewPort, size }) => {
    if (typeof annotations === 'object' && typeof annotations.show === 'boolean' && !annotations.show) {
        removeXAnnotationLines({ container });
        removeXAnnotationTexts({ container });
        removeYAnnotationLines({ container });
        removeYAnnotationTexts({ container });
        return;
    }
    // get annotations which have a value that lays within the viewport.
    const xAnnotations = annotations.x == null ? [] : annotations.x.filter(withinViewport(viewPort));
    const yAnnotations = annotations.y == null ? [] : annotations.y.filter(withinViewport(viewPort));
    /**
     * X Annotations Text
     */
    renderXAnnotationTexts({
        container,
        xAnnotations,
        viewPort,
        resolution,
        width: size.width,
    });
    /**
     * Y Annotations Text
     */
    renderYAnnotationTexts({
        container,
        yAnnotations,
        viewPort,
        resolution,
        size,
    });
    /**
     * X Annotations Lines
     */
    renderXAnnotationLines({
        container,
        xAnnotations,
        viewPort,
        size,
    });
    /**
     * Y Annotations Lines
     */
    renderYAnnotationLines({
        container,
        yAnnotations,
        viewPort,
        size,
    });
};

const getLinearPathCommand = ({ trendResult, size: { width, height }, viewPort: { start, end, yMin, yMax }, }) => {
    // convert y-value to pixel position for start and end points of path
    const startY = Math.round(height - ((getTrendValue(trendResult, start.getTime()) - yMin) * height) / (yMax - yMin));
    const endY = Math.round(height - ((getTrendValue(trendResult, end.getTime()) - yMin) * height) / (yMax - yMin));
    // create draw commands for SVG paths
    return `M 0 ${startY} L ${width} ${endY}`;
};
const renderTrendLines = ({ container, viewPort, size: { width, height }, dataStreams, trendResults, }) => {
    const linearPathCommands = [];
    trendResults.forEach(trendResult => {
        const dataStream = dataStreams.find(elt => elt.id === trendResult.dataStreamId);
        if (dataStream) {
            switch (trendResult.type) {
                case TREND_TYPE.LINEAR:
                    linearPathCommands.push({
                        color: trendResult.color || dataStream.color || 'black',
                        command: getLinearPathCommand({
                            trendResult,
                            size: { width, height },
                            viewPort,
                        }),
                    });
                    break;
                default:
                    /* eslint-disable-next-line no-console */
                    console.error(`Unable to render trend line for trend type '${trendResult.type}'.`);
            }
        }
    });
    // select existing path elements
    const linearSelection = select(container)
        .selectAll('path.linear-regression')
        .data(linearPathCommands);
    // create
    linearSelection
        .enter()
        .append('path')
        .attr('class', 'linear-regression')
        .attr('stroke', data => data.color)
        .attr('stroke-dasharray', TREND_LINE_DASH_ARRAY)
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', TREND_LINE_STROKE_WIDTH)
        .attr('d', data => data.command);
    // update
    linearSelection.attr('stroke', data => data.color).attr('d', data => data.command);
    // clean up extra path elements
    linearSelection.exit().remove();
};

var slice = Array.prototype.slice;

function identity(x) {
  return x;
}

var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6;

function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

function number(scale) {
  return function(d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return +scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + 0.5,
        range1 = +range[range.length - 1] + 0.5,
        position = (scale.bandwidth ? center : number)(scale.copy()),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon)
          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", epsilon)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient == right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d)); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = slice.call(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : slice.call(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  return axis;
}

function axisTop(scale) {
  return axis(top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

const X_TICK_DISTANCE_PX = 100;
// Y ticks can be closer since the height of a label is much less than the max width of a label across multiple resolutions
const Y_TICK_DISTANCE_PX = 30;
const MIN_TICK_COUNT = 2;
const getTickCount = ({ width, height }, { yScaleType }) => {
    const xTickCount = Math.max(Math.floor(width / X_TICK_DISTANCE_PX), MIN_TICK_COUNT);
    const yTickCount = Math.max(Math.floor(height / (Y_TICK_DISTANCE_PX + (yScaleType === ScaleType.Log ? 60 : 0))), MIN_TICK_COUNT);
    return { xTickCount, yTickCount };
};

/**
 * Axis Display Constants
 */
const PADDING_FACTOR = 0;
const TICK_SIZE = 0;
const TICK_PADDING = 10;

const DEFAULT_AXIS_OPTIONS = {
    showX: true,
    showY: true,
};
/**
 *
 * Utils
 *
 */
const scales = (size, viewPort) => {
    const xScale = time()
        .domain([viewPort.start.getTime(), viewPort.end.getTime()])
        .range([0, size.width]);
    const yScale = linear()
        .domain([viewPort.yMin, viewPort.yMax])
        .range([size.height, 0]);
    return {
        xScale,
        yScale,
    };
};
const tickCount = (size) => getTickCount({ width: size.width, height: size.height }, {
    xScaleSide: 'bottom',
    yScaleSide: 'left',
    yScaleType: ScaleType.Linear,
    xScaleType: ScaleType.Linear,
});
/**
 *
 * Axis Construction
 *
 */
const xAxisConstructor = (size, viewPort) => {
    const { xTickCount } = tickCount(size);
    const { xScale } = scales(size, viewPort);
    return axisBottom(xScale)
        .ticks(xTickCount)
        .tickPadding(TICK_PADDING)
        .tickSize(TICK_SIZE);
};
const yAxisConstructor = (size, viewPort) => {
    const { yTickCount } = tickCount(size);
    const { yScale } = scales(size, viewPort);
    return axisLeft(yScale)
        .ticks(yTickCount)
        .tickSize(-size.width)
        .tickPadding(TICK_PADDING);
};
/** D3 call to construct the X Axis */
const xAxisCall = (size, viewPort) => (selection) => selection
    .attr('transform', `translate(${size.marginLeft}, ${size.marginTop + size.height})`)
    .call(xAxisConstructor(size, viewPort));
/** D3 call to construct the Y Axis */
const yAxisCall = (size, viewPort) => (selection) => selection
    .attr('transform', `translate(${size.marginLeft}, ${size.marginTop})`)
    .call(yAxisConstructor(size, viewPort));
const renderAxis = () => {
    // Store axis element references to prevent re-querying DOM nodes on every render.
    let yAxis;
    let xAxisSeparator;
    let xAxis;
    const axisRenderer = ({ container, viewPort, size, axis }) => {
        const sel = select(container);
        const { showX, showY, labels } = Object.assign(Object.assign({}, DEFAULT_AXIS_OPTIONS), axis);
        if (!showX && xAxis && xAxisSeparator) {
            xAxis.remove();
            xAxis = null;
            xAxisSeparator.remove();
            xAxisSeparator = null;
        }
        if (!showY && yAxis) {
            yAxis.remove();
            yAxis = null;
        }
        if (showX && !xAxis) {
            // Adds the x axis separator between the chart and the y axis points
            sel
                .append('line')
                .attr('class', 'x-axis-separator')
                .attr('x1', size.marginLeft)
                .attr('y1', size.height + size.marginTop)
                .attr('x2', size.width + size.marginLeft)
                .attr('y2', size.height + size.marginTop);
            // Create X Axis
            sel
                .append('g')
                .attr('class', 'axis x-axis')
                .call(xAxisCall(size, viewPort));
            // Note: We are assuming that axis within a component aren't destroyed and recreated.
            xAxis = select(container.querySelector('.x-axis'));
            xAxisSeparator = select(container.querySelector('.x-axis-separator'));
            if (!xAxis) {
                // This implies there's a issue in the utilization of this method. Should never occur.
                throw new Error('Failed to initialize the axis component');
            }
        }
        if (showY && !yAxis) {
            // Create Y Axis
            sel
                .append('g')
                .attr('class', 'axis y-axis')
                .call(yAxisCall(size, viewPort));
            // Note: We are assuming that axis within a component aren't destroyed and recreated.
            yAxis = select(container.querySelector('.y-axis'));
            if (!yAxis) {
                // This implies there's a issue in the utilization of this method. Should never occur.
                throw new Error('Failed to initialize the axis component');
            }
        }
        if (xAxis) {
            xAxis.call(xAxisCall(size, viewPort));
            /** Update X Axis Separator */
            if (xAxisSeparator) {
                xAxisSeparator
                    .attr('x1', size.marginLeft)
                    .attr('y1', size.height + size.marginTop)
                    .attr('x2', size.width + size.marginLeft)
                    .attr('y2', size.height + size.marginTop);
            }
        }
        if (yAxis) {
            /** Update Y Axis */
            if (labels && labels.yAxis) {
                const newContent = labels.yAxis.content;
                const currentLabel = sel.select('.y-axis-label');
                if (currentLabel.empty() || newContent !== currentLabel.text()) {
                    if (!currentLabel.empty()) {
                        currentLabel.remove();
                    }
                    sel
                        .append('text')
                        .attr('class', 'y-axis-label')
                        .attr('transform', 'translate(10, 10)')
                        .text(() => newContent);
                }
            }
            yAxis.call(yAxisCall(size, viewPort));
        }
    };
    return axisRenderer;
};

const orderOfMagnitude = (n) => {
    const o = Math.log10(Math.abs(n));
    return Math.ceil(o);
};
const roundedMagnitude = (n) => {
    const m = orderOfMagnitude(n);
    return n > 0 ? 10 ** m : -1 * 10 ** m;
};
const DEFAULT_ROUNDING_DIVISOR = 50;
const roundedToNearest = (rMag, n) => (roundUp) => {
    const a = n / (rMag / DEFAULT_ROUNDING_DIVISOR);
    const b = rMag / DEFAULT_ROUNDING_DIVISOR;
    return roundUp ? Math.ceil(a) * b : Math.floor(a) * b;
};
const roundToOrderOfMagnitude = (n, min) => {
    if (n === 0) {
        return 0;
    }
    const roundedY = roundedToNearest(roundedMagnitude(n), n);
    return n < 0 ? roundedY(min) : roundedY(!min);
};
const DEFAULT_Y_RANGE = {
    yMax: 1000,
    yMin: 1,
};
const getBufferHeightByRange = (yMin, yMax) => {
    let bufferHeight = 0;
    // Adding padding such that the data's y-values are not flush with the view port
    if (yMax === yMin) {
        // Taking care of the case where yMax === yMin as well as a special case where both are 0
        bufferHeight = yMax !== 0 ? Math.abs(yMax * 0.5 /* SAME_VALUE */) : 0.5 /* SAME_VALUE */;
    }
    else {
        bufferHeight = (yMax - yMin) * 0.15 /* STANDARD */;
    }
    return bufferHeight;
};
const getYRangeWithBuffers = ({ yValues, startFromZero }) => {
    if (yValues.length === 0) {
        return DEFAULT_Y_RANGE;
    }
    const dataRange = yValues.reduce((yRange, currentY) => ({
        yMin: Math.min(currentY, yRange.yMin),
        yMax: Math.max(currentY, yRange.yMax),
    }), {
        yMin: Infinity,
        yMax: -Infinity,
    });
    const noNegativeValues = dataRange.yMin >= 0;
    const noPositiveValues = dataRange.yMax <= 0;
    const bufferHeight = getBufferHeightByRange(dataRange.yMin, dataRange.yMax);
    let yMax = dataRange.yMax + bufferHeight;
    let yMin = dataRange.yMin - bufferHeight;
    // Special case where yMax ans yMin is both zero. We will want to have padding.
    if (dataRange.yMax !== 0 || dataRange.yMin !== 0) {
        // If should start from zero and all in view points are positive, we set the yMin to zero
        if (startFromZero && noNegativeValues) {
            yMin = 0;
        }
        // If should start from zero and all in view points are negative, we set the yMax to zero.
        if (startFromZero && noPositiveValues) {
            yMax = 0;
        }
    }
    return {
        yMin: roundToOrderOfMagnitude(yMin, true),
        yMax: roundToOrderOfMagnitude(yMax, false),
    };
};
const getYRange = ({ points, yAnnotations, startFromZero, }) => {
    // Extract out Y values for each of the data set for normalization.
    const yDataValues = points.map(point => point.y);
    const yAnnotationValues = yAnnotations.map(yAnnotation => yAnnotation.value);
    return getYRangeWithBuffers({ yValues: [...yDataValues, ...yAnnotationValues], startFromZero });
};
// TODO: Remove the tests dependency on currentYValue, and then delete this code. DO NOT USE THIS FUNCTION
const currentYRange = () => {
    let lastYRange = DEFAULT_Y_RANGE;
    return ({ points, yAnnotations, startFromZero, }) => {
        if (points.length === 0 && yAnnotations.length === 0) {
            return lastYRange;
        }
        lastYRange = getYRange({ points, yAnnotations, startFromZero });
        return lastYRange;
    };
};

const scWebglBaseChartCss = "sc-webgl-base-chart .sc-webgl-base-chart{height:0}sc-webgl-base-chart .empty-status{z-index:11;position:absolute;width:100%;height:100%;display:flex;justify-content:center;text-align:center;flex-direction:column;align-items:center;pointer-events:none;color:var(--light-text);font-size:var(--font-size-1)}sc-webgl-base-chart .empty-status h3{font-size:var(--font-size-3);line-height:var(--line-height-3);padding-bottom:var(--font-size-2);font-weight:normal}sc-webgl-base-chart .data-container{position:absolute}sc-webgl-base-chart .selection{fill:rgba(41, 168, 221, var(--selection-opacity));stroke-width:var(--selection-width);stroke:var(--selection-color);stroke-opacity:var(--selection-opacity);z-index:11}sc-webgl-base-chart .chart-legend-container{-ms-overflow-style:none;scrollbar-width:none}sc-webgl-base-chart .chart-legend-container::-webkit-scrollbar{display:none}sc-webgl-base-chart .threshold-container{z-index:5;position:absolute;pointer-events:none;font-size:12px}sc-webgl-base-chart .trend-container{z-index:4;position:absolute;pointer-events:none}";

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;
const LEGEND_HEIGHT = 100;
const DATE_RANGE_EMIT_EVENT_MS = 0.5 * SECOND_IN_MS;
const DEFAULT_SHOW_DATA_STREAM_COLOR = true;
const ScWebglBaseChart = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.widgetUpdated = createEvent(this, "widgetUpdated", 7);
        this.dateRangeChange = createEvent(this, "dateRangeChange", 7);
        this.isEditing = false;
        this.annotations = {};
        this.trends = [];
        this.displaysError = true;
        this.yRangeStartFromZero = false;
        // Utilized to trigger a re-render once the data container is present to allow the
        // tooltip component to be properly rendered.
        this.isMounted = false;
        /**
         * Active View Port Config
         */
        this.yMin = this.viewPort.yMin || 0;
        this.yMax = this.viewPort.yMax || 100;
        // NOTE: If a start and end date are not provided, that means we are in 'live' mode
        this.start = this.viewPort.start || new Date(Date.now() - this.viewPort.duration);
        this.end = this.viewPort.end || new Date();
        this.trendResults = [];
        this.axisRenderer = renderAxis();
        this.getAxisContainer = () => {
            if (!this.axisContainer) {
                // Grab the svg within `<sc-webgl-axis />` component
                this.axisContainer = this.el.querySelector('svg.axis');
            }
            return this.axisContainer;
        };
        /**
         * On Widget Updated - Persist `DataStreamInfo`
         *
         * Emits an event which persists the current `NameValue[]` state into the
         * data stream.
         */
        this.updateDataStreamName = ({ streamId, name }) => {
            // Construct the config update with the new names specified.
            const configUpdate = {
                widgetId: this.configId,
                dataStreams: this.dataStreams.map(dataStream => {
                    return {
                        id: dataStream.id,
                        name: dataStream.id === streamId ? name : dataStream.name,
                    };
                }),
            };
            this.widgetUpdated.emit(configUpdate);
        };
        this.onDateRangeChange = lodash_throttle(([start, end, from]) => {
            this.dateRangeChange.emit([start, end, from]);
            /**
             * Ensure that data is present for the requested range.
             */
            if (this.requestData) {
                setTimeout(() => {
                    if (this.requestData) {
                        // NOTE: This is fired in a separate tick to prevent it from being render blocking.
                        this.requestData({ start, end });
                    }
                }, 0);
            }
        }, DATE_RANGE_EMIT_EVENT_MS, {
            leading: true,
            trailing: true,
        });
        this.chartSizeConfig = () => {
            const size = this.chartSize();
            const { marginTop, marginBottom, marginLeft, marginRight, height, width } = size;
            const chartHeight = height - marginBottom - marginTop;
            const isRightLegend = this.legend && this.legend.position === LEGEND_POSITION.RIGHT;
            const isBottomLegend = this.legend && this.legend.position === LEGEND_POSITION.BOTTOM;
            return Object.assign(Object.assign({}, size), { width: Math.max(width - marginLeft - marginRight - (isRightLegend ? this.legend.width : 0), MIN_WIDTH), height: chartHeight - (isBottomLegend ? LEGEND_HEIGHT : 0) });
        };
        /**
         * Get Active View Port
         *
         * Returns a view port with the current y range applied.
         * This can differ from the view port passed in, as
         * translations to the y range are only applied locally
         * as opposed to being applied via config changes from above.
         */
        this.activeViewPort = () => ({
            start: this.start,
            end: this.end,
            yMin: this.yMin,
            yMax: this.yMax,
            group: this.viewPort.group,
        });
        this.handleCameraEvent = ({ start, end }) => {
            if (this.scene) {
                // Update Camera
                webGLRenderer.updateViewPorts({ start, end, manager: this.scene });
                // Emit date range change to allow other non-webgl based components to sync the new date range
                this.onDateRangeChange([start, end, this.viewPort.group]);
            }
        };
        /**
         * Updates the active view port y range.
         */
        this.updateYRange = () => {
            // Filter down the data streams to only contain data within the viewport
            const inViewPoints = this.dataStreams
                .filter(isNumberDataStream)
                .map(stream => getVisibleData(getDataPoints(stream, stream.resolution), { start: this.start, end: this.end }, false))
                .flat();
            const yAnnotations = (this.annotations && Array.isArray(this.annotations.y) && this.annotations.y) || [];
            const { yMin, yMax } = getYRange({
                points: inViewPoints,
                yAnnotations: yAnnotations.filter(annotation => isNumeric(annotation.value)),
                startFromZero: this.yRangeStartFromZero,
            });
            /** Update active viewport. */
            this.yMin = this.viewPort.yMin != null ? this.viewPort.yMin : yMin;
            this.yMax = this.viewPort.yMax != null ? this.viewPort.yMax : yMax;
            this.applyYRangeChanges();
        };
        /**
         * Apply Y Range Changes
         *
         * Updates the scene camera to point to the correct location
         */
        this.applyYRangeChanges = () => {
            if (this.scene) {
                /** Update threejs camera to have the updated viewport */
                this.scene.camera.top = this.yMax;
                this.scene.camera.bottom = this.yMin;
                // NOTE: This is required to make the changes to the camera take effect.
                // This updates the matricies which represent the cameras transformation.
                // This is done by setting a uniform for the shaders which are referenced to the
                // vertex shaders to translate and skew the coordinate space.
                this.scene.camera.updateProjectionMatrix();
            }
        };
        /**
         * Container Helpers
         *
         * Help provide an efficient way to have the correct mount point on the DOM.
         * We want to prevent the DOM from being re-queried for performance concerns.
         */
        this.getDataContainer = () => {
            if (this.dataContainer == null) {
                this.dataContainer = this.el.querySelector('.data-container');
            }
            return this.dataContainer;
        };
        this.getThresholdContainer = () => {
            if (this.thresholdContainer == null) {
                this.thresholdContainer = this.el.querySelector('.threshold-container');
            }
            return this.thresholdContainer;
        };
        this.getTrendContainer = () => {
            if (this.trendContainer == null) {
                this.trendContainer = this.el.querySelector('.trend-container');
            }
            return this.trendContainer;
        };
        this.thresholds = () => this.annotations && this.annotations.y ? this.annotations.y.filter(isThreshold) : [];
        this.getThresholdOptions = () => {
            // If user did not pass in any threshold options, we just use default
            if (this.annotations == null || this.annotations.thresholdOptions == null) {
                return DEFAULT_THRESHOLD_OPTIONS;
            }
            const { thresholdOptions } = this.annotations;
            // if threshold option is a type of bool, it means that we either turn on all defaults or
            // disable all defaults.
            if (typeof thresholdOptions === 'boolean') {
                return thresholdOptions ? DEFAULT_THRESHOLD_OPTIONS : DEFAULT_THRESHOLD_OPTIONS_OFF;
            }
            // If its a threshold object, then we just use the user's setting and override it with the default settings
            // that we have
            return Object.assign(Object.assign({}, DEFAULT_THRESHOLD_OPTIONS), thresholdOptions);
        };
        /**
         * Lifecycle method
         *
         * Called every time the component mounts, or has it's data, viewport, or size changed.
         *
         * Provide no `hasDataChanged` to prevent a re-processing of the chart scenes.
         */
        this.onUpdate = ({ start, end }, hasDataChanged = false, hasSizeChanged = false, hasAnnotationChanged = false) => {
            /**
             * Failure Handling
             */
            if (!this.scene) {
                // This should never occur - if it does, it's not recoverable so we just bail.
                throw new Error('[SynchroCharts] Scene is not present but update is being called.');
            }
            if (!this.el.isConnected) {
                // Disconnected failure case:
                // This can occur in very 'stressed' performance situations where updates get called
                // and then a chart is disconnected. We can recover from this by removing itself
                // from the view port manager and bailing on the update.
                /* eslint-disable-next-line no-console */
                console.error(`[SynchroCharts] chart with associated scene id of ${this.scene.id} is disconnected,
         but still being called via the view port manager. removing from the view port manager.`);
                // necessary to make sure that the allocated memory is released, and nothing is incorrectly rendered.
                webGLRenderer.removeChartScene(this.scene.id);
                this.scene = null;
                return;
            }
            /**
             * Update Procedure
             */
            // Update Active Viewport
            this.start = start;
            this.end = end;
            if (!this.supportString) {
                this.updateYRange();
            }
            // Render chart scene
            this.updateAndRegisterChartScene({ hasDataChanged, hasSizeChanged, hasAnnotationChanged });
            // settings to utilize in all feature updates.
            const viewPort = this.activeViewPort();
            const size = this.chartSizeConfig();
            if (this.onUpdateLifeCycle) {
                // Call all passed in updates - custom features
                this.onUpdateLifeCycle(this.activeViewPort());
            }
            /**
             *
             * Features
             *
             * Place custom features which are built into the chart at the base level here.
             * Non-base chart features should instead be delegated via the `onUpdateLifeCycle` hook.
             */
            /**
             * Annotations Feature
             *
             * Currently only supports rendering annotations for number data streams
             */
            if (!this.supportString) {
                const numberAnnotations = getNumberAnnotations(this.annotations);
                renderAnnotations({
                    container: this.getThresholdContainer(),
                    annotations: numberAnnotations,
                    viewPort,
                    size,
                    // TODO: Revisit this.
                    // If no data streams are present we will fallback to a resolution of 0, i.e. 'raw' data
                    resolution: this.dataStreams[0] ? this.dataStreams[0].resolution : 0,
                });
            }
            /**
             * Trend Lines Feature
             *
             * Currently only supports rendering trends for number data streams
             */
            if (!this.supportString) {
                const dataStreamsWithTrends = this.visualizedDataStreams().filter(isNumberDataStream);
                this.trendResults = getAllTrendResults(viewPort, dataStreamsWithTrends, this.trends);
                renderTrendLines({
                    container: this.getTrendContainer(),
                    viewPort,
                    size,
                    dataStreams: this.visualizedDataStreams(),
                    trendResults: this.trendResults,
                });
            }
            /**
             * Axis Feature
             */
            this.axisRenderer({
                container: this.getAxisContainer(),
                viewPort,
                size,
                axis: this.axis,
            });
        };
        /**
         * Set Chart Rendering Position
         *
         * Registers the chart rectangle, which tells webGL where to render the data-vizualization to.
         * This must be called each time after a scene is set.
         *
         */
        this.setChartRenderingPosition = () => {
            if (this.scene) {
                const chartSize = this.chartSizeConfig();
                webGLRenderer.setChartRect(this.scene.id, {
                    width: chartSize.width,
                    height: chartSize.height,
                    x: this.size.x + chartSize.marginLeft,
                    y: this.size.y + chartSize.marginTop,
                    left: this.size.left + chartSize.marginLeft,
                    top: this.size.top + chartSize.marginTop,
                    right: this.size.left + chartSize.marginLeft + chartSize.width,
                    bottom: this.size.top + chartSize.marginTop + chartSize.height,
                    density: window.devicePixelRatio,
                });
            }
        };
        this.chartSize = () => {
            const marginLeft = this.size.marginLeft == null ? DEFAULT_CHART_CONFIG.size.marginLeft : this.size.marginLeft;
            const marginRight = this.size.marginRight == null ? DEFAULT_CHART_CONFIG.size.marginRight : this.size.marginRight;
            const marginTop = this.size.marginTop == null ? DEFAULT_CHART_CONFIG.size.marginTop : this.size.marginTop;
            const marginBottom = this.size.marginBottom == null ? DEFAULT_CHART_CONFIG.size.marginBottom : this.size.marginBottom;
            const minWidth = marginLeft + marginRight + MIN_WIDTH;
            const minHeight = marginTop + marginBottom + MIN_HEIGHT;
            return {
                marginLeft,
                marginRight,
                marginTop,
                marginBottom,
                width: Math.max(this.size.width, minWidth),
                height: Math.max(this.size.height, minHeight),
            };
        };
        this.renderTooltip = (marginLeft, marginTop, thresholds) => this.tooltip({
            size: this.chartSizeConfig(),
            style: { marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` },
            dataStreams: this.dataStreams,
            viewPort: this.activeViewPort(),
            dataContainer: this.getDataContainer(),
            thresholds,
            trendResults: this.trendResults,
            visualizesAlarms: this.visualizesAlarms,
        });
    }
    componentDidLoad() {
        this.setupChartScene();
        this.isMounted = true;
    }
    /**
     * Visualized Data Streams
     *
     * Returns the data streams we want to directly visualize
     * Depending on if visualizeAlarms is false, this will filter out alarm data.
     */
    visualizedDataStreams() {
        if (this.visualizesAlarms) {
            return this.dataStreams;
        }
        return this.dataStreams.filter(({ streamType }) => streamType !== StreamType.ALARM);
    }
    onViewPortChange(newViewPort, oldViewPort) {
        if (this.scene && !lodash_isequal(newViewPort, oldViewPort)) {
            const hasYRangeChanged = newViewPort.yMin !== oldViewPort.yMin || newViewPort.yMax !== oldViewPort.yMax;
            if (hasYRangeChanged) {
                /** Update active viewport. */
                this.yMin = newViewPort.yMin;
                this.yMax = newViewPort.yMax;
                /** Apply Changes */
                this.applyYRangeChanges();
            }
            // All charts are correctly synced.
            const manuallyAppliedViewPortChange = newViewPort.lastUpdatedBy == null;
            if (manuallyAppliedViewPortChange) {
                /** Update active viewport */
                this.start = newViewPort.start || new Date(Date.now() - newViewPort.duration);
                this.end = newViewPort.end || new Date();
                /**
                 * Updates viewport to the active viewport
                 */
                this.scene.updateViewPort(this.activeViewPort());
                /** Re-render scene */
                // This is a necessary call to ensure that the view port group is correctly set.
                // If `updateViewPorts` is **not** called, `updateAndRegisterChartScene` in an edge case may
                // re-create the chart resources, and set the new viewport equal to the view port groups stale viewport.
                webGLRenderer.updateViewPorts({
                    start: this.start,
                    end: this.end,
                    manager: this.scene,
                    preventPropagation: true,
                });
                this.updateAndRegisterChartScene({
                    hasDataChanged: false,
                    hasSizeChanged: false,
                    hasAnnotationChanged: false,
                });
            }
        }
    }
    onSizeChange(newProp, oldProp) {
        // NOTE: Change of legend can effect sizing
        if (!lodash_isequal(newProp, oldProp)) {
            this.onUpdate(this.activeViewPort(), false, true);
        }
    }
    onDataStreamsChange() {
        // Avoiding a deep equality check due to the cost on a potentially large object.
        this.onUpdate(this.activeViewPort(), true);
    }
    onAnnotationsChange(newProp, oldProp) {
        if (!lodash_isequal(newProp, oldProp)) {
            this.onUpdate(this.activeViewPort(), false, false, true);
        }
    }
    onTrendsChange(newProp, oldProp) {
        if (!lodash_isequal(newProp, oldProp)) {
            this.onUpdate(this.activeViewPort(), false);
        }
    }
    onAxisChange(newProp, oldProp) {
        const viewPort = this.activeViewPort();
        const size = this.chartSizeConfig();
        if (!lodash_isequal(newProp, oldProp)) {
            this.axisRenderer({
                container: this.getAxisContainer(),
                viewPort,
                size,
                axis: this.axis,
            });
        }
    }
    // NOTE: While `componentDidUnload` is deprecated, `disconnectedCallback` causes critical issues
    //       causing orphaned updates to occur, where no `scene` is present.
    componentDidUnload() {
        if (this.scene) {
            // necessary to make sure that the allocated memory is released, and nothing is incorrectly rendered.
            webGLRenderer.removeChartScene(this.scene.id);
        }
        this.scene = null;
    }
    setupChartScene() {
        this.scene = this.createChartScene({
            viewPort: this.activeViewPort(),
            chartSize: this.chartSizeConfig(),
            dataStreams: this.visualizedDataStreams(),
            alarms: this.alarms,
            container: this.getDataContainer(),
            minBufferSize: this.minBufferSize,
            bufferFactor: this.bufferFactor,
            onUpdate: this.onUpdate,
            thresholdOptions: this.getThresholdOptions(),
            thresholds: this.thresholds(),
        });
        webGLRenderer.addChartScene(this.scene);
        this.setChartRenderingPosition();
        webGLRenderer.render(this.scene);
        this.onUpdate(this.activeViewPort());
    }
    /**
     * Update and register chart scene
     *
     * handles the updating of the chart scene, and handles registering the new
     * chart scene if a new chart scene is returned.
     *
     * A new chart scene will be returned if the new data passed in has
     * more data points that the previous chart scene had room allocated for.
     */
    updateAndRegisterChartScene({ hasDataChanged, hasSizeChanged, hasAnnotationChanged, }) {
        if (this.scene) {
            if (hasSizeChanged) {
                this.setChartRenderingPosition();
            }
            const container = this.getDataContainer();
            const updatedScene = this.updateChartScene({
                scene: this.scene,
                chartSize: this.chartSizeConfig(),
                dataStreams: this.visualizedDataStreams(),
                alarms: this.alarms,
                container,
                viewPort: this.activeViewPort(),
                minBufferSize: this.minBufferSize,
                bufferFactor: this.bufferFactor,
                onUpdate: this.onUpdate,
                thresholdOptions: this.getThresholdOptions(),
                thresholds: this.thresholds(),
                hasSizeChanged,
                hasDataChanged,
                hasAnnotationChanged,
            });
            // update chart scene will return a new scene if it needed to delete the old one to make
            // the changes necessary and reconstruct a entirely new scene in it's place.
            // in this scenario we need to remove it's old scene from the global chart registry within webGL Renderer.
            const isNewChartScene = updatedScene.id !== this.scene.id;
            if (isNewChartScene) {
                // Must unregister the previous chart scene and register the new one with webgl
                webGLRenderer.removeChartScene(this.scene.id);
                this.scene = updatedScene;
                webGLRenderer.addChartScene(updatedScene, false);
                this.setChartRenderingPosition();
            }
            /** Render to canvas */
            webGLRenderer.render(this.scene);
            if (hasSizeChanged) {
                // if the size has changed, then we need to wait till the next 'frame'
                // until the DOM has updated to it's new position.
                window.setTimeout(() => {
                    if (this.scene) {
                        webGLRenderer.render(this.scene);
                    }
                }, 0);
            }
        }
    }
    render() {
        const chartSizeConfig = this.chartSizeConfig();
        const { marginLeft, marginTop, marginRight, marginBottom } = chartSizeConfig;
        const hasError = this.dataStreams.some(({ error }) => error != null);
        const shouldDisplayAsLoading = !hasError && this.visualizedDataStreams().some(({ isLoading }) => isLoading);
        const hasNoDataStreamsPresent = this.visualizedDataStreams().length === 0;
        const hasNoDataPresent = this.visualizedDataStreams().every(stream => {
            const points = getDataPoints(stream, stream.resolution);
            if (points.length === 0) {
                return true;
            }
            // Check the latest datapoint to see if its before the start of viewPort
            const isDataOutOfRange = points[points.length - 1].x < this.start.getTime();
            return isDataOutOfRange;
        });
        const thresholds = this.thresholds();
        const showDataStreamColor = this.legend != null && this.legend.showDataStreamColor != null
            ? this.legend.showDataStreamColor
            : DEFAULT_SHOW_DATA_STREAM_COLOR;
        return [
            h("div", { class: "awsui sc-webgl-base-chart" }, this.displaysError && h(ErrorStatus, { hasError: hasError, size: chartSizeConfig }), h("sc-webgl-axis", { size: chartSizeConfig }), h(DataContainer, { size: chartSizeConfig }, h(EmptyStatus, { displaysNoDataPresentMsg: this.displaysNoDataPresentMsg != null ? this.displaysNoDataPresentMsg : true, messageOverrides: this.messageOverrides || {}, isLoading: shouldDisplayAsLoading, hasNoDataPresent: hasNoDataPresent, hasNoDataStreamsPresent: hasNoDataStreamsPresent }), h(LoadingStatus, { isLoading: shouldDisplayAsLoading }), this.gestures && (h("sc-gesture-handler", { onDateRangeChange: this.handleCameraEvent, size: chartSizeConfig, viewPort: this.activeViewPort() }))), this.legend && (h(ChartLegendContainer, { config: this.legend, legendHeight: LEGEND_HEIGHT, size: chartSizeConfig }, h("sc-legend", { config: this.legend, dataStreams: this.dataStreams, visualizesAlarms: this.visualizesAlarms, updateDataStreamName: this.updateDataStreamName, viewPort: this.activeViewPort(), isEditing: this.isEditing, isLoading: shouldDisplayAsLoading, thresholds: thresholds, supportString: this.supportString, trendResults: this.trendResults, showDataStreamColor: showDataStreamColor })))),
            this.isMounted && this.renderTooltip(marginLeft, marginTop, thresholds),
            h("svg", { class: "threshold-container", width: chartSizeConfig.width + marginRight, height: chartSizeConfig.height + marginBottom, style: { marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` } }),
            h("svg", { class: "trend-container", width: chartSizeConfig.width, height: chartSizeConfig.height, style: { marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` } }),
        ];
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "viewPort": ["onViewPortChange"],
        "size": ["onSizeChange"],
        "legend": ["onSizeChange"],
        "dataStreams": ["onDataStreamsChange"],
        "annotations": ["onAnnotationsChange"],
        "trends": ["onTrendsChange"],
        "axis": ["onAxisChange"]
    }; }
};
ScWebglBaseChart.style = scWebglBaseChartCss;

export { ScWebglBaseChart as sc_webgl_base_chart };
