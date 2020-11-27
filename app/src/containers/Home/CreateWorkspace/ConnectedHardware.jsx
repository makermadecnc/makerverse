import React from 'react';
import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import { Alert } from '@material-ui/core';
import { Space } from 'components-old/';
import i18n from 'lib/i18n';
import analytics from 'lib/analytics';
import FirmwareRequirement from './FirmwareRequirement';

class ConnectedHardware extends React.PureComponent {
  state = { isValid: false, protocolStr: null, firmwareStr: null, timeoutElapsed: false };

  getVersion(values) {
    const name = values.name && values.name.length > 0 ? values.name : '?';
    const vers = values.version && values.version.length > 0 ? values.version : '?';
    return `${name} v${vers}`;
  }

  renderFirmwareWarning(version, controllerType) {
    return (
      <span>
        {`The machine has not yet reported any firmware which is compatible with ${controllerType}. It may still be starting up.`}
        <br />
        {'You may also need to '}
        <analytics.OutboundLink
          eventLabel='update'
          to={this.props.connectionStatus.hardware.updateLink}
          target='_blank'>
          {i18n._('Update Firmware')}
        </analytics.OutboundLink>
        .
      </span>
    );
  }

  renderControllerMismatch(hw, requiredFirmware) {
    const controllerMismatch = hw.controllerType !== requiredFirmware.controllerType;
    return (
      controllerMismatch && (
        <Alert severity='error'>
          {i18n._('Expected controller type:')}: <strong>{hw.controllerType}</strong>
        </Alert>
      )
    );
  }

  renderProtocolError(hw, requiredFirmware, serialOutput) {
    const ack = serialOutput.length > 0;
    return (
      !hw.isValid && (
        <Alert severity='error'>
          {i18n._('Unable to validate protocol')}
          <br />
          {!ack && i18n._('(board not speaking at baud rate, or port is busy)')}
          {ack && (
            <div>
              <strong>{i18n._('Invalid response from board:')}</strong>
              <br />
              {serialOutput.map((line) => {
                return (
                  <div key={line}>
                    <i>{line}</i>
                  </div>
                );
              })}
            </div>
          )}
        </Alert>
      )
    );
  }

  renderProtocolPending(hw, requiredFirmware) {
    return !hw.isValid && <Alert>{i18n._('Attempting to validate machine protocol...')}</Alert>;
  }

  renderControllerTypeAndBaudRate(hw, baudRate) {
    return (
      <Alert severity={hw.isValid ? 'success' : 'info'}>
        {hw.isValid ? i18n._('Confirmed Protocol: ') : i18n._('Request Protocol: ')}
        <strong>{hw.controllerType}</strong>
        <br />
        {i18n._('At Baud Rate: ')}
        <strong>{baudRate}</strong>
      </Alert>
    );
  }

  renderVersions(parts) {
    let cnt = 0;
    const divs = Object.keys(parts).map((k) => {
      const p = parts[k];
      if (p.length <= 0) {
        return <div key={k} />;
      }
      cnt++;
      return (
        <div key={k}>
          {k}
          <strong>{p}</strong>
        </div>
      );
    });
    return cnt > 0 && <Alert>{divs}</Alert>;
  }

  renderRequiredFirmware(hw, requiredFirmware) {
    return (
      requiredFirmware &&
      requiredFirmware.requiredVersion && (
        <FirmwareRequirement
          firmware={requiredFirmware}
          compatibility={this.props.connectionStatus.firmwareCompatibility}
        />
      )
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ timeoutElapsed: true });
    }, 10000);
  }

  render() {
    const { actions, connectionStatus, requiredFirmware } = this.props;
    const { timeoutElapsed } = this.state;
    const hw = connectionStatus.hardware;
    const serialOutput = connectionStatus.serialOutput;
    const showRequiredFirmware = hw.isValid && requiredFirmware;

    return (
      <AlertList>
        {timeoutElapsed && this.renderProtocolError(hw, requiredFirmware, serialOutput)}
        {showRequiredFirmware && this.renderRequiredFirmware(hw, requiredFirmware)}
        {this.renderControllerTypeAndBaudRate(hw, requiredFirmware.baudRate)}
        {!timeoutElapsed && this.renderProtocolPending(hw, requiredFirmware)}
        {this.renderControllerMismatch(hw, requiredFirmware)}
        {this.renderVersions({
          [i18n._('Response Protocol: ')]: hw.protocolStr,
          [i18n._('Detected Version: ')]: hw.versionStr,
          [i18n._('Firmware: ')]: hw.firmwareStr,
        })}
        <button
          type='button'
          style={{ marginTop: 10 }}
          className='btn btn-danger'
          onClick={actions.handleClosePort}
          title='Close connection with control board'>
          <i className='fa fa-toggle-on' />
          <Space width='8' />
          {i18n._('Disconnect')}
        </button>
      </AlertList>
    );
  }
}

export default ConnectedHardware;
