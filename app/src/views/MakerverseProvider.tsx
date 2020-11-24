import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import {OpenWorkShop} from '@openworkshop/lib';
import {MakerverseUser} from '../api/graphql';
import TokenValidator from '../components/Login/TokenValidator';
import i18nConfig from '../config/i18n';
import analytics from '../lib/analytics';
import {IMakerverse, MakerverseContext, Workspaces} from '../lib/Makerverse';
import App from './App';
import { LoginPage, CallbackPage } from 'components/Login';
import usePromise from 'react-promise-suspense';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// const singleton: Makerverse = new Makerverse();

const MakerverseProvider: FunctionComponent = () => {
  const log = useLogger(MakerverseProvider);
  const ows = React.useContext(OpenWorkShop);
  // const [makerverse] = React.useState<Makerverse>(singleton);
  const [user, setUser] = React.useState<MakerverseUser | undefined>(undefined);
  const [workspaces] = React.useState<Workspaces>(new Workspaces(ows));

  const makerverse: IMakerverse = { ows, log, user, workspaces };

  // makerverse.ows = ows;
  // setOwsSettings(ows.settings);

  usePromise(async () => {
    log.debug('loading...', ows);
    await i18next.use(XHR).use(LanguageDetector).init(i18nConfig);
    analytics.initialize(ows);
    // log.debug('loaded', ows, makerverse);
  }, []);

  return (
    <MakerverseContext.Provider value={makerverse} >
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/callback' component={CallbackPage} />
        <Route path='/' >
          <TokenValidator onUser={setUser} >
            <App />
          </TokenValidator>
        </Route>
      </Switch>
    </MakerverseContext.Provider>
  );
};

export default MakerverseProvider;
