import {Svg, Path} from 'react-native-svg';
import React from 'react';

const EquipmentIcon = ({height = 22, width = 22, fill = '#161616'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
      <Path
        d="M18.0417 18.0417C18.6267 18.0417 19.125 18.54 19.125 19.125C19.125 19.71 18.6267 20.2084 18.0417 20.2084H5.04167C4.45667 20.2084 3.95833 19.71 3.95833 19.125C3.95833 18.54 4.45667 18.0417 5.04167 18.0417H18.0417ZM18.0417 16.4167H5.04167C3.5575 16.4167 2.33333 17.6409 2.33333 19.125C2.33333 20.6092 3.5575 21.8334 5.04167 21.8334H18.0417C18.76 21.8334 19.4488 21.548 19.9567 21.0401C20.4647 20.5322 20.75 19.8433 20.75 19.125C20.75 18.4067 20.4647 17.7179 19.9567 17.2099C19.4488 16.702 18.76 16.4167 18.0417 16.4167ZM20.75 9.91669H17.5V5.58335H12.0833L8.83333 9.91669V15.3334H21.8333L20.75 9.91669ZM10.5017 9.91669L12.625 7.20835H15.3333V9.91669H10.5017ZM8.57333 1.69419L3.15667 0.166687L0.166666 10.8159C-0.201668 12.2025 0.610833 13.6434 2.00833 14.0334L3.265 14.38L6.82917 11.3142L2.62583 10.1442L4.6625 2.83169L7.685 3.67669C8.29167 3.99085 9.6025 4.86835 10.4258 5.98419L11.5417 4.50002H12.0183C10.6533 2.77752 8.67083 1.74835 8.57333 1.69419Z"
        fill={fill}
      />
    </Svg>
  );
};

export default EquipmentIcon;
