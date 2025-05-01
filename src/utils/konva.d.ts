// This file adds type definitions for the Konva library when accessed via window.Konva
interface KonvaAnimation {
    start: () => void;
    stop: () => void;
  }
  
  interface KonvaNode {
    getLayer: () => any;
    add: (child: any) => void;
    destroyChildren: () => void;
    opacity: (value: number) => void;
  }
  
  interface KonvaFactory {
    Rect: any;
    Circle: any;
    Line: any;
    Animation: new (callback: (frame: any) => void, layer: any) => KonvaAnimation;
  }
  
  declare global {
    interface Window {
      Konva: KonvaFactory;
      Image: any;
    }
  }
  
  export {};