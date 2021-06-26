import { MAX_THRESHOLD_BANDS } from '../common/annotations/thresholdBands';

export default `
// This file is only being used when we have threshold bands
// that will break the line segments into different color
#define MAX_NUM_TOTAL_THRESHOLD_BAND ${MAX_THRESHOLD_BANDS}

precision highp float;
struct Band {
  float upper;
  float lower;
  vec3 color;
};

varying vec3 vColor;
varying float yPositionPx;
uniform float yPixelDensity;
uniform Band thresholdBands[MAX_NUM_TOTAL_THRESHOLD_BAND];

// Fills in triangles which make up a line segment, with the corresponding color
void main() {
  for(int i = 0; i < MAX_NUM_TOTAL_THRESHOLD_BAND; i++) {
    bool isRangeBreached = yPositionPx > thresholdBands[i].lower / yPixelDensity
      && yPositionPx < thresholdBands[i].upper / yPixelDensity;
    bool isEqualsThreshold = thresholdBands[i].lower == thresholdBands[i].upper;
    bool isEqualsThresholdBreached = yPositionPx == thresholdBands[i].upper;

    if (isRangeBreached || (isEqualsThreshold && isEqualsThresholdBreached)) {
       gl_FragColor = vec4(thresholdBands[i].color / 255.0, 1.0);
       break;
    } else {
       gl_FragColor = vec4(vColor, 1.0);
    }
  }
}
`;
