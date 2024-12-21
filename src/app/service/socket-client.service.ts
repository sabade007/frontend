import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, Message, over } from 'stompjs';
import * as SockJS from "sockjs-client";
import { filter, first, switchMap } from 'rxjs/operators';
import { StompSubscription } from '@stomp/stompjs';
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class SocketClientService implements OnDestroy{
  private client: Client;
  private state: BehaviorSubject<SocketClientState>;
  
  
  constructor() { 
    let webSocketUrl: string = environment.apiUrl + "ichat";
    this.client = over(new SockJS(webSocketUrl));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      });
    });
  }

  ngOnDestroy() {
    this.connect().pipe(first()).subscribe(client => client.disconnect(null));
  }

  onMessage(topic: string): Observable<any> {
    return this.connect().pipe(first(), switchMap(client => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = client.subscribe(topic, message => {
          observer.next(this.jsonHandler(message));
        });
        return () => client.unsubscribe(subscription.id);
      });
    }));
  }

  jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }
  
  textHandler(message: Message): string {
    return message.body;
  }
}

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}