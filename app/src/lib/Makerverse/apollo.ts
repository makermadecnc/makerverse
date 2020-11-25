import {Logger} from '@openworkshop/lib/utils/logging/Logger';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {IOpenWorkShop} from '@openworkshop/lib';
import { WebSocketLink } from '@apollo/client/link/ws';

export class MakerverseSubscription {
  private _subscriptionClient: SubscriptionClient;
  private _webSocketLink: WebSocketLink;
  private _ows: IOpenWorkShop;
  private _connected = false;
  private _log: Logger;

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
      this.log.info('[subscription]', 'connected.', a);
      this.setConnected(true);
    });

    subscriptionClient.onConnecting((a) => {
      this.log.info('[subscription]', 'connecting...', a);
      this.setConnected(false);
    });

    subscriptionClient.onReconnected ((a) => {
      this.log.info('[subscription]', 're-connected.', a);
      this.setConnected(true);
    });

    subscriptionClient.onReconnecting((a) => {
      this.log.info('[subscription]', 're-connecting...', a);
      this.setConnected(false);
    });

    subscriptionClient.onDisconnected((a) => {
      this.log.info('[subscription]', 'disconnected.', a);
      this.setConnected(false);
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

  private setConnected(connected: boolean): void {
    if (this._connected === connected) return;
    this._connected = connected;
    this.log.info(connected ? 'connected' : 'dis-connected');
  }

  public get isConnected() { return this._connected; }

  public get log(): Logger { return this._log; }

  public get webSocketLink(): WebSocketLink { return this._webSocketLink; }
}

