import {Svg, Path} from 'react-native-svg';
import React from 'react';

const TemplateMenu = ({height = 22, width = 22, fill = '#161616'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 17 22" fill="none">
      <Path
        d="M10.809 1.76L9.809 0H7.191L6.191 1.76H4.5V2.64H0V21.12H17V2.64H12.5V1.76H10.809ZM6.809 2.64L7.809 0.88H9.191L10.191 2.64H11.5V4.4V5.28H5.5V4.4V2.64H6.809ZM12.5 6.16V5.28H14V18.48H3V5.28H4.5V6.16H12.5ZM16 3.52V20.24H1V3.52H4.5V4.4H2V19.36H15V4.4H12.5V3.52H16Z"
        fill={fill}
      />
    </Svg>
  );
};

export default TemplateMenu;
