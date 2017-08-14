import { IKop } from '../types/kop-interface';
import { RequestType } from '../types/request-type';
import { uid } from '../utils/uid';
import { IUGLWriter } from '../writer/writer-interface';
import { RecordType } from '../types/record-type';
import { IPoa } from '../types/poa-interface';
import { Mode } from '../types/mode';
import { PositionType } from "../types/position-type";
import { IEnd } from '../types/end-interface';

export class UGLBuilder<T extends IUGLWriter> {
    protected wroteKop : boolean = false;
    protected wroteEnd : boolean = false;
    
    protected runningPosition : number = 0;
    protected runningIndex : number = 0;
    
    constructor(protected writer : T,
                protected readonly mode : Mode = Mode.Craftsman) {
    }
    
    kop(data : IKop) : this {
        if(this.wroteEnd) {
            throw new Error('END already written');
        }
        if(this.wroteKop) {
            throw new Error(`KOP already written`);
        }
        
        let {
            customerId = 0,
            supplierId = 0,
            requestType,
            requestId = uid(15),
            text = '',
            operationId = 0,
            deliveryDate = '00000000',
            currency = 'EUR',
            version = '04.00',
            name = '',
            date = new Date()
        } = data;
        
        if(requestType === RequestType.TB || requestType === RequestType.BE) {
            if(!deliveryDate || deliveryDate == '00000000') {
                throw new Error(`DeliveryDate required`);
            }
        }
        
        this.writer
            .string(RecordType.KOP, 3)
            .int(customerId, 10)
            .int(supplierId, 10)
            .string(requestType, 2)
            .int(requestId, 15)
            .string(text, 50)
            .int(operationId, 15)
            .date(deliveryDate)
            .string(currency, 3)
            .string(version, 5)
            .string(name, 40)
            .date(date)
            .nl();
        
        this.wroteKop = true;
        return this;
    }
    
    poa(data : IPoa) : this {
        if(!this.wroteKop) {
            throw new Error(`Required KOP`);
        }
        if(this.wroteEnd) {
            throw new Error('END already written');
        }
        
        let {
            positionCraftsman = this.mode === Mode.Craftsman ? ++this.runningPosition : 0,
            positionWholesale = this.mode === Mode.Wholesale ? ++this.runningPosition : 0,
            articleNumber,
            quantity = 1,
            name = [ '', '' ],
            gross,
            priceUnit = '',
            net,
            discount = [ 0, 0 ],
            index = ++this.runningIndex,
            alternative,
            type = PositionType.Regular,
            reservation,
            quantityUnit = 'Stk',
            pkz = '',
            storeType = '',
        } = data;
        
        if(net === undefined) {
            net = gross * quantity;
        }
        
        if(typeof name === 'string') {
            name = [ name, '' ];
        }
        while(name.length < 2) {
            name.push('');
        }
        
        if(typeof discount === 'number') {
            discount = [ discount, 0 ];
        }
        while(discount.length < 2) {
            discount.push(0);
        }
        
        this.writer
            .string(RecordType.POA, 3)
            .int(positionCraftsman, 10)
            .int(positionWholesale, 10)
            .string(articleNumber, 15)
            .float(quantity, 11, 3)
            .string(name[0], 40)
            .string(name[1], 40)
            .float(gross, 11, 2)
            .string(priceUnit, 1)
            .float(net, 11, 2)
            .float(discount[0], 5, 2)
            .float(discount[1], 5, 2)
            .int(index, 18)
            .string(alternative ? 'A' : '', 1)
            .string(type, 1)
            .string(reservation ? 'J' : 'N', 1)
            .string(quantityUnit, 3)
            .string(pkz, 1)
            .string(storeType, 1)
            .nl();
        
        return this;
    }
    
    end(data : IEnd = {}) : this {
        if(!this.wroteKop) {
            throw new Error(`Required KOP`);
        }
        if(this.wroteEnd) {
            throw new Error('END already written');
        }
        
        let text : string[];
        
        if(data.text) {
            if(typeof data.text === 'string') {
                text = [ data.text, '', '', '' ]
            } else {
                text = data.text;
            }
        } else {
            text = [ '', '', '', '' ];
        }
        
        while(text.length < 4) {
            text.push('');
        }
        
        this.writer
            .string(RecordType.END, 3)
            .string(text[0], 40)
            .string(text[1], 40)
            .string(text[2], 40)
            .string(text[3], 40);
        
        this.wroteEnd = true;
        return this;
    }
    
    getWriter() : T {
        return this.writer;
    }
}
