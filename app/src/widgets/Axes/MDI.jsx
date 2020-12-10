import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Container, Row, Col } from 'components-old/GridSystem';
import { Button } from 'components-old/Buttons';
import Workspaces from 'lib/workspaces';

class MDI extends PureComponent {
  static propTypes = {
    workspaceId: PropTypes.string.isRequired,
    canClick: PropTypes.bool,
    mdi: PropTypes.shape({
      disabled: PropTypes.bool,
      commands: PropTypes.array,
    }),
  };

  get workspace() {
    return Workspaces.all[this.props.workspaceId];
  }

  renderMDIButtons() {
    const { canClick, mdi } = this.props;

    return mdi.commands.map((c) => {
      const grid = Object.keys(c.grid || {})
        .filter((size) => ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(size) >= 0)
        .reduce((acc, size) => {
          if (c.grid[size] >= 1 && c.grid[size] <= 12) {
            acc[size] = Math.floor(c.grid[size]);
          }
          return acc;
        }, {});

      return (
        <Col {...grid} key={c.id} style={{ padding: '0 4px', marginTop: 5 }}>
          <Button
            btnSize='sm'
            btnStyle='flat'
            style={{
              minWidth: 'auto',
              width: '100%',
            }}
            disabled={!canClick}
            onClick={() => {
              this.workspace.controller.command('gcode', c.command);
            }}>
            {c.name}
          </Button>
        </Col>
      );
    });
  }

  render() {
    const { mdi } = this.props;

    if (mdi.disabled || mdi.commands.length === 0) {
      return null;
    }

    return (
      <Container fluid style={{ padding: 0, margin: '-5px -4px 0 -4px' }}>
        <Row gutterWidth={0}>{this.renderMDIButtons()}</Row>
      </Container>
    );
  }
}

export default MDI;
