"use strict";

export function formatUnixTimeAsLocalString(unixtime) {
  const date = new Date(unixtime * 1000);
  // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
  return date.toLocaleString().replace(", ", " "); // '5/6/2018 3:41:21 PM'
}

export function formatUnixTimeForSun(unixtime) {
  const hours = getHoursFromUnixTime(unixtime);
  const minutes = getMinutesFromUnixTime(unixtime);
  return `${hours}:${minutes}`;
}

export function getShortDateFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
  return date.toLocaleString().split(",")[0]; // returns '5/6/2018'
}

export function getTimeFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
  return date.toLocaleString().split(",")[1].trim(); // returns '3:41:21 PM'
}

export function getHoursFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  let hours = date.getHours();
  hours = hours > 12 ? hours - 12 : hours;
  return hours;
}

export function getHourAndPeriodFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  let hours = date.getHours();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours > 12 ? hours -= 12 : hours;
  hours = hours === 0 ? hours = 12 : hours;
  return `${hours}${period}`;
}

export function getMinutesFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return minutes;
}

export function getMonthFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  // example date.toDateSTring() 'Sun May 06 2018'
  return date.toDateString().split(" ")[1]; // returns 'May'
}

export function getDayFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  // example date.toDateSTring() 'Sun May 06 2018'
  return date.toDateString().split(" ")[0]; // returns 'Sun'
}

export function getYearFromUnixTime(unixtime) {
  const date = new Date(unixtime * 1000);
  return date.getFullYear();
}
