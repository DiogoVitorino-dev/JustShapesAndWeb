import { useContext } from "react";

import { CollisionSystemContext } from "@/scripts/collision/collisionSystemProvider";

export const useCollisionSystem = () => useContext(CollisionSystemContext);
