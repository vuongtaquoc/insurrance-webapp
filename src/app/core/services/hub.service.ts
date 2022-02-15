import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';
import { hubConnection, signalR } from 'signalr-no-jquery';
import { hubConfig } from '@app/shared/constant';
import { errorMessages } from '@app/shared/constant';
@Injectable({ providedIn: 'root' })
export class HubService {

  private hubProxy: any;
  constructor() {
  }

  public connectHub(callBack) {
    const options = {         
        'Content-Type': 'application/json',
        'Accept':'*/*',
        qs: {
          'Access-Control-Allow-Private-Network': true 
        }
		};

    const connectionHub = hubConnection(hubConfig.host, options);
    const hubProxy = connectionHub.createHubProxy(hubConfig.hubProxy);
    hubProxy.on(hubConfig.notificeEvent, (result) => {
      callBack(this.convertToObject(result));
    });
    connectionHub.start()
    .done((data: any) =>{        
        console.log('Now connected, connection ID=' + connectionHub.id);  
        this.hubProxy = hubProxy;
    })
    .fail((data: any) => {  
      console.log('Could not connect');
      this.hubProxy = null;
    });

    connectionHub.disconnected(function() {
      connectionHub.stop();
    });
  }

  public getHubProxy() {
    return this.hubProxy;
  }

  private convertToObject(result) {
    const data = JSON.parse(result);
    if (data.code === 1) {
      return data.data;
    }

    throw {
      code: data.code,
      message: this.getMessageErrorByErrorCode(data),
    };
  }

  private getMessageErrorByErrorCode(data) {
    const message = errorMessages[data.code];

    if (!message) {
      eventEmitter.emit('saveData:error', data.message);
      return  data.message;
    }

    eventEmitter.emit('saveData:error', message);
    return message;
  }
   
}
