import {Logger} from '@openworkshop/lib/utils/logging';
import { EventEmitter } from 'events';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {IOpenWorkShop} from '@openworkshop/lib';
import { WebSocketLink } from '@apollo/client/link/ws';

export enum ConnectionState {
  Disconnected = -1,
  Connecting,
  Connected,
}

export enum BackendConnectionEvent {
  ConnectionStateChanged,
}

export class BackendConnection extends EventEmitter {
  private _subscriptionClient: SubscriptionClient;
  private _webSocketLink: WebSocketLink;
  private _ows: IOpenWorkShop;
  private _log: Logger;
  private _state: ConnectionState = ConnectionState.Disconnected;

  constructor(ows: IOpenWorkShop) {
    super();
    this._ows = ows;
    const url = 'ws://localhost:8000/api/graphql';
    this._log = ows.logManager.getLogger(url);
    const subscriptionClient = new SubscriptionClient(url, {
      reconnect: true,
      connectionParams: async () => {
        const user = await ows.authManager.getUser();
        return user ? { token: user.access_token } : { };
      },
    });

    subscriptionClient.onConnected((a) => {
      this.log.debug('[subscription]', 'connected.', a);
      this.setState(ConnectionState.Connected);
    });

    subscriptionClient.onConnecting((a) => {
      this.log.debug('[subscription]', 'connecting...', a);
      this.setState(ConnectionState.Connecting);
    });

    subscriptionClient.onReconnected ((a) => {
      this.log.debug('[subscription]', 're-connected.', a);
      this.setState(ConnectionState.Connected);
    });

    subscriptionClient.onReconnecting((a) => {
      this.log.debug('[subscription]', 're-connecting...', a);
      this.setState(ConnectionState.Connecting);
    });

    subscriptionClient.onDisconnected((a) => {
      this.log.debug('[subscription]', 'disconnected.', a);
      this.setState(ConnectionState.Disconnected);
    });

    subscriptionClient.onError((a) => {
      this.log.error('[subscription]', 'error', a);
    });

    const ws =  new WebSocketLink(subscriptionClient);
    ws.setOnError(req => {
      this.log.error('request error', req);
    });

    this._subscriptionClient = subscriptionClient;
    this._webSocketLink = ws;
  }

  public async reconnect(): Promise<void> {
    this._subscriptionClient.close(false);
    while (!this.isConnected) {
      this.log.debug('waiting for re-connection...');
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  private setState(state: ConnectionState) {
    if (this._state === state) return;
    this._state = state;
    this.log.info(state);
    this.emit(BackendConnectionEvent.ConnectionStateChanged.toString(), state);
  }

  public get state(): ConnectionState { return this._state; }

  public get isConnected(): boolean { return this._state === ConnectionState.Connected; }

  public get log(): Logger { return this._log; }

  public get webSocketLink(): WebSocketLink { return this._webSocketLink; }
}

