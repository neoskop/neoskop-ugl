import { RequestType } from './request-type';

export interface IKop {
    requestType: RequestType;
    
    customerId?: number;
    supplierId?: number;
    requestId?: number;
    text?: string;
    operationId?: number;
    deliveryDate?: string|Date;
    currency?: string;
    version?: string;
    name?: string;
    date?: string|Date;
}
