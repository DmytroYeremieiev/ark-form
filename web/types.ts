import { InputInterface } from 'ark-forms/types';

export * from 'ark-forms/types';
export interface DateInputInterface<ET = HTMLInputElement> extends InputInterface<ET> {
  required?: boolean;
}
