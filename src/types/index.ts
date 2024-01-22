import { Adr } from './adr';
import { End } from './end';
import { Kop } from './kop';
import { Poa } from './poa';
import { Pot } from './pot';
import { Poz } from './poz';
import { Rgd } from './rgd';

export * from './adr';
export * from './end';
export * from './kop';
export * from './poa';
export * from './pot';
export * from './poz';
export * from './rgd';

type LongestTuple<T extends unknown[]> = { [P in T['length']]: Extract<T, { length: P }> }[4 extends T['length']
    ? 4
    : 3 extends T['length']
      ? 3
      : 2 extends T['length']
        ? 2
        : 1 extends T['length']
          ? 1
          : 0];

export type Raw<T> = {
    [K in keyof T]-?: [any] extends T[K] ? LongestTuple<Extract<T[K], unknown[]>> : T[K];
};

type Prettify<T> = { [K in keyof T]: T[K] };

export type KindRequired<T extends { kind?: string }> = Prettify<Required<Pick<T, 'kind'>> & T>;

export type RecordInput = Adr | End | Kop | Poa | Pot | Poz | Rgd;

export type Record = Raw<RecordInput>;

export type RecordKind = Record['kind'];
/**
 * 3 Satzbeschreibungen
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export const RecordKind: { [K in RecordKind]: K } = {
    KOP: 'KOP',
    ADR: 'ADR',
    POA: 'POA',
    POT: 'POT',
    POZ: 'POZ',
    END: 'END',
    RGD: 'RGD'
};
