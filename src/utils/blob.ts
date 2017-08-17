import { encode } from './encoding';

export class BlobBuilder {
    protected content : Uint8Array[] = [];
    
    append(data : string|number[]|Uint8Array, length?: number) {
        if(typeof data === 'string') {
            data = encode(data);
            data = data.split('').map(c => c.charCodeAt(0));
        }
        
        if(!(data instanceof Uint8Array)) {
            data = Uint8Array.from(data);
        }
        
        this.content.push(data.slice(0, length));
    }
    
    toUint8Array() : Uint8Array {
        const length = this.content.reduce((t, c) => t + c.byteLength, 0);
        const arr = new Uint8Array(length);
        
        let offset = 0;
        
        for(let content of this.content) {
            arr.set(content, offset);
            offset += content.byteLength;
        }
        
        return arr;
    }
    
    toBuffer() {
        return Buffer.from(this.toUint8Array().buffer as ArrayBuffer);
    }
    
    toBlob() : Blob {
        return new Blob(this.content);
    }
    
}
