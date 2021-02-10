import { EditorWebGLApp } from "./app/webgl/artboard/editor/EditorWebGLApp";

setTimeout(() => {
  const root:EditorWebGLApp = new EditorWebGLApp();
  root.init({
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
    onError: () => console.log('error initializing webgl root'),
  });
}, 300);
