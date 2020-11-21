// declare module '*.scss' {
//     const content: {[className: string]: string};
//     export = content;
//   }

declare module '*.scss' {
  export const content: { [className: string]: string };
  export default content;
}
