import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
    <Svg
        width={props.width}
        height={props.height}
        viewBox="0 0 375 352"
        preserveAspectRatio="none"
        {...props}
    >
        <Path
            id="background-3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 352C0 268.503 0 0 0 0H375C375 0 375 184.156 375 289.457C247.529 282.524 66.1232 334.213 0 352Z"
            fill={props.color}
        />
    </Svg>
);

export default SvgComponent;
