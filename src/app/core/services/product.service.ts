import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class ProductService {

    constructor(private http: ApplicationHttpClient) {
    }

    public getList(filters = {}) {
        return this.http.getList('/products', {
            params: {
                ...filters
            }
        });
    }

    public getDetailById(id: string) {
        return this.http.get(`/products/${id}`, {
        });
    }

    public create(body, options = {}) {
        return this.http.post('/products', body, options);
    }

    public update(id, body, options = {}) {
        return this.http.post(`/products/${id}`, body, options);
    }

    public delete(id) {
        return this.http.delete(`/products/${id}`);
    }


}
