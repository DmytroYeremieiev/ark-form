/// <reference types="next" />
/// <reference types="next/types/global" />

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
