import React, { useEffect } from "react";

import { useAppSelector } from "@/hooks";
import { useStageController } from "@/hooks/useStageController";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";
import Ani_1, { substage_1 } from "@/substages/blackbox/ani/ani_1";
import Ani_2, { substage_2 } from "@/substages/blackbox/ani/ani_2";
import Ani_3, { substage_3 } from "@/substages/blackbox/ani/ani_3";
import Ani_4, { substage_4 } from "@/substages/blackbox/ani/ani_4";
import Ani_5, { substage_5 } from "@/substages/blackbox/ani/ani_5";

export default function AniStage() {
  const { load } = useStageController();

  const current = useAppSelector(StageSelectors.selectSubstage);

  useEffect(() => {
    load(
      "Blackbox - Ani",
      [substage_1, substage_2, substage_3, substage_4, substage_5],
      "blackbox-ani",
    );
  }, []);

  switch (current) {
    case substage_1.id:
      return <Ani_1 />;

    case substage_2.id:
      return <Ani_2 />;

    case substage_3.id:
      return <Ani_3 />;

    case substage_4.id:
      return <Ani_4 />;

    case substage_5.id:
      return <Ani_5 />;
  }
}
