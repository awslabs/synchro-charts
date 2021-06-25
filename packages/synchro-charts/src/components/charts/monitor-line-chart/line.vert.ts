export const lineVert = (showColor: boolean) => `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float width;
uniform float xPixelDensity;
uniform float yPixelDensity;
attribute vec2 currPoint;
attribute vec2 nextPoint;
attribute vec2 position;
attribute vec3 segmentColor;
varying vec3 vColor;
${showColor ? 'varying float yPositionPx;' : ''}

// line shader using instanced lines
// https://wwwtyro.net/2019/11/18/instanced-lines.html for information on this approach
void main() {
  // Convert the points to pixel coordinates - otherwise out basis vectors won't be perpendicular when
  // rasterized to the screen.
  vec2 currPointPx = vec2(currPoint.x / xPixelDensity, currPoint.y / yPixelDensity);
  vec2 nextPointPx = vec2(nextPoint.x / xPixelDensity, nextPoint.y / yPixelDensity);

  // create the basis vectors of a coordinate space where the x axis is parallel with
  // the path between currPoint and nextPoint, and the y axis is perpendicular to the
  // path between currPoint and nextPoint
  vec2 xBasis = nextPointPx - currPointPx;
  vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));

  // project the instance segment along the basis vectors
  vec2 positionPx = currPointPx + xBasis * position.x + yBasis * width * position.y;

  // Convert from pixel coordinates back to model space
  vec2 positionModel = vec2(positionPx.x * xPixelDensity, positionPx.y * yPixelDensity);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(positionModel, 0.0, 1.0);
  vColor = segmentColor;
  ${showColor ? 'yPositionPx = positionPx.y;' : ''}
}
`;
