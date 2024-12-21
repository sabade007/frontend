import { localData } from "./mimetypes";

export const environment = {
  production: true,
  productname: "Indryve",
  isLoggedIn: false,
  upgradeStorage: true,
  maxFileSize: 100450390,
  uploadFileCount: sessionStorage.getItem(localData.uploadedFileLimit),
  workSpaceEnable: false,
  isInfiniteScrollShow: true,
  privacyPolicy: "https://www.ndryve.net/privacy-policy",
  eula: "https://www.ndryve.net/eula",
  helpCenter: "https://portals.indryve.com/helpdesk/ndryve",
  contactUs: "https://www.ndryve.net/contactus",
  PrivacyPolicyLanding: "https://www.ndryve.net/privacy-policy#scrollTop=0",
  LicenceAgreement: "https://portals.ndryve.net/eula#scrollTop=0",
  facebooKURL: "https://www.facebook.com/eXzaTechconsulting/",
  twitterURL: "https://twitter.com/ExzatechC",
  linkedinURL:
    "https://www.linkedin.com/authwall?trk=bf&trkInfo=AQE--39jDh-KowAAAYI_Vq_wTcTEnF0KtuSJx3ghYXchIfj4ACezwrFZ9rwOpjG9ToljJqVckNUp5v9e2mj6KU8mzGtGI_VM0RfhRa7RuC0lDQDZGX-0VcyLWY2A-ItAYgWb_ZY=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fexzatech-consulting%2F",

  // apiUrl: "http://192.168.100.200:8083/onpremises/",
  // apiUrl: "http://192.168.100.200:8080/",
  // apiUrl: "https://concert.exzatech.net/api/",
  // apiUrl: "http://localhost:8080/",
  // apiUrl: "http://localhost:8086/dev/",
  // loginUrl : "https://concert.exzatech.net/login",
  // signupUrl : "https://concert.exzatech.net/create-account",
  // url : "https://dryve.wtitc.org/",

  // UAT
  //apiUrl: "https://192.168.100.154:8008/uat/",
  //loginUrl: "http://192.168.100.105/etherosuat/login",
  //signupUrl: "http://192.168.100.105/etherosuat/create-account",
  //url: "http://192.168.100.105/etherosuat/",

  // apiUrl: "http://192.168.100.64:8086/api/",
  // loginUrl: "http://192.168.100.64/concert/login",
  // signupUrl: "http://192.168.100.64/concert/create-account",
  // url: "http://192.168.100.64/concert/",

  // apiUrl: "http://192.168.100.64:8085/api/",
  // loginUrl: "http://192.168.100.64/concert-internal/login",
  // signupUrl: "http://192.168.100.64/concert-internal/create-account",
  // url: "http://192.168.100.64/concert-internal/",

  // DEV
  // apiUrl: "http://192.168.100.154:8086/dev/",
  // loginUrl : "http://192.168.100.105/etherosdev/login",
  // signupUrl : "http://192.168.100.105/etherosdev/",
  // url : "http://192.168.100.105/etherosdev/",

  // Internal UAT
  // apiUrl: "https://192.168.100.154:8005/internaluat/",
  // loginUrl: "http://192.168.100.105/internaluat/login",
  // signupUrl: "http://192.168.100.105/internaluat/create-account",
  // url: "http://192.168.100.105/internaluat/",

  apiUrl: "http://192.168.0.101:8087/api/",
  loginUrl: "http://192.168.0.101:8080/login",
  signupUrl: "http://192.168.0.101:8080/create-account",
  url: "http://192.168.0.101:8080/",
  //collaboraUrl: "https://office.ndryve.net/browser/96e80a8/cool.html?WOPISrc=",

  premium_subscription: true,
  collaboraUrl: "",
  // "https://192.168.100.141:9980/browser/96e80a8/cool.html?WOPISrc=",
  // "https://office.ndryve.net/browser/96e80a8/cool.html?WOPISrc=",
  userId: "",
  Username: "",
  UserRole: "",
  LOGIN_PUB_KEY: `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0PZnj8JQ/a/uO4MVm817PyO/EPM51WeYhByeNVQn1y0rwNVprzznH9N7KNxayDfvCt7/kPUMxqc4ALZkbr5Q/akpDTG/w/W63VYIfZAqC/Rb7sRwHNvGV0/3DhfCby0RVOYXe43McbseJnrgandaEk4k6h53yWr5onMB/PSa8uSjlUKFTd6A/YdyQuqN4DnvNtjfGXyGLFxAXYA6nmGT33eznPdfoN+7qwmPUVQgvi2IgpqTXuTjkv28HFJaZsNdqyqEfUSIzBIV4BRgOX9f1ct72PporTYQ/5fYUo154BfiuekiWcgL6whueFaBzdYP0U7Jcl4k7wfPy2OJULYy9QIDAQAB
    -----END PUBLIC KEY-----`,
  PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
  MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQ9mePwlD9r+47gxWbzXs/I78Q8znVZ5iEHJ41VCfXLSvA1WmvPOcf03so3FrIN+8K3v+Q9QzGpzgAtmRuvlD9qSkNMb/D9brdVgh9kCoL9FvuxHAc28ZXT/cOF8JvLRFU5hd7jcxxux4meuBqd1oSTiTqHnfJavmicwH89Jry5KOVQoVN3oD9h3JC6o3gOe822N8ZfIYsXEBdgDqeYZPfd7Oc91+g37urCY9RVCC+LYiCmpNe5OOS/bwcUlpmw12rKoR9RIjMEhXgFGA5f1/Vy3vY+mitNhD/l9hSjXngF+K56SJZyAvrCG54VoHN1g/RTslyXiTvB8/LY4lQtjL1AgMBAAECggEBAMRMRRsSQr0eESEM0jbLgBTfQrTsmA62Q9sPezvDs616vJhoouBAySnno9HNtuZRTRicRd5ppTfUjFJ3BL/XvwObbnn7mxa9923HTTCPRkB2rAoPtPYXKyqIbyBpB3kjEB3+DF8/5KeOTRN+6OR6/D0n9ZuNRaAMAzgs69gx/IFgvkwPfF4/vIOjTlJspzSWCQ7izBGeYRGO0rv8MbOOstX4J6Qd/i6hJfseRePznmTvsD9TG03ZhzaKAHl7UJsXwRJBqDrM2Vzz04geO2MkAxwNv/Qsq9jVyuzMqPWMZlEgc4yAv5dxWq7x3j/JaF4cqigYcb26N1Qkt3cTLrpq6r0CgYEA9YdZNNItNEfBBZyTY0ZaUrVmSlPOPqKxy+wEdvw4ZB8Vhl5LG66EPCa7Q+GQe0RtG/mPizSwsoykakG/f1nyxzPra2hSseVZi97T79ZvQaENkQR2VkE2aTlRD2FhihnrgFsCsMwpm4dBviXdYShSQFC4Sbd5Nu+C0dqocgYI658CgYEA2d/UvwFYYJwUAAWa6MeiMBOa4OYfCfFHzel9Vlk2OIsXiu6nZil5Gy2dTxL2oxUSo6b9MNYiSkgOVbGoZAHZHZUg5AeOEAcLxIpKYiKfHzD1XwGwJQtb+QPdjM8zpYCP0iB51tE05Re9s7qqsVVWEbTDN4wKLbzfH2ovaMkxGOsCgYEAv/hQZj1CvNKxd5rBnmg+bNaKIOk/o7d/PkrN/t4blSS8pq+JGB6uI33BA0UUu1x31tycQCI1WZUfZDj96ivA58GPew45QgBpsDPMD4TgvjaXLeCISc55JXJ8D4N7SQgVGumNxAANNB5f57UhTzrAfKrgPDro2mwQI9ZLx8MyLE8CgYAPDnHUVVJ3MrILIlgHOCyUJ/avDhgdBsiQiU85FWcy1yHkXwPAgqM05p0VZtkWghFMr/CVXGb4PSyIbYOWja4kZjbkq0T9BI+ioG/tgjj+3dJHI4W5uaQ8fDDmVzdZe530xnvFBaYjItXgQskjAiO1i4lmIE5fxMqikCMAmc7DywKBgERsuih3qhCoCQCDhniljIKWrbRJ/Wey6ldMVXZQIiCM1KXlo7BqBMTuDOftc7bn7PFgJRvW04dxVIXhfgrGpt3nRd2Pj2EgJ68RYp3e0olHlIsBviNzXkYWGRBh4YcNrlYjxi/YCK807FEj4NHmR1c/42UoUc2qSqLW9hkrZCwT
  -----END PRIVATE KEY-----`,
};
