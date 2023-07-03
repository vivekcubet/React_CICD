import {Svg, Path} from 'react-native-svg';
import React from 'react';

const PlusIcon = ({height = 22, width = 22, fill = '#161616'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.5 2.875V22.125"
        stroke={fill}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2.875 12.5H22.125"
        stroke={fill}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default PlusIcon;
