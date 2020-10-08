const DEBUG = true;
// const DEBUG = false;

const BASE_HOST = DEBUG ? "192.168.11.9:8080" : "fullfii.com";
const URL_SCHEME_HTTP = DEBUG ? "http" : "https";
const WS_SCHEME_HTTP = DEBUG ? "ws" : "wss";

export const BASE_URL = `${URL_SCHEME_HTTP}://${BASE_HOST}/api/v1/`;
export const BASE_URL_WS = `${WS_SCHEME_HTTP}://${BASE_HOST}/ws/`;
export const USER_POLICY_URL = "https://fullfii.com/terms-of-service/";
export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScaGHQYXpvYtPPSIKqVgPdSgM5QY_dzOQeTG6j8Jz16bJWV3A/viewform?usp=sf_link";
export const REPORT_URL = "https://docs.google.com/forms/d/e/1FAIpQLScuWE_hUXY8GN2Nu4CpMa7rNsUTtVRfcL0_avj5h69XwwjD8g/viewform";

export const PRODUCT_ID_LIST = [
    "com.fullfii.fullfii.normal_plan",
];

export const FREE_PLAN = {
    productId: "com.fullfii.fullfii.free_plan",
    title: "未加入",
    description: "",
};