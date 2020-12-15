import React from 'react';
import ReactDOM from 'react-dom';
import deployment from './makerverse-deployment';
import OpenController from "@openworkshop/ui/open-controller";

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  <OpenController deployment={deployment} />,
  container,
);
