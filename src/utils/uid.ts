export function uid(length : number) : number {
    return Math.random() * (10 ** length) | 0;
}
