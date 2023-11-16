import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const AddSVGComponent = props => (
  <Svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_1_27)">
      <Path
        d="M36 26H26V36C26 37.1 25.1 38 24 38C22.9 38 22 37.1 22 36V26H12C10.9 26 10 25.1 10 24C10 22.9 10.9 22 12 22H22V12C22 10.9 22.9 10 24 10C25.1 10 26 10.9 26 12V22H36C37.1 22 38 22.9 38 24C38 25.1 37.1 26 36 26Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1_27">
        <Rect width={48} height={48} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default AddSVGComponent;
