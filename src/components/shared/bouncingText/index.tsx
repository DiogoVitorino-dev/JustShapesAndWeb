import React, { useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Character, { CharacterProps } from "./character";

import { AnimatedProps, DisplayOptions } from "@/constants/commonTypes";

type ForwardCharacterProps = Omit<CharacterProps, "index" | "style">;

type BouncingTextStyle =
  | CharacterProps["style"]
  | ((characterIndex: number) => CharacterProps["style"]);

export interface BouncingTextProps extends ForwardCharacterProps {
  containerStyle?: AnimatedProps<"View">["style"];
  style?: BouncingTextStyle;
}

export function BouncingText({
  start,
  children,
  containerStyle,
  style,
  onFinish,
  ...props
}: BouncingTextProps) {
  const display = useSharedValue<DisplayOptions>("none");

  const handleFinish = () => {
    display.value = "none";

    if (onFinish) {
      onFinish();
    }
  };

  const Characters = useMemo(() => {
    const AnimatedName: React.JSX.Element[] = [];
    const name = String(children);
    display.value = "flex";

    for (let index = 0; index < name.length; index++) {
      AnimatedName.push(
        <Character
          {...props}
          start={start}
          onFinish={index === 0 ? handleFinish : undefined}
          index={index}
          key={`letter_${index}`}
          style={typeof style === "function" ? style(index) : style}
        >
          {name[index]}
        </Character>,
      );
    }

    return AnimatedName;
  }, [start, children, style]);

  const animatedContainer = useAnimatedStyle(() => ({
    display: display.value,
    flexDirection: "row",
  }));

  return (
    <Animated.View style={[animatedContainer, containerStyle]}>
      {Characters}
    </Animated.View>
  );
}
