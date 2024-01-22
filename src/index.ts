import { stringify as stringify_ } from './stringify';
import { Builder as Builder_ } from './builder';
import * as raw_ from './raw';

module UGL {
    export const Builder = Builder_;
    export type Builder = Builder_;
    export const stringify = stringify_;

    export import raw = raw_;
}

export default UGL;

export { Builder_ as Builder };
export * from './types';
