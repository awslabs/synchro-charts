import { h, Element, Component, Prop } from '@stencil/core';
import { webGLRenderer } from './webglContext';

@Component({
  tag: 'sc-webgl-context',
  styleUrl: 'sc-webgl-context.css',
  shadow: false,
})
export class ScWebglContext {
  @Element() el!: HTMLElement;
  @Prop() onContextInitialization: (context: WebGLRenderingContext) => void;

  componentDidLoad() {
    const canvas = this.el.querySelector('canvas') as HTMLCanvasElement;
    webGLRenderer.initRendering(canvas, this.onContextInitialization);
  }

  render() {
    return <canvas class="webgl-context-canvas" />;
  }
}
