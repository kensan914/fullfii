import { useRef, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { GoToPage } from "../../types/Types";

const { width } = Dimensions.get("window");

/**
 * スライドビューに必要なstate, functionを提供
 */
const useSlideView = (
  initPage: number
): [number, React.RefObject<ScrollView>, GoToPage] => {
  const [currentPage, setCurrentPage] = useState(initPage);
  const scrollViewRef = useRef<ScrollView>(null);

  const goToPage: GoToPage = (toPageNum) => {
    scrollViewRef.current &&
      scrollViewRef.current.scrollTo({
        y: 0,
        x: width * (toPageNum - initPage),
        animated: true,
      });
    setCurrentPage(toPageNum);
  };

  return [currentPage, scrollViewRef, goToPage];
};

export default useSlideView;
