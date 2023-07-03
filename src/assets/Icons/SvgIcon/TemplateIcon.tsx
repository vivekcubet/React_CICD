import {Svg, Path} from 'react-native-svg';
import React from 'react';

const TemplateIcon = ({height = 22, width = 22, fill = '#161616'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 20" fill="none">
      <Path
        d="M16 0H2C1.46997 0.00132012 0.962032 0.212458 0.587245 0.587245C0.212458 0.962032 0.00132012 1.46997 0 2V18C0.00132012 18.53 0.212458 19.038 0.587245 19.4128C0.962032 19.7875 1.46997 19.9987 2 20H16C16.53 19.9987 17.038 19.7875 17.4128 19.4128C17.7875 19.038 17.9987 18.53 18 18V2C17.9987 1.46997 17.7875 0.962032 17.4128 0.587245C17.038 0.212458 16.53 0.00132012 16 0ZM16 11.152V16.848L11 14L16 11.152ZM9 12.846L4 10H14L9 12.846ZM2 2H16V4H2V2ZM2 6H10V8H2V6ZM7 14L2 16.848V11.144L7 14ZM9 15.15L14 18H4L9 15.15Z"
        fill={fill}
      />
    </Svg>
  );
};

export default TemplateIcon;
