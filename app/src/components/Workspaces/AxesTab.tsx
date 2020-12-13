import * as React from 'react';
import MachineAxesEditor from '@openworkshop/ui/components/MachineProfiles/MachineAxesEditor';
import _ from 'lodash';
import {IHaveWorkspace} from './types';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {MachineAxes} from '@openworkshop/lib/api/Machines/CustomizedMachine';

type Props = IHaveWorkspace;

const AxesTab: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(AxesTab);
  const { workspace } = props;
  // const machine = workspace.machine;

  function onChangedAxes(a: MachineAxes) {
    log.debug('machine', a);
  }

  return (
    <div>
      <MachineAxesEditor
        narrow={true}
        axes={_.keyBy(workspace.axes, (a) => a.name)}
        onChanged={onChangedAxes}
      />
    </div>
  );
};

export default AxesTab;
