import React from "react";

import GrenadeFragment, { GrenadeFragmentProps } from "./grenadeFragment";

import { View } from "@/components/shared";
import { Position } from "@/constants/commonTypes";

export type GrenadeFragmentOptions = Omit<
  GrenadeFragmentProps,
  "angleDirection"
>;

interface GrenadeProps extends Partial<Position>, GrenadeFragmentOptions {
  fragments?: number;
}

export function Grenade({ fragments = 5, ...fragmentProps }: GrenadeProps) {
  const createFragments = () => {
    const fragmentsView: React.JSX.Element[] = [];
    let index = fragments;
    const partialAngle = 360 / index;

    while (index > 0) {
      fragmentsView.push(
        <GrenadeFragment
          {...fragmentProps}
          angleDirection={partialAngle * index}
          key={index}
        />,
      );
      index--;
    }

    return fragmentsView;
  };

  return <View transparent>{createFragments()}</View>;
}
