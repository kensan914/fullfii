import { useRef, useState } from "react";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

/**
 * スライドビューに必要なstate, functionを提供
 */
const useSlideView = (initPage) => {
  const [currentPage, setCurrentPage] = useState(initPage);
  const scrollViewRef = useRef(null);

  const goToPage = (toPageNum) => {
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
