import 'mocha';
import { expect } from 'chai';
import { ugl } from './index';
import { UGLBuilder } from './builder/builder';
import { UGLMemoryWriter } from './writer/memory-writer';

describe('index', () => {
    describe('ugl', () => {
        it('should create a builder with a memory writer', () => {
            let u = ugl();
            
            expect(u).to.be.instanceOf(UGLBuilder);
            expect(u.getWriter()).to.be.instanceOf(UGLMemoryWriter);
        });
    })
})
