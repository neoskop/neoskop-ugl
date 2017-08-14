import { UGLBuilder } from './builder/builder';
import { UGLMemoryWriter } from './writer/memory-writer';

export function ugl() : UGLBuilder<UGLMemoryWriter> {
    return new UGLBuilder(new UGLMemoryWriter());
}

export * from './writer';
export * from './builder';
export * from './types';
