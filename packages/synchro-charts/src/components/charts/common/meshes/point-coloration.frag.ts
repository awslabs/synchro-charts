import { MAX_THRESHOLD_BANDS } from '../annotations/thresholdBands';

export default `
#define MAX_NUM_TOTAL_THRESHOLD_BAND ${MAX_THRESHOLD_BANDS}

struct Band {
  float upper;
  float lower;
  vec3 color;
};

varying vec3 vColor;
varying float positionY;

uniform Band thresholdBands[MAX_NUM_TOTAL_THRESHOLD_BAND];
uniform float yPixelDensity;

void main() {
  // calculate position such that the center is (0, 0) in a region of [-1, 1] x [-1, 1]
  vec2 pos = 2.0 * gl_PointCoord.xy - 1.0;
  // r = distance squared from the origin of the point being rendered
  float r = dot(pos, pos);
  if (r > 1.0) {
    discard;
  }
  float alpha = 1.0 - smoothstep(0.5, 1.0, sqrt(r));

  for(int i = 0; i < MAX_NUM_TOTAL_THRESHOLD_BAND; i++) {
    bool isRangeBreached = positionY >= thresholdBands[i].lower && positionY <= thresholdBands[i].upper;
    bool isEqualsThreshold = thresholdBands[i].lower == thresholdBands[i].upper;
    bool isEqualsThresholdBreached = positionY == thresholdBands[i].upper;

    if (isRangeBreached || (isEqualsThreshold && isEqualsThresholdBreached)) {
       gl_FragColor = vec4(thresholdBands[i].color /255.0, alpha);
       break;
    } else {
       gl_FragColor = vec4(vColor, alpha);
    }
  }
}
`;
