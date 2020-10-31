/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const defaultCustomSVG = {
  svgRect: {
    strokeWidth: 3,
    stroke: 'rgba(0,0,0,0)'
  },
  svgText: {
    color: 'white',
    fontSize: '12px'
  },
  svgScale: {
    transform: 'scale(1)'
  }
};

class CustomSVG extends Component {
  constructor(props) {
    super(props);
    this.rainbow = {
      warn: 'Tomato',
      normal: 'Orange',
      success: 'Green'
    };
  }

  render() {
    const { classes, text } = this.props;
    const x = 6.0 + (4.0 - text.length) * 4; // move the 3-letter text to the centrer; 4 letter is ok
    console.log(x);
    return (
      <svg width="43" height="20" className={classes.svgScale}>
        <g>
          <rect width="43" height="20" rx="3" ry="3" className={classes.svgRect} style={{ fill: this.rainbow[this.props.color] }} />
          <text x={x} y="15" fill="white" className={classes.svgText} >{text}</text>
        </g>
      </svg>
    );
  }
}

CustomSVG.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

export default withStyles(defaultCustomSVG, { name: 'CustomSVG' })(CustomSVG);
