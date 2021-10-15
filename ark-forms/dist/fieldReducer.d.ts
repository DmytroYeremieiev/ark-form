import { FieldAction, FieldState, DeepPartial } from './types';
export declare const defaultFieldState: Omit<FieldState, 'configuration'>;
export declare const mergeState: (prevState: FieldState, newState: DeepPartial<FieldState>) => FieldState;
export declare const fieldReducer: (state: FieldState, action: FieldAction) => FieldState;
