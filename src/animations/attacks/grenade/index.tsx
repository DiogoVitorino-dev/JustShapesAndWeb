import React from "react";

import GrenadeFragment, { GrenadeFragmentProps } from "./grenadeFragment";

import { View } from "@/components/shared";
import { Position } from "@/constants/commonTypes";

export type GrenadeFragmentOptions = Omit<
  GrenadeFragmentProps,
  "angleDirection"
>;

export interface GrenadeProps
  extends Partial<Position>,
    GrenadeFragmentOptions {
  /**
   * @DocMissing
   */
  fragments?: number;
}

export function Grenade({
  fragments = 5,
  onFinish,
  duration,
  ...fragmentProps
}: GrenadeProps) {
  const createFragments = () => {
    const fragmentsView: React.JSX.Element[] = [];
    let index = fragments;
    const partialAngle = 360 / index;

    while (index > 0) {
      fragmentsView.push(
        <GrenadeFragment
          {...fragmentProps}
          onFinish={index === 1 ? onFinish : undefined}
          duration={duration}
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
