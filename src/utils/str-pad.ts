import { strRepeat } from './str-repeat';

export function strPadLeft(str : string, length : number, padWith : string = ' ') : string {
    if(str.length >= length) {
        return str;
    }
    let l = length - str.length;
    
    return strRepeat(padWith, Math.ceil(l / padWith.length)).substr(0, l) + str;
}

export function strPadRight(str : string, length : number, padWith : string = ' ') : string {
    if(str.length >= length) {
        return str;
    }
    let l = length - str.length;
    
    return str + strRepeat(padWith, Math.ceil(l / padWith.length)).substr(0, l);
}
