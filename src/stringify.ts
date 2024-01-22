import { Builder } from './builder';
import { KindRequired, RecordInput, RecordKind } from './types';

export function stringify(records: KindRequired<RecordInput>[]): string {
    const builder = new Builder();

    for (const record of records) {
        switch (record.kind) {
            case RecordKind.KOP:
                builder.kop(record);
                break;
            case RecordKind.ADR:
                builder.adr(record);
                break;
            case RecordKind.POA:
                builder.poa(record);
                break;
            case RecordKind.POT:
                builder.pot(record);
                break;
            case RecordKind.POZ:
                builder.poz(record);
                break;
            case RecordKind.END:
                builder.end(record);
                break;
            case RecordKind.RGD:
                builder.rgd(record);
                break;
        }
    }

    return builder.build();
}
