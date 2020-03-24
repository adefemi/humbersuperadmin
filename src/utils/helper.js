import moment from "moment";
import countryControl from "country-state-city";
import _ from "lodash";
import { USERTOKEN } from "./data";
export const errorHandler = ({ graphQLErrors, networkError }) => {
  let messageString = "";
  if (graphQLErrors) {
    graphQLErrors.map(({ message }, i) => {
      messageString += `${message}<br />`;
      return true;
    });
  }

  if (networkError) {
    messageString += "Network error! check your network and try again";
  }

  return messageString.replace(/{|}|'|\[|\]/g, "");
};

export const randomIDGenerator = length => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const getCurrencyValue = termObj => {
  return `${_.get(termObj, "currency_type", "NGN ")}${numberWithCommas(
    _.get(termObj, "amount", "0.0")
  )}`;
};

export const getActivePosition = callback => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        callback({ lat, lng }, true);
      },
      error => {
        callback(error, false);
      }
    );
  }
};

const addressFormatType = Object.freeze({ full: "full", single: "single" });

export const formatAddress = data => {
  let activeIndex = 0;
  let maxData = data[0].address_components.length;
  data.map((item, i) => {
    if (item.address_components.length > maxData) {
      activeIndex = i;
      maxData = item.address_components.length;
    }
    return null;
  });
  let addressComp = data[activeIndex].address_components;
  let addressSetup = {};
  for (let i in addressComp) {
    if (addressComp[parseInt(i, 10)].types.includes("route")) {
      addressSetup.address = addressComp[parseInt(i, 10)].long_name;
    } else if (
      addressComp[parseInt(i, 10)].types.includes("neighborhood") ||
      addressComp[parseInt(i, 10)].types.includes("administrative_area_level_2")
    ) {
      addressSetup.city = addressComp[parseInt(i, 10)].long_name;
    } else if (
      addressComp[parseInt(i, 10)].types.includes(
        "administrative_area_level_1"
      ) ||
      addressComp[parseInt(i, 10)].types.includes("locality")
    ) {
      addressSetup.state = addressComp[parseInt(i, 10)].long_name;
    } else if (addressComp[parseInt(i, 10)].types.includes("country")) {
      addressSetup.country = addressComp[parseInt(i, 10)].long_name;
    }
  }

  return addressSetup;
};

export const getActiveAddress = (
  lat,
  lng,
  callback,
  format = addressFormatType.full
) => {
  if (window.google) {
    let latlng = new window.google.maps.LatLng(lat, lng);
    let geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ latLng: latlng }, function(results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (format === addressFormatType.full) {
          callback(results, status);
        } else {
          callback(formatAddress(results), status);
        }
      }
    });
  }
};

export function numberWithCommas(n, separator = ",") {
  if (n === "" || n === null) return;
  let num = n + "";

  // Test for and get any decimals (the later operations won't support them)
  let decimals = "";
  if (/\./.test(num)) {
    // This regex grabs the decimal point as well as the decimal numbers
    decimals = num.replace(/^.*(\..*)$/, "$1");
  }

  // Remove decimals from the number string
  num = num
    .replace(decimals, "")
    // Reverse the number string through Array functions
    .split("")
    .reverse()
    .join("")
    // Split into groups of 1-3 characters (with optional supported character "-" for negative numbers)
    .match(/[0-9]{1,3}-?/g)
    // Add in the mille separator character and reverse back
    .join(separator)
    .split("")
    .reverse()
    .join("");

  // Put the decimals back and output the formatted number
  return `${num}${decimals.substring(0, 3)}`;
}

export function isDescendant(parent, child) {
  let node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function hasSomeParentTheClass(element, className) {
  do {
    if (element.classList && element.classList.contains(className)) {
      return true;
    }
    element = element.parentNode;
  } while (element);
  return false;
}

export const formatCurrency = num => {
  return parseFloat(num).toFixed(2);
};

export function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls)) {}
  return el;
}

export const closeNav = _ => {
  const el = document.querySelector(".mobile-dropdown");
  if (hasClass(el, "navbar-fx-show")) {
    removeClass(el, "navbar-fx-show");
    document.querySelector("#faded-cover").style.display = "none";
  }
};

export const normalize24hTime = time =>
  moment(time, "hh:mm:ss").format("h:mm A");

// function to check if an element has a class
export const hasClass = (el, className) => {
  if (!el) {
    return;
  }
  return el.classList.contains(className);
};

// function to add a class to an element
export const addClass = (el, className) => {
  if (!el) {
    return;
  }
  el.classList.add(className);
};

// function to remove a class from an element
export const removeClass = (ele, cls) => {
  if (!ele) {
    return;
  }
  if (hasClass(ele, cls)) {
    ele.classList.remove(cls);
  }
};

export const getNewProps = (props, defaultPropList) => {
  let newProps = { ...props };

  for (let key in defaultPropList) {
    if (newProps.hasOwnProperty(key) || newProps.hasOwnProperty("isError")) {
      delete newProps[key.toString()];
    }
  }
  return newProps;
};

export const getCountryCodes = () => {
  let allCountry = countryControl.getAllCountries();
  let arrayContent = [];

  allCountry.map(country => {
    arrayContent.push({
      value: country.phonecode,
      content: `${country.phonecode}`,
      displayed: `+${country.phonecode}`
    });
    return null;
  });

  return arrayContent;
};

export const convertValue = (props, code) => {
  if (!props.value) {
    return "";
  }
  if (props.type !== "phone") {
    return props.value;
  }
  let value = props.value.split("");
  let newValue = props.value.split("");
  let codeConvert = value[0] === "+" ? `+${code}`.split("") : code.split("");

  if (codeConvert.length > value.length) {
    return props.value;
  }

  for (let i = 0; i < codeConvert.length; i++) {
    if (codeConvert[parseInt(i, 10)] === value[parseInt(i, 10)]) {
      newValue.splice(0, 1);
    } else {
      return props.value;
    }
  }
  return newValue.join("");
};

export const getFullPhone = (code = "", number = "") => {
  let numSplit = `${code}${number}`.match(/.{1,3}/g);
  if (numSplit) {
    return `+${numSplit.join("-")}`;
  }
};
export const getArrayCount = ({ count = 5, start = 1, includePlus = true }) => {
  const arrayData = [];
  for (let i = start; i < count; i++) {
    arrayData.push(i.toString());
  }
  if (includePlus) {
    arrayData.push(count.toString() + "+");
  }
  return arrayData;
};
export const getToken = _ => {
  let tokenObj = localStorage.getItem(USERTOKEN);
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    return tokenObj.access;
  }
  return null;
};
