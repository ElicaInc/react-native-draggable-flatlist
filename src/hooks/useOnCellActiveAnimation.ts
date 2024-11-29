import { useRef, useEffect } from "react"; // fixed by patch
import Animated, {
  useDerivedValue,
  useSharedValue, // fixed by patch
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { DEFAULT_ANIMATION_CONFIG } from "../constants";
import { useAnimatedValues } from "../context/animatedValueContext";
import { useIsActive } from "../context/cellContext";

type Params = {
  animationConfig: Partial<WithSpringConfig>;
};

export function useOnCellActiveAnimation(
  { animationConfig }: Params = { animationConfig: {} }
) {
  /*
  const animationConfigRef = useRef(animationConfig);
  animationConfigRef.current = animationConfig;
  */
  const animationConfigRef = useSharedValue(animationConfig); // fixed by patch
  useEffect(() => {
    animationConfigRef.value = animationConfig;
  }, [animationConfig]);

  const isActive = useIsActive();

  const { isTouchActiveNative } = useAnimatedValues();

  const onActiveAnim = useDerivedValue(() => {
    const toVal = isActive && isTouchActiveNative.value ? 1 : 0;
    return withSpring(toVal, {
      ...DEFAULT_ANIMATION_CONFIG,
    /*
      ...animationConfigRef.current,
    });
    */
      ...animationConfigRef.value,
    } as WithSpringConfig);
  }, [isActive]);

  return {
    isActive,
    onActiveAnim,
  };
}
