/* eslint-disable max-len */
import { Primitive } from '../../../utils/dataTypes';
import { isNumeric } from '../../../utils/number';
import { COMPARISON_OPERATOR, StatusIcon } from '../../../components/charts/common/constants';

export type SearchQueryParams = {
  showIcon?: boolean;
  isEnabled?: boolean;
  latestValue?: Primitive;
  threshold?: Primitive;
  numDataStreams?: number;
  showValue?: boolean;
  showName?: boolean;
  showUnit?: boolean;
  isEditing?: boolean;
};

/**
 * Construct a search query which embeds the test case parameters we wish to utilize.
 *
 * Use this to construct test route URLs for integration testing.
 */
export const constructSearchQuery = ({
  latestValue = undefined,
  threshold = undefined,
  showIcon = false,
  isEnabled = true,
  numDataStreams = 1,
  showValue = true,
  showName = true,
  showUnit = true,
  isEditing = false,
}: SearchQueryParams): string =>
  `threshold=${threshold}&showIcon=${showIcon}&isEnabled=${isEnabled}&latestValue=${String(
    latestValue
  )}&numDataStreams=${numDataStreams}&showValue=${showValue}&showUnit=${showUnit}&showName=${showName}&isEditing=${isEditing}`;

const parsePrimitive = (param: string | null): Primitive | null => {
  if (param == null || param === 'null' || param === 'undefined') {
    return null;
  }
  if (isNumeric(param)) {
    return Number.parseInt(param, 10);
  }
  return param;
};

/**
 * Parse the URL Search Query to construct models to build a test case out of.
 */
export const testCaseParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const isEnabledParam = urlParams.get('isEnabled');
  const latestValueParam = urlParams.get('latestValue');
  const numDataStreamsParam = urlParams.get('numDataStreams');
  const showNameParam = urlParams.get('showName');
  const showValueParam = urlParams.get('showValue');
  const showUnitParam = urlParams.get('showUnit');
  const isEditingParam = urlParams.get('isEditing');
  const thresholdValue = parsePrimitive(urlParams.get('threshold'));
  const showIconParam = urlParams.get('showIcon');

  /**
   * Parse Param
   */

  let latestValue: Primitive | null;
  if (latestValueParam == null || latestValueParam === 'null' || latestValueParam === 'undefined') {
    latestValue = null;
  } else if (isNumeric(latestValueParam)) {
    latestValue = Number.parseInt(latestValueParam, 10);
  } else {
    latestValue = latestValueParam;
  }

  const numDataStreams =
    numDataStreamsParam && isNumeric(numDataStreamsParam) ? Number.parseInt(numDataStreamsParam, 10) : 1;

  const isEnabled = isEnabledParam !== 'false';
  const isEditing = isEditingParam !== 'false';

  const showName = showNameParam !== 'false';
  const showValue = showValueParam !== 'false';
  const showUnit = showUnitParam !== 'false';
  const showIcon = showIconParam !== 'false';

  /** Construct threshold */
  let threshold;
  if (thresholdValue != null) {
    threshold = {
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      color: 'red',
      value: thresholdValue,
      icon: showIcon ? StatusIcon.NORMAL : undefined,
    };
  }

  return {
    threshold,
    latestValue,
    numDataStreams,
    isEnabled,
    labelsConfig: { showName, showValue, showUnit },
    isEditing,
  };
};
