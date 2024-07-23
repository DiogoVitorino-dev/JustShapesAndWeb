import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import HeadphoneHint from "@/components/preMenu/headphoneHint";
import InitialLoading from "@/components/preMenu/initialLoading";
import Presentation from "@/components/preMenu/presentation";

export default function PreMenu() {
  const [interacted, setInteracted] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);

  const router = useRouter();

  const pressToContinue = () => setInteracted(true);

  useEffect(() => {
    if (interacted) {
      router.replace("/(menu)");
    }
  }, [interacted]);

  if (animationFinished && gameLoaded)
    return <Presentation onUserInteract={pressToContinue} />;

  return (
    <>
      <HeadphoneHint onAnimationFinished={() => setAnimationFinished(true)} />
      <InitialLoading onFullyLoaded={() => setGameLoaded(true)} />
    </>
  );
}
