export function strRepeat(str : string, repeat : number) : string {
    repeat |= 0;
    if(1 > repeat) return '';
    let result = '';
    while(repeat > 1) {
        if(repeat & 1) {
            result += str;
        }
        repeat >>= 1;
        str += str;
    }
    return result + str;
}
