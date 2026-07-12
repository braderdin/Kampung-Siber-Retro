declare module "html2canvas" {
  export interface Html2CanvasOptions {
    backgroundColor?: string;
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    logging?: boolean;
    width?: number;
    height?: number;
  }

  export function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;

  export default html2canvas;
}
