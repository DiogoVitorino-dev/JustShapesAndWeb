import { useContext } from "react";

import { CollisionSystemContext } from "@/scripts/collision/collisionSystemProvider";

/**
 * @returns React Context hook that provides collision checking of object movements
 */
export const useCollisionSystem = () => useContext(CollisionSystemContext);
