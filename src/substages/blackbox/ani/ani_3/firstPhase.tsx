import React, { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

import { AnimatedAttacks } from "@/animations/attacks";
import { BeamProps } from "@/animations/attacks/beam";
import { View } from "@/components/shared";
import { MathUtils } from "@/utils/mathUtils";

interface SequenceBeamsProps
  extends Pick<BeamProps, "start" | "delay" | "onFinish"> {}

export default function SequenceBeams({
  start,
  delay = 0,
  onFinish,
}: SequenceBeamsProps) {
  const { random, percentage } = MathUtils;
  const { width, height } = useWindowDimensions();
  const [horizontalPositions, setHorizontalPositions] = useState<number[]>([]);
  const [verticalPositions, setVerticalPositions] = useState<number[]>([]);

  const [verticalBeamSize, setVerticalBeamSize] = useState(0);
  const [horizontalBeamSize, setHorizontalBeamSize] = useState(0);

  const beamPrepareDuration = 500;
  const beamAttackDuration = 200;
  const beamAttackSpeed = 100;
  const beamDelay = 450;

  const generateBeamPositions = (
    quantity: number,
    limit: number,
    beamSize: number,
  ): number[] => {
    const result = [];
    let position = 0;

    while (quantity > 0) {
      position = random(0, limit) - beamSize;
      result.push(position < 0 ? 0 : position);
      quantity -= 1;
    }
    return result;
  };

  useEffect(() => {
    const verticalBeamSize = random(
      percentage(5, width),
      percentage(10, width),
    );
    const horizontalBeamSize = random(
      percentage(5, height),
      percentage(10, height),
    );

    setVerticalBeamSize(verticalBeamSize);
    setHorizontalBeamSize(horizontalBeamSize);

    setHorizontalPositions(
      generateBeamPositions(7, height, horizontalBeamSize),
    );
    setVerticalPositions(generateBeamPositions(7, width, verticalBeamSize));
  }, [start]);

  return (
    <View style={styles.container}>
      <AnimatedAttacks.Beam
        start={start}
        delay={delay}
        size={verticalBeamSize}
        x={horizontalPositions[0]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="vertical"
      />

      <AnimatedAttacks.Beam
        start={start}
        size={horizontalBeamSize}
        y={verticalPositions[0]}
        delay={beamDelay + delay}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="horizontal"
      />
      <AnimatedAttacks.Beam
        start={start}
        size={verticalBeamSize}
        delay={beamDelay * 2 + delay}
        x={horizontalPositions[1]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="vertical"
      />

      <AnimatedAttacks.Beam
        start={start}
        size={horizontalBeamSize}
        y={verticalPositions[1]}
        delay={beamDelay * 3 + delay}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="horizontal"
      />
      <AnimatedAttacks.Beam
        start={start}
        size={verticalBeamSize}
        delay={beamDelay * 4 + delay}
        x={horizontalPositions[2]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="vertical"
      />

      <AnimatedAttacks.Beam
        start={start}
        size={horizontalBeamSize}
        y={verticalPositions[2]}
        delay={beamDelay * 5 + delay}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="horizontal"
      />
      <AnimatedAttacks.Beam
        start={start}
        size={verticalBeamSize}
        delay={beamDelay * 6 + delay}
        x={horizontalPositions[3]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="vertical"
      />

      <AnimatedAttacks.Beam
        start={start}
        size={horizontalBeamSize}
        y={verticalPositions[3]}
        delay={beamDelay * 7 + delay}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="horizontal"
      />
      <AnimatedAttacks.Beam
        start={start}
        size={verticalBeamSize}
        delay={beamDelay * 8 + delay}
        x={horizontalPositions[4]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="vertical"
      />

      <AnimatedAttacks.Beam
        start={start}
        size={horizontalBeamSize}
        y={verticalPositions[4]}
        delay={beamDelay * 9 + delay}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="horizontal"
      />
      <AnimatedAttacks.Beam
        start={start}
        size={verticalBeamSize}
        delay={beamDelay * 10 + delay}
        x={horizontalPositions[5]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="vertical"
      />

      <AnimatedAttacks.Beam
        start={start}
        size={horizontalBeamSize}
        delay={beamDelay * 11 + delay}
        y={verticalPositions[5]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="horizontal"
      />
      <AnimatedAttacks.Beam
        start={start}
        size={verticalBeamSize}
        delay={beamDelay * 12 + delay}
        x={horizontalPositions[6]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="vertical"
      />

      <AnimatedAttacks.Beam
        start={start}
        size={horizontalBeamSize}
        delay={beamDelay * 13 + delay}
        y={verticalPositions[6]}
        prepareDuration={beamPrepareDuration}
        attackDuration={beamAttackDuration}
        attackSpeed={beamAttackSpeed}
        direction="horizontal"
        onFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
