import {Logger} from '@openworkshop/lib/utils/logging/Logger';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {IOpenWorkShop} from '@openworkshop/lib';
import { WebSocketLink } from '@apollo/client/link/ws';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export class MakerverseSubscription {
  private _subscriptionClient: SubscriptionClient;
  private _webSocketLink: WebSocketLink;
  private _ows: IOpenWorkShop;
  private _log: Logger;
  private _state: ConnectionState = 'disconnected';

  constructor(ows: IOpenWorkShop) {
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
      this.setState('connected');
    });

    subscriptionClient.onConnecting((a) => {
      this.log.debug('[subscription]', 'connecting...', a);
      this.setState('connecting');
    });

    subscriptionClient.onReconnected ((a) => {
      this.log.debug('[subscription]', 're-connected.', a);
      this.setState('connected');
    });

    subscriptionClient.onReconnecting((a) => {
      this.log.debug('[subscription]', 're-connecting...', a);
      this.setState('connecting');
    });

    subscriptionClient.onDisconnected((a) => {
      this.log.debug('[subscription]', 'disconnected.', a);
      this.setState('disconnected');
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
  }

  public get isConnected() { return this._state === 'connected'; }

  public get log(): Logger { return this._log; }

  public get webSocketLink(): WebSocketLink { return this._webSocketLink; }
}

