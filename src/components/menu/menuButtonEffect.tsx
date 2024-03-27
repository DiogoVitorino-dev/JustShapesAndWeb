import React, { forwardRef } from "react";
import { ColorValue, Platform } from "react-native";
import Svg, { Rect, SvgProps } from "react-native-svg";

interface MenuButtonEffectProps extends SvgProps {
  fillBackdrop?: ColorValue;
}

const MenuButtonEffect = forwardRef<Svg, MenuButtonEffectProps>(
  ({ fill, scale, fillBackdrop, ...props }, ref) => {
    return (
      <Svg
        {...props}
        width="90%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        ref={ref}
      >
        <Rect
          width="50%"
          height="100%"
          fill={fillBackdrop || "#000"}
          strokeWidth={1}
          stroke={fillBackdrop}
          scale={scale}
        />

        {Platform.OS === "web" ? (
          <Svg style={{ transform: [{ skewX: "25deg" }] }}>
            <Rect
              width="50%"
              height="100%"
              fill={fill || "#000"}
              skewX={25}
              scale={scale}
            />
          </Svg>
        ) : (
          <Rect
            width="50%"
            height="100%"
            fill={fill || "#000"}
            skewX={25}
            scale={scale}
          />
        )}
      </Svg>
    );
  },
);

export default MenuButtonEffect;
