import { r as registerInstance, h } from './index-44bccbc7.js';
import { C as COMPARISON_OPERATOR, a as StatusIcon, L as LEGEND_POSITION } from './constants-4b21170a.js';
import { D as DataType, S as StreamType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';
import { c as createCommonjsModule } from './_commonjsHelpers-8f072dc7.js';

/**
 * Data Construction
 *
 * We want to construct a widget which displays a numerical data stream, with two alarm string data streams with
 * corresponding thresholds.
 *
 * We do this by monitoring the "oil change status" and "could get speeding ticket" alarm.
 */
// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const DIFF = X_MAX.getTime() - X_MIN.getTime();
const SOME_NUM = 60;
const OK = 'OK';
const ALARM = 'ALARM';
/**
 * MPH Data
 */
const getMPHData = () => [
    {
        x: X_MIN.getTime() + DIFF / 5,
        y: SOME_NUM / 5,
    },
    {
        x: X_MIN.getTime() + (DIFF * 2) / 5,
        y: SOME_NUM / 4,
    },
    {
        x: X_MIN.getTime() + (DIFF * 3) / 5,
        y: SOME_NUM,
    },
    {
        x: X_MIN.getTime() + (DIFF * 4) / 5,
        y: SOME_NUM * 2,
    },
];
const speedingAlarmData = () => [
    {
        x: X_MIN.getTime() + DIFF / 5,
        y: OK,
    },
    {
        x: X_MIN.getTime() + (DIFF * 2) / 5,
        y: OK,
    },
    {
        x: X_MIN.getTime() + (DIFF * 3) / 5,
        y: OK,
    },
    {
        x: X_MIN.getTime() + (DIFF * 4) / 5,
        y: ALARM,
    },
];
const oilAlarmData = () => [
    {
        x: X_MIN.getTime() + DIFF / 5,
        y: OK,
    },
    {
        x: X_MIN.getTime() + (DIFF * 2) / 5,
        y: OK,
    },
    {
        x: X_MIN.getTime() + (DIFF * 3) / 5,
        y: ALARM,
    },
    {
        x: X_MIN.getTime() + (DIFF * 4) / 5,
        y: ALARM,
    },
];
const speedingAlarmInfo = {
    dataType: DataType.STRING,
    resolution: 0,
    id: 'speeding-alarm',
    color: 'red',
    name: 'speeding alarm',
    streamType: StreamType.ALARM,
};
const oilChangeAlarmInfo = {
    dataType: DataType.STRING,
    resolution: 0,
    id: 'oil-change-alarm',
    color: 'orange',
    name: 'oil change alarm',
    streamType: StreamType.ALARM,
};
const dataStreamInfoWithAlarms = {
    dataType: DataType.NUMBER,
    resolution: 0,
    id: 'stream-with-alarms',
    color: 'black',
    name: 'mph',
    associatedStreams: [
        { id: speedingAlarmInfo.id, type: StreamType.ALARM },
        { id: oilChangeAlarmInfo.id, type: StreamType.ALARM },
    ],
};
const INFOS = [dataStreamInfoWithAlarms, speedingAlarmInfo, oilChangeAlarmInfo];
const mphStream = {
    id: dataStreamInfoWithAlarms.id,
    dataType: dataStreamInfoWithAlarms.dataType,
    color: 'black',
    name: 'mph',
    aggregates: {
        [MINUTE_IN_MS]: getMPHData(),
    },
    data: [],
    resolution: MINUTE_IN_MS,
    associatedStreams: [
        {
            id: speedingAlarmInfo.id,
            type: StreamType.ALARM,
        },
        {
            id: speedingAlarmInfo.id,
            type: StreamType.ALARM,
        },
    ],
};
const speedingAlarmStream = {
    id: speedingAlarmInfo.id,
    color: 'red',
    name: 'speeding alarm',
    streamType: StreamType.ALARM,
    dataType: speedingAlarmInfo.dataType,
    data: speedingAlarmData(),
    resolution: 0,
};
const oilAlarmStream = {
    id: oilChangeAlarmInfo.id,
    dataType: oilChangeAlarmInfo.dataType,
    data: oilAlarmData(),
    color: 'orange',
    name: 'oil change alarm',
    streamType: StreamType.ALARM,
    resolution: 0,
};
const DATA = [mphStream, speedingAlarmStream, oilAlarmStream];
const VIEW_PORT = {
    start: X_MIN,
    end: X_MAX,
};
const SIZE = {
    height: 500,
    width: 500,
};
const speedingThreshold = {
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    dataStreamIds: [speedingAlarmStream.id],
    value: ALARM,
    color: 'red',
    severity: 1,
    icon: StatusIcon.ACTIVE,
};
const speedingOkThreshold = {
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    dataStreamIds: [speedingAlarmStream.id],
    value: OK,
    color: 'green',
    icon: StatusIcon.NORMAL,
};
const oilChangeThreshold = {
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    dataStreamIds: [oilAlarmStream.id],
    value: ALARM,
    color: 'orange',
    severity: 2,
    icon: StatusIcon.ACTIVE,
};
const thresholds = [speedingThreshold, oilChangeThreshold, speedingOkThreshold];
const ANNOTATIONS = { y: thresholds };
const LEGEND = {
    position: LEGEND_POSITION.RIGHT,
    width: 200,
};

'use strict';
var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

'use strict';
var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

var decodeUriComponent = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

'use strict';

var splitOnFirst = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};

'use strict';
var filterObj = function (obj, predicate) {
	var ret = {};
	var keys = Object.keys(obj);
	var isArr = Array.isArray(predicate);

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var val = obj[key];

		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
			ret[key] = val;
		}
	}

	return ret;
};

var queryString = createCommonjsModule(function (module, exports) {
'use strict';





const isNullOrUndefined = value => value === null || value === undefined;

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
		case 'separator':
			return key => (result, value) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (result.length === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};

		default:
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
		case 'separator':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeUriComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(query, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof query !== 'string') {
		return ret;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return ret;
	}

	for (const param of query.split('&')) {
		if (param === '') {
			continue;
		}

		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ','
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key])) ||
		(options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const key of Object.keys(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = object[key];
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (url, options) => {
	options = Object.assign({
		decode: true
	}, options);

	const [url_, hash] = splitOnFirst(url, '#');

	return Object.assign(
		{
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		},
		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
	);
};

exports.stringifyUrl = (object, options) => {
	options = Object.assign({
		encode: true,
		strict: true
	}, options);

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = exports.extract(object.url);
	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

	const query = Object.assign(parsedQueryFromUrl, object.query);
	let queryString = exports.stringify(query, options);
	if (queryString) {
		queryString = `?${queryString}`;
	}

	let hash = getHash(object.url);
	if (object.fragmentIdentifier) {
		hash = `#${encode(object.fragmentIdentifier, options)}`;
	}

	return `${url}${queryString}${hash}`;
};

exports.pick = (input, filter, options) => {
	options = Object.assign({
		parseFragmentIdentifier: true
	}, options);

	const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
	return exports.stringifyUrl({
		url,
		query: filterObj(query, filter),
		fragmentIdentifier
	}, options);
};

exports.exclude = (input, filter, options) => {
	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

	return exports.pick(input, exclusionFilter, options);
};
});
var queryString_1 = queryString.extract;
var queryString_2 = queryString.parse;
var queryString_3 = queryString.stringify;
var queryString_4 = queryString.parseUrl;
var queryString_5 = queryString.stringifyUrl;
var queryString_6 = queryString.pick;
var queryString_7 = queryString.exclude;

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const parseBool = (str) => str === 'true';
const deserializeAnnotations = (str) => {
    const a = JSON.parse(str);
    if (a.x) {
        throw new Error('need to implement this.');
    }
    return a;
};
const SCREEN_SIZE = {
    width: 700,
    height: 450,
};
const constructSearchQuery = (_a) => {
    var { viewPortStart, viewPortEnd, dataStreams, asyncDataStreams, alarms, dataStreamInfos, legend, tableColumns, annotations, messageOverrides, axis } = _a, 
    // Props that can be directly serialized, i.e. numbers, booleans, and strings
    serializableProps = __rest(_a, ["viewPortStart", "viewPortEnd", "dataStreams", "asyncDataStreams", "alarms", "dataStreamInfos", "legend", "tableColumns", "annotations", "messageOverrides", "axis"]);
    return queryString_3(Object.assign({ 
        // manually serialize fields that require it.
        annotations: annotations && JSON.stringify(annotations), legend: legend && JSON.stringify(legend), dataStreamInfos: dataStreamInfos && JSON.stringify(dataStreamInfos), dataStreams: dataStreams && JSON.stringify(dataStreams), asyncDataStreams: asyncDataStreams && JSON.stringify(asyncDataStreams), alarms: alarms && JSON.stringify(alarms), viewPortStart: viewPortStart && viewPortStart.toISOString(), viewPortEnd: viewPortEnd && viewPortEnd.toISOString(), tableColumns: tableColumns && JSON.stringify(tableColumns), messageOverrides: messageOverrides && JSON.stringify(messageOverrides), axis: axis && JSON.stringify(axis) }, serializableProps));
};
const deserializeDataStream = (almostDataStream) => (Object.assign(Object.assign({}, almostDataStream), { data: almostDataStream.data.map((point) => ({ x: Number(point.x), y: point.y })) }));
const testCaseParameters = () => {
    const query = queryString_2(window.location.search);
    // Instructions for extending: default should be undefined, or if required, some empty state.
    // DO NOT send mock data here! it should be the bare minimum to render. Consider this the default empty state.
    return {
        alarms: query.alarms ? JSON.parse(query.alarms) : undefined,
        width: query.width ? JSON.parse(query.width) : undefined,
        axis: query.axis ? JSON.parse(query.axis) : undefined,
        height: query.height ? JSON.parse(query.height) : undefined,
        duration: query.duration ? JSON.parse(query.duration) : undefined,
        errMsg: query.errMsg,
        gestures: query.gestures != null ? parseBool(query.gestures) : true,
        delayBeforeDataLoads: query.delayBeforeDataLoads != null ? JSON.parse(query.delayBeforeDataLoads) : 0,
        dataStreamInfos: query.dataStreamInfos != null ? JSON.parse(query.dataStreamInfos) : [],
        tableColumns: query.tableColumns != null ? JSON.parse(query.tableColumns) : [],
        legend: query.legend != null ? JSON.parse(query.legend) : LEGEND,
        messageOverrides: query.messageOverrides != null ? JSON.parse(query.messageOverrides) : undefined,
        componentTag: query.componentTag != null ? query.componentTag : 'sc-line-chart',
        // deserialize fields that require it.
        displayInfoNames: query.displayInfoNames ? parseBool(query.displayInfoNames) : false,
        annotations: query.annotations != null ? deserializeAnnotations(query.annotations) : undefined,
        isEditing: query.isEditing != null ? parseBool(query.isEditing) : false,
        hasError: query.hasError != null ? parseBool(query.hasError) : false,
        dataStreams: query.dataStreams != null ? JSON.parse(query.dataStreams).map(deserializeDataStream) : [],
        asyncDataStreams: query.asyncDataStreams != null ? JSON.parse(query.asyncDataStreams).map(deserializeDataStream) : [],
        viewPortStart: query.viewPortStart != null ? new Date(query.viewPortStart) : new Date(2000, 0, 0),
        viewPortEnd: query.viewPortEnd != null ? new Date(query.viewPortEnd) : new Date(2000, 0, 1),
    };
};

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 400;
const { 
/** Chart configurations */
alarms, messageOverrides, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, axis, componentTag, annotations, viewPortStart, viewPortEnd, duration, isEditing, dataStreams, gestures, legend, tableColumns, } = testCaseParameters();
const viewPort = Object.assign(Object.assign({}, VIEW_PORT), { start: viewPortStart, end: viewPortEnd, duration, group: 'some-viewport-group' });
const size = Object.assign(Object.assign({}, SIZE), { width,
    height });
const WidgetTestRoute = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.dataStreamInfos = [];
        this.component = componentTag;
    }
    onWidgetUpdated({ detail: configUpdate }) {
        if (configUpdate.dataStreamInfo) {
            this.dataStreamInfos = configUpdate.dataStreamInfo;
        }
    }
    render() {
        return (h("div", null, h("div", { style: { width: `${width}px`, height: `${height}px` } }, h(this.component, { widgetId: "some-widget-id", dataStreams: dataStreams, isEditing: isEditing, alarms: alarms, viewPort: viewPort, legend: legend, size: size, axis: axis, tableColumns: tableColumns, annotations: annotations, gestures: gestures, messageOverrides: messageOverrides,
            /** TODO: Port these over to the message overrides */
            invalidTagErrorHeader: "invalidComponentTag.header", invalidTagErrorSubheader: "invalidComponentTag.subheader", liveModeOnlyMessage: "invalidWidgetForHistoricalData.content" })), h("sc-webgl-context", null)));
    }
};

export { WidgetTestRoute as widget_test_route };
