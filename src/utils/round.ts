export function round(n : number, decimal : number = 0) : number {
    let x = 10 ** decimal;
    
    return Math.round(n * x) / x;
}
