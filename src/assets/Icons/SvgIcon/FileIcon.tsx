import {Svg, Path} from 'react-native-svg';
import React from 'react';

const FileIcon = ({height = 22, width = 22, fill = '#161616'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 1024 1024">
      <Path
        fill={fill}
        d="M602.496 240.448A192 192 0 1 1 874.048 512l-316.8 316.8A256 256 0 0 1 195.2 466.752L602.496 59.456l45.248 45.248L240.448 512A192 192 0 0 0 512 783.552l316.8-316.8a128 128 0 1 0-181.056-181.056L353.6 579.904a32 32 0 1 0 45.248 45.248l294.144-294.144 45.312 45.248L444.096 670.4a96 96 0 1 1-135.744-135.744l294.144-294.208z"
      />
    </Svg>
  );
};

export default FileIcon;
