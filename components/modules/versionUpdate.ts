import { VERSION_NUM } from "../../constants/env";
import { TalkTicketCollectionJsonIoTs } from "../types/Types.context";
import {
  asyncGetItem,
  asyncGetJson,
  asyncRemoveItem,
  asyncStoreItem,
} from "./support";

export const checkUpdateVersion = async (): Promise<void | null> => {
  const versionNumKey = "versionNum";
  const _versionNumOrStr = await asyncGetItem(versionNumKey);

  if (_versionNumOrStr === null) {
    // 新規ユーザ or 既存ユーザ(v2.0.0時点)
    if (
      await asyncGetJson("talkTicketCollection", TalkTicketCollectionJsonIoTs)
    ) {
      // 既存ユーザ(v2.0.0時点)
      onUpdateVersion(200);
      asyncStoreItem(versionNumKey, VERSION_NUM.toString());
    } else {
      // 新規ユーザ
      asyncStoreItem(versionNumKey, VERSION_NUM.toString());
    }
  } else {
    if (!Number.isNaN(_versionNumOrStr)) {
      const _versionNum = Number(_versionNumOrStr);
      if (_versionNum < VERSION_NUM) {
        // アップデートした
        onUpdateVersion(_versionNum);
        asyncStoreItem(versionNumKey, VERSION_NUM.toString());
      } else {
        // 最新バージョン(通常時)
      }
    }
  }

  return null;
};

/**
 * バージョンアップした時に1回だけ実行させたい処理をここに追記していく.
 * ex) prevVersionNum === 200のとき, v2.0.0から最新バージョンにアップデートした時という意味になる
 **/
const onUpdateVersion = (prevVersionNum: number) => {
  switch (prevVersionNum) {
    case 200: {
      console.log("talkTicketCollection削除");
      asyncRemoveItem("talkTicketCollection");
      break;
    }
    case 220: {
      break;
    }
  }
};
