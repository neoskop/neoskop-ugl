
export interface IUGLWriter {
    string(str : string, length : number) : this;

    int(number : number, length : number) : this;
    
    float(number : number, length : number, decimalLength : number) : this;
    
    date(date : string|Date) : this;
    
    write(str : string, length : number) : this;
    
    nl() : this;
}
