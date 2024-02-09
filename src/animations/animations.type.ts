import { AnimatedStyleApp } from "@/constants/commonTypes";

export interface StylizedAnimation {
  animatedStyle: AnimatedStyleApp;
}

export interface RunnableAnimation {
  run: () => StylizedAnimation;
}
