// declare module '*.scss' {
//     const content: {[className: string]: string};
//     export = content;
//   }

declare module '*.scss' {
  export const content: { [className: string]: string };
  export default content;
}

declare global {
  namespace JSX {
    interface HTMLAttributes {
      styleName?: string;
    }
    interface SVGAttributes {
      styleName?: string;
    }
  }
}

namespace React {
  interface Attributes {
    styleName?: string;
  }
}
