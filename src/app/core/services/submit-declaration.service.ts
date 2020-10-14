import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class SubmitDeclarationService {

    constructor(private http: ApplicationHttpClient) {
    }

    public filter(filters = {}) {
        return this.http.getList('/submit-declaration', {
            params: {
                ...filters
            }
        });
    }

    public getDetailById(id: string) {
        return this.http.get(`/submit-declaration/${id}`, {
        });
    }

    public create(body, options = {}) {
        return this.http.post('/submit-declaration', body, options);
    }

    public update(id, body, options = {}) {
        return this.http.post(`/submit-declaration/${id}`, body, options);
    }

    public delete(id) {
        return this.http.delete(`/submit-declaration/${id}`);
    }


}
