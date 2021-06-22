'use strict';

exports.dateAfterMinutes = (minutes= 1) => {
    const now = new Date();
    const dateAfterMinutes = new Date(now.setMinutes(now.getMinutes() + minutes));
    return dateAfterMinutes;
};
exports.dateAfterDays = (days= 1) => {
    const now = new Date();
    const dateAfterDays = new Date(now.setDate(now.getDate() + days));
    return dateAfterDays;
};

exports.dateAfterWeeks = (weeks= 1) => {
    const now = new Date();
    const dateAfterWeeks = new Date(now.setDate(now.getDate() + 7*weeks));
    return dateAfterWeeks;
};

exports.dateAfterMonths = (months= 1) => {
    const now = new Date();
    const dateAfterMonths = new Date(now.setMonth(now.getMonth() + months));
    return dateAfterMonths;
};

exports.dateAfterYears = (years= 1) => {
    const now = new Date();
    const dateAfterYears = new Date(now.setFullYear(now.getFullYear + years));
    return dateAfterYears;
};

// Format to Date-time string
exports.formatDateTime = (date= new Date()) => {
    const dateObj = new Date(date);
    const options = { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const strDatetime = dateObj.toLocaleString('en', options);
    return strDatetime;
};

// Format to Date string
exports.formatDate = (date= new Date()) => {
    const dateObj = new Date(date);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const strDate = dateObj.toLocaleDateString('en', options);
    return strDate;
};

// Format to Time string
exports.formatTime = (date= new Date()) => {
    const dateObj = new Date(date);
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const strTime = dateObj.toLocaleTimeString('en', options);
    return strTime;
}