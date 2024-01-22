import { UGLEncoding } from './encoding';
import { Adr, End, Kop, Poa, Pot, Poz, Raw, Record, RecordKind, Rgd } from './types';

export function stringify(data: Record): string {
    switch (data.kind) {
        case RecordKind.ADR:
            return adr(data);
        case RecordKind.END:
            return end(data);
        case RecordKind.KOP:
            return kop(data);
        case RecordKind.POA:
            return poa(data);
        case RecordKind.POT:
            return pot(data);
        case RecordKind.POZ:
            return poz(data);
        case RecordKind.RGD:
            return rgd(data);
    }
}

export function kop(data: Raw<Kop>): string {
    return new UGLEncoding.Builder()
        .string(RecordKind.KOP, 3)
        .int(data.customerId, 10)
        .int(data.supplierId, 10)
        .string(data.requestType, 2)
        .int(data.requestId, 15)
        .string(data.text, 50)
        .int(data.operationId, 15)
        .date(data.deliveryDate)
        .string(data.currency, 3)
        .string(data.version, 5)
        .string(data.name, 40)
        .date(data.date)
        .build();
}

export function adr(data: Raw<Adr>): string {
    return new UGLEncoding.Builder()
        .string(RecordKind.ADR, 3)
        .string(data.name[0], 30)
        .string(data.name[1], 30)
        .string(data.name[2], 30)
        .string(data.street, 30)
        .string(data.country, 3)
        .string(data.postalCode, 6)
        .string(data.city, 30)
        .build();
}

export function poa(data: Raw<Poa>): string {
    return new UGLEncoding.Builder()
        .string(RecordKind.POA, 3)
        .int(data.positionCraftsman, 10)
        .int(data.positionWholesale, 10)
        .string(data.articleNumber, 15)
        .float(data.quantity, 11, 3)
        .string(data.name[0], 40)
        .string(data.name[1], 40)
        .float(data.gross, 11, 2)
        .string(data.priceUnit, 1)
        .float(data.net, 11, 2)
        .float(data.discount[0], 5, 2)
        .float(data.discount[1], 5, 2)
        .int(data.index, 18)
        .string(data.alternative ? 'A' : '', 1)
        .string(data.type, 1)
        .string(data.reservation ? 'J' : 'N', 1)
        .string(data.quantityUnit, 3)
        .string(data.pkz, 1)
        .string(data.storeType, 1)
        .build();
}

export function pot(data: Raw<Pot>): string {
    return new UGLEncoding.Builder()
        .string(RecordKind.POT, 3)
        .int(data.positionCraftsman, 10)
        .int(data.positionWholesale, 10)
        .string(data.text[0], 40)
        .string(data.text[1], 40)
        .string(data.text[2], 40)
        .int(data.index, 18)
        .build();
}

export function poz(data: Raw<Poz>): string {
    return new UGLEncoding.Builder()
        .string(RecordKind.POZ, 3)
        .int(data.positionCraftsman, 10)
        .int(data.positionWholesale, 10)
        .string(data.type, 2)
        .string(data.description, 80)
        .float(data.dayRate, 11, 2)
        .float(data.net, 11, 2)
        .build();
}

export function end(data: Raw<End>): string {
    return new UGLEncoding.Builder()
        .string(RecordKind.END, 3)
        .string(data.text[0], 40)
        .string(data.text[1], 40)
        .string(data.text[2], 40)
        .string(data.text[3], 40)
        .build();
}

export function rgd(data: Raw<Rgd>): string {
    return new UGLEncoding.Builder()
        .string(RecordKind.RGD, 3)
        .string(data.invoiceId, 10)
        .string(data.documentType, 2)
        .date(data.documentDate)
        .string(data.currency, 3)
        .float(data.gross, 11, 2)
        .float(data.vatAmount, 11, 2)
        .float(data.vat, 5, 2)
        .float(data.net, 11, 2)
        .float(data.discountValue[0], 11, 2)
        .float(data.discountPercent[0], 5, 2)
        .date(data.discountDate[0])
        .float(data.discountValue[1], 11, 2)
        .float(data.discountPercent[1], 5, 2)
        .date(data.discountDate[1])
        .date(data.dueDate)
        .float(data.discountAmount, 11, 2)
        .build();
}
