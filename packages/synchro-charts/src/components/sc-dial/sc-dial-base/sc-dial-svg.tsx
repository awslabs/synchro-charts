import { h } from '@stencil/core';
import { NO_VALUE_PRESENT } from '../../../constants';
import { round } from '../../../utils/number';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { sizeConfigurations } from './util';

export const DialSVG = ({ percent, point, breachedThreshold, stream, fontSize }) => {
  const left = 653.5 * (1 - percent);
  const right = 653.5 - left;
  const labelColor = breachedThreshold?.color || sizeConfigurations.BLUE;
  const label = breachedThreshold?.label?.show ? breachedThreshold?.label?.text : '';
  const icon = breachedThreshold ? breachedThreshold.icon : undefined;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 276 276"
      data-testid="current-value"
      preserveAspectRatio="xMidYMin meet"
    >
      <circle
        cx="138"
        cy="138"
        r="104"
        stroke-width="34"
        stroke="#d9d9d9"
        fill="none"
        transform="matrix(1,0,0,-1,0,276)"
        stroke-dasharray={percent === 0 ? `${left} ${right}` : `${left - 2} ${right + 2}`}
        stroke-dashoffset="-167"
      />
      {point && right - 2 > 0 && (
        <circle
          cx="138"
          cy="138"
          r="104"
          stroke-width="34"
          stroke={labelColor}
          fill="none"
          stroke-dasharray={percent === 1 ? `${right} ${left}` : `${right - 2} ${left + 2}`}
          transform="matrix(1,0,0,1,0,0)"
          stroke-dashoffset="165"
        />
      )}

      {point ? (
        <text x="138" y="142" font-size={fontSize.value} font-weight="bold" text-anchor="middle">
          <tspan dy={stream && !stream.unit ? 0 : 10}>
            {stream && stream.unit ? round(point?.y as number) : round(percent * 100)}
            <tspan font-size={fontSize.unit}>{(stream && stream.unit) || '%'}</tspan>
          </tspan>
        </text>
      ) : (
        <text
          x="138"
          y="140"
          font-size={fontSize.value}
          font-weight="bold"
          text-anchor="middle"
          fill={sizeConfigurations.SECONDARYTEXT}
        >
          <tspan dy={stream && point && !stream.unit ? 0 : 10}>{NO_VALUE_PRESENT}</tspan>
        </text>
      )}

      {stream && point && !stream.unit && !breachedThreshold ? (
        <text
          x="138"
          y="173"
          font-weight="bold"
          font-size={fontSize.label}
          text-anchor="middle"
          fill={sizeConfigurations.PRIMARYTEXT}
        >
          Medium
        </text>
      ) : null}

      {stream && !stream.unit && breachedThreshold && label && (
        <g transform="matrix(1,0,0,1,78,162)">
          <text
            x="25"
            y="17"
            font-size={fontSize.label}
            font-weight="bold"
            textLength="80"
            lengthAdjust="spacing"
            fill={labelColor || sizeConfigurations.PRIMARYTEXT}
          >
            {label}
          </text>
          {icon && getIcons(icon, labelColor, fontSize.alarm)}
        </g>
      )}
    </svg>
  );
};
