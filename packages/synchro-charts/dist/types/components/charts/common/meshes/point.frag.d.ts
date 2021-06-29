declare const _default: "\nvarying vec3 vColor;\n\nvoid main() {\n  // calculate position such that the center is (0, 0) in a region of [-1, 1] x [-1, 1]\n  vec2 pos = 2.0 * gl_PointCoord.xy - 1.0;\n  // r = distance squared from the origin of the point being rendered\n  float r = dot(pos, pos);\n  if (r > 1.0) {\n    discard;\n  }\n  float alpha = 1.0 - smoothstep(0.5, 1.0, sqrt(r));\n  gl_FragColor = vec4(vColor, alpha);\n}\n";
export default _default;
