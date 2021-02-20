export const convertStatus = (status) => {
  const statusInfo = { title: "", color: "" };
  switch (status) {
    case "accepting":
      statusInfo.title = "相談可";
      statusInfo.color = "dodgerblue";
      break;
    case "inConsultation":
      statusInfo.title = "相談中";
      statusInfo.color = "crimson";
      break;
    default:
      break;
  }
  return statusInfo;
};

export const convertTitle = (prevTitle) => {
  switch (prevTitle) {
    case "Profile":
      return "プロフィール";
    case "Settings":
      return "設定";
    default:
      return prevTitle;
  }
};

export const convertStatusColor = (statusKey) => {
  switch (statusKey) {
    case "online":
      return "mediumseagreen";
    case "offline":
      return "indianred";
    case "talking":
      return "gold";
    default:
      return;
  }
};
