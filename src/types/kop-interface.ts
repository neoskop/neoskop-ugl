import { RequestType } from './request-type';

export interface IKop {
    customerId?: number;
    supplierId?: number;
    requestType: RequestType;
    requestId?: number;
    text?: string;
    operationId?: number;
    deliveryDate?: string|Date;
    currency?: string;
    version?: string;
    name: string;
    date?: string|Date;
}
