import React from 'react';
import { SketchPicker } from 'react-color';
import styles from './index.styl';

class ColorPicker extends React.PureComponent {
    state = { displayColorPicker: false, };

    render() {
        const { displayColorPicker } = this.state;
        const { color, setColor } = this.props;
        const bk = { backgroundColor: color };

        return (
            <div style={{ padding: 10 }}>
                <button
                    className={ styles.swatch }
                    onClick={() => {
                        this.setState({ displayColorPicker: !displayColorPicker });
                    }}
                >
                    <div className={ styles.color } style={bk} />
                </button>
                {displayColorPicker && (
                    <div className={ styles.popover }>
                        <button
                            className={ styles.cover }
                            onClick={() => this.setState({ displayColorPicker: false })}
                        />
                        <SketchPicker
                            color={ color }
                            onChange={setColor}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default ColorPicker;
