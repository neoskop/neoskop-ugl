export function uid(length : number) : number {
    return Math.floor(Math.random() * (10 ** length));
}
