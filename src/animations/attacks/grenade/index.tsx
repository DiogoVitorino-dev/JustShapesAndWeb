import React from "react";

import GrenadeFragment, { GrenadeFragmentProps } from "./grenadeFragment";

import { View } from "@/components/shared";
import { Position } from "@/constants/commonTypes";
import { AnglesUtils } from "@/utils/angleUtils";

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

  /**
   * @DocMissing
   */
  rotate?: number;
}

export function Grenade({
  fragments = 5,
  rotate = 0,
  onFinish,
  duration,
  ...fragmentProps
}: GrenadeProps) {
  const createFragments = () => {
    const fragmentsView: React.JSX.Element[] = [];
    let index = fragments;
    const partialAngle = 360 / index;

    const { shiftAngle } = AnglesUtils;

    while (index > 0) {
      fragmentsView.push(
        <GrenadeFragment
          {...fragmentProps}
          onFinish={index === 1 ? onFinish : undefined}
          duration={duration}
          angleDirection={shiftAngle(partialAngle * index, rotate)}
          key={index}
        />,
      );
      index--;
    }

    return fragmentsView;
  };

  return <View>{createFragments()}</View>;
}
