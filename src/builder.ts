import { stringify } from './raw';
import { Adr, End, Kop, Poa, Pot, Poz, Raw, Record, RecordKind, Rgd } from './types';

export class Builder {
    private records: Record[] = [];

    private positionCraftsman = 1;
    private runningIndex = 1;

    kop(data: Kop): this {
        if (data.requestType === 'TB' || data.requestType === 'BE') {
            if (!data.deliveryDate || data.deliveryDate == '00000000') {
                throw new Error(`DeliveryDate required`);
            }
        }

        this.records.push({
            kind: RecordKind.KOP,
            customerId: 0,
            supplierId: 0,
            requestId: uid(15),
            text: '',
            operationId: 0,
            deliveryDate: '00000000',
            currency: 'EUR',
            version: '04.00',
            name: '',
            date: new Date(),
            ...data
        } satisfies Raw<Kop>);
        return this;
    }

    adr(data: Adr): this {
        this.records.push({
            kind: RecordKind.ADR,
            country: '',
            ...data,
            name: split(data.name, 3, 30)
        } satisfies Raw<Adr>);

        return this;
    }

    poa(data: Poa): this {
        this.records.push({
            kind: RecordKind.POA,
            positionCraftsman: data.positionCraftsman ?? this.positionCraftsman++,
            positionWholesale: 0,
            quantity: 1,
            quantityUnit: 'Stk',
            priceUnit: '',
            net: data.gross * (data.quantity ?? 1),
            discount: [0, 0],
            index: data.index ?? this.runningIndex++,
            pkz: '',
            storeType: '',
            alternative: false,
            type: 'H',
            reservation: false,
            ...data,
            name: split(data.name ?? '', 2, 40)
        } satisfies Raw<Poa>);

        return this;
    }

    pot(data: Pot): this {
        this.records.push({
            kind: RecordKind.POT,
            positionCraftsman: data.positionCraftsman ?? this.positionCraftsman++,
            positionWholesale: 0,
            index: data.index ?? this.runningIndex++,
            ...data,
            text: split(data.text, 3, 40)
        } satisfies Raw<Pot>);

        return this;
    }

    poz(data: Poz): this {
        if (!/^(\d{2}|[A-Z]{2})$/.test(data.type)) {
            throw new Error(`Invalid type "${data.type}"`);
        }

        if (data.type === '99' && !data.description) {
            throw new Error('Field "description" is required for type "99"');
        }

        this.records.push({
            kind: RecordKind.POZ,
            positionCraftsman: data.positionCraftsman ?? this.positionCraftsman++,
            positionWholesale: 0,
            description: '',
            dayRate: 0,
            ...data
        } satisfies Raw<Poz>);

        return this;
    }

    end(data: End = {}): this {
        this.records.push({ kind: RecordKind.END, ...data, text: split(data.text ?? '', 4, 40) } satisfies Raw<End>);

        return this;
    }

    rgd(data: Rgd): this {
        this.records.push({
            kind: RecordKind.RGD,
            dueDate: '00000000',
            discountDate: ['00000000', '00000000'],
            discountValue: [0, 0],
            discountPercent: [0, 0],
            ...data
        } satisfies Raw<Rgd>);

        return this;
    }

    build() {
        return this.records.map(stringify).join('');
    }
}

function uid(length: number): number {
    return Math.floor(Math.random() * 10 ** length);
}

export function split(input: string | string[], parts: 1, lengthPerPart: number): [string];
export function split(input: string | string[], parts: 2, lengthPerPart: number): [string, string];
export function split(input: string | string[], parts: 3, lengthPerPart: number): [string, string, string];
export function split(input: string | string[], parts: 4, lengthPerPart: number): [string, string, string, string];
export function split(input: string | string[], parts: number, lengthPerPart: number): string[] {
    if (typeof input === 'string') {
        const tmp = input;
        input = [];
        for (let i = 0; i < parts; ++i) {
            input.push(tmp.substring(lengthPerPart * i, lengthPerPart * (i + 1)));
        }
    }
    while (input.length < parts) {
        input.push('');
    }

    return input;
}
