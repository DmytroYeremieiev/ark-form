const defaultFieldClass = 'txo-input-container';

// export interface FormControlHelperInterface {
//   getFieldErrorMessage: () => string | null;
//   doesFieldWrapperHaveClassList: (classesToInclude?: Array<string>, classesToExclude?: Array<string>) => boolean;
//   doesFormHaveClassList: (classesToInclude?: Array<string>, classesToExclude?: Array<string>) => boolean;
// }

// export const createFormControlHelper = (container: HTMLElement, elemId: string): FormControlHelperInterface => {
//   return {
//     getFieldErrorMessage: () => getFieldErrorMessage(container, elemId),
//     doesFieldWrapperHaveClassList: (classesToInclude: Array<string>, classesToExclude: Array<string>) =>
//       doesFieldWrapperHaveClassList(container, elemId, classesToInclude, classesToExclude),
//     doesFormHaveClassList: (classesToInclude: Array<string>, classesToExclude: Array<string>) =>
//       doesFormHaveClassList(container, classesToInclude, classesToExclude),
//   };
// };

export const doesFormFieldHaveExactClassList = (
  elem: HTMLElement,
  classesToInclude: Array<string> = []
): boolean => {
  return doesElemHaveExactClassList(elem, [
    defaultFieldClass,
    ...classesToInclude,
  ]);
};
export const doesElemHaveExactClassList = (
  elem: HTMLElement,
  classesToInclude: Array<string> = []
): boolean => {
  const classList = elem.classList;
  if (classList.length !== classesToInclude.length) {
    return false;
  }
  for (let i = 0; i < classesToInclude.length; i++) {
    const classToCheck = classesToInclude[i];
    if (!classList.contains(classToCheck)) {
      return false;
    }
  }
  return true;
};
export const doesElemHaveClassList = (
  elem: HTMLElement,
  classesToInclude: Array<string> = [],
  classesToExclude: Array<string> = []
): boolean => {
  const classList = elem.classList;
  for (let i = 0; i < classesToInclude.length; i++) {
    const classToCheck = classesToInclude[i];
    if (!classList.contains(classToCheck)) {
      return false;
    }
  }
  for (let i = 0; i < classesToExclude.length; i++) {
    const classToCheck = classesToExclude[i];
    if (classList.contains(classToCheck)) {
      return false;
    }
  }
  return true;
};

export const doesFieldWrapperHaveClassList = (
  container: HTMLElement,
  elemId: string,
  classesToInclude: Array<string>,
  classesToExclude: Array<string>
): boolean => {
  return doesElemHaveClassList(
    getFieldWrapperElement(container, elemId),
    classesToInclude,
    classesToExclude
  );
};

export const doesFormHaveClassList = (
  container: HTMLElement,
  classesToInclude: Array<string>,
  classesToExclude: Array<string>
): boolean => {
  return doesElemHaveClassList(
    getFormElement(container),
    classesToInclude,
    classesToExclude
  );
};

export const getFieldWrapperElement = (
  container: HTMLElement,
  elemId: string
): HTMLElement => {
  return container.querySelector(`#${elemId}`)!.parentElement!;
};

export const getFormElement = (container: HTMLElement): HTMLElement => {
  return container.querySelector('form')!;
};

// const getFieldErrorMessage = (container: HTMLElement, elemId: string) => {
//   const wrapper = getFieldWrapperElement(container, elemId)!.parentElement;
//   const error = wrapper!.querySelector('.error');
//   return error ? error.textContent : '';
// };
