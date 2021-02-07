import { WebGLRoot } from "./app/webgl/artboard/WebGLRoot";

setTimeout(() => {
  const root:WebGLRoot = new WebGLRoot();
  root.init({
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
    onError: () => console.log('error initializing webgl root'),
  });
}, 300);
