import { h, Element, Component } from '@stencil/core';
import { webGLRenderer } from './webglContext';

@Component({
  tag: 'sc-webgl-context',
  styleUrl: 'sc-webgl-context.css',
  shadow: false,
})
export class ScWebglContext {
  @Element() el!: HTMLElement;

  componentDidLoad() {
    const canvas = this.el.querySelector('canvas') as HTMLCanvasElement;
    webGLRenderer.initRendering(canvas);
  }

  render() {
    return <canvas class="webgl-context-canvas" />;
  }
}
