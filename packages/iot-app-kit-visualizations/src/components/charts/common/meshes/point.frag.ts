export default `
varying vec3 vColor;

void main() {
  // calculate position such that the center is (0, 0) in a region of [-1, 1] x [-1, 1]
  vec2 pos = 2.0 * gl_PointCoord.xy - 1.0;
  // r = distance squared from the origin of the point being rendered
  float r = dot(pos, pos);
  if (r > 1.0) {
    discard;
  }
  float alpha = 1.0 - smoothstep(0.5, 1.0, sqrt(r));
  gl_FragColor = vec4(vColor, alpha);
}
`;
