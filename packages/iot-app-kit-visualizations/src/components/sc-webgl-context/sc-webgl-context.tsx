import { h, Element, Component, Prop } from '@stencil/core';
import { webGLRenderer } from './webglContext';

@Component({
  tag: 'iot-app-kit-vis-webgl-context',
  styleUrl: 'sc-webgl-context.css',
  shadow: false,
})
export class ScWebglContext {
  @Element() el!: HTMLElement;
  @Prop() onContextInitialization: (context: WebGLRenderingContext) => void;
  @Prop() viewFrame: HTMLElement | Window | undefined;

  componentDidLoad() {
    const canvas = this.el.querySelector('canvas') as HTMLCanvasElement;
    webGLRenderer.initRendering(canvas, this.onContextInitialization, this.viewFrame);
  }

  render() {
    const viewportViewFrame = this.viewFrame === undefined || this.viewFrame instanceof Window;
    const classes = `webgl-context-canvas ${viewportViewFrame ? 'webgl-context-canvas-viewport' : ''}`;
    return <canvas class={classes} />;
  }
}
