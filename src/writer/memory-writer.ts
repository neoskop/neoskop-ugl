import { UGLAbstractWriter } from './abstract-writer';

export class UGLMemoryWriter extends UGLAbstractWriter {
    protected result = '';
    
    protected _write(str : string) : void {
        this.result += str;
    }
    
    toString() {
        return this.result;
    }
    
    toBuffer() : Buffer {
        return new Buffer(this.result);
    }
}
