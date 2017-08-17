import { UGLAbstractWriter } from './abstract-writer';
import { BlobBuilder } from '../utils/blob';

export class UGLMemoryWriter extends UGLAbstractWriter {
    protected blob = new BlobBuilder();
    
    protected _write(str : string) : void {
        this.blob.append(str.split('').map(c => c.charCodeAt(0)));
    }
    
    toString() {
        return this.blob.toUint8Array().reduce((t, c) => t + String.fromCharCode(c), '');
    }
    
    toBuffer() : Buffer {
        return this.blob.toBuffer();
    }
    
    toBlob() : Blob {
        return this.blob.toBlob();
    }
    
    toUint8Array() : Uint8Array {
        return this.blob.toUint8Array();
    }
}
