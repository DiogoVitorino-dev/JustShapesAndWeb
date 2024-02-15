import { Ionicons } from "@expo/vector-icons";
import React from "react";

type IconProps = React.ComponentProps<typeof Ionicons>;

export function Icon(icon?: IconProps) {
  return <Ionicons {...icon} />;
}
