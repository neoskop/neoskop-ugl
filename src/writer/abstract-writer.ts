import { IUGLWriter } from './writer-interface';
import { strPadLeft, strPadRight } from '../utils/str-pad';
import { round } from '../utils/round';

export abstract class UGLAbstractWriter implements IUGLWriter {
    
    string(str : string, length : number) : this {
        this.write(strPadRight(str, length), length);
    
        return this;
    }
    
    int(number : number, length : number) : this {
        this.write(strPadLeft((number|0).toString(), length, '0'), length);
    
        return this;
    }
    
    float(number : number, length : number, decimalLength : number) : this {
        let n = number|0,
            d = round(number%1, decimalLength);
        
        this.write(strPadLeft(n.toString(), length - decimalLength, '0') + strPadRight(d.toString().substr(2), decimalLength, '0'), length);
    
        return this;
    }
    
    date(date : string|Date) : this {
        if(typeof date === 'string') {
            if(!/^\d{8}$/.test(date)) {
                throw new Error(`Date field required format YYYYMMDD, "${date}" given.`);
            }
        } else {
            date = date.getFullYear().toString() + strPadLeft((date.getMonth() + 1).toString(), 2, '0') + strPadLeft(date.getDate().toString(), 2, '0')
        }
        
        this.write(date, 8);
        
        return this;
    }
    
    nl() : this {
        this.write('\r\n', 2);
        
        return this;
    }
    
    write(str : string, length : number) : this {
        this._write(str.substr(0, length));
        
        return this;
    }
    
    protected abstract _write(str : string) : void;
}
