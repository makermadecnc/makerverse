/* eslint-disable */
import React from 'react'
import styles from './index.styl';

const M2Modal = ({height, width, distance, offset, xScaling, yScaling, zScaling, setValue}) => {
  return (
    <div className={styles['modal-background']}>
      <div className={styles['modal-container']}>
      <h3>M2 Calibration</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="height">Height: </label>
          <input value={height} name='height' onChange={(e) => setValue(e)}/>
          <label htmlFor="width">Width: </label>
          <input value={width} name='width' onChange={(e) => setValue(e)}/>
          <label htmlFor="distance">Distance between motors: </label>
          <input value={distance} name='distance' onChange={(e) => setValue(e)}/>
          <label htmlFor="offset">Motor offset: </label>
          <input value={offset} name='offset' onChange={(e) => setValue(e)}/>
          <label htmlFor="xScaling">X Scaling: </label>
          <input value={xScaling} name='xScaling' onChange={(e) => setValue(e)}/>
          <label htmlFor="yScaling">Y Scaling: </label>
          <input value={yScaling} name='yScaling' onChange={(e) => setValue(e)}/>
          <label htmlFor="zScaling">Z Scaling: </label>
          <input value={zScaling} name='zScaling' onChange={(e) => setValue(e)}/>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Finish</button>
        </form>
      </div>
    </div>
  )
}

export default M2Modal
