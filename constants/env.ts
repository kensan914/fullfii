const DEBUG = true;
// const DEBUG = false;
const ADMOB_DEBUG = true;
// const ADMOB_DEBUG = false;

const BASE_HOST = DEBUG ? "192.168.11.3:8080" : "fullfii.com";
const URL_SCHEME_HTTP = DEBUG ? "http" : "https";
const WS_SCHEME_HTTP = DEBUG ? "ws" : "wss";

export const BASE_URL = `${URL_SCHEME_HTTP}://${BASE_HOST}/api/v2/`;
export const BASE_URL_WS = `${WS_SCHEME_HTTP}://${BASE_HOST}/ws/v2/`;
export const USER_POLICY_URL = "https://fullfii.com/terms-of-service/";
export const PRIVACY_POLICY_URL = "https://fullfii.com/privacy-policy/";
export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScaGHQYXpvYtPPSIKqVgPdSgM5QY_dzOQeTG6j8Jz16bJWV3A/viewform?usp=sf_link";
export const REPORT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScuWE_hUXY8GN2Nu4CpMa7rNsUTtVRfcL0_avj5h69XwwjD8g/viewform";
export const ACCOUNT_DELETION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSclvk_l4JsWCMQf6a6qh2AmoAkiM9ReU6eZOaYTUoTz9MP3gw/viewform?usp=sf_link";
export const VERSION = "2.2.4";
export const VERSION_NUM = 224;

export const PRODUCT_ID_LIST = ["com.fullfii.fullfii.normal_plan"];

export const FREE_PLAN = Object.freeze({
  productId: "com.fullfii.fullfii.free_plan",
  title: "未加入",
  description: "",
});

const ADMOB_UNIT_ID_DEBUG_BANNER = "ca-app-pub-3940256099942544/2934735716";
const ADMOB_UNIT_ID_DEBUG_INT = "ca-app-pub-3940256099942544/4411468910";
const ADMOB_UNIT_ID_DEBUG_INT_MOV = "ca-app-pub-3940256099942544/5135589807";
export const ADMOB_UNIT_ID_HOME = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/5865171200";
export const ADMOB_UNIT_ID_SELECT_WORRY = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/1351211125";
export const ADMOB_UNIT_ID_SETTINGS = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/7725047785";
export const ADMOB_UNIT_ID_EDIT_PROFILE = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/4708319431";
export const ADMOB_UNIT_ID_AFTER_THX = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_INT
  : "ca-app-pub-1754293395940427/3594231086";
export const ADMOB_BANNER_WIDTH = 320;
export const ADMOB_BANNER_HEIGHT = 50;

export let isExpo = false;
export const setIsExpo = (val: boolean): void => {
  isExpo = val;
};
