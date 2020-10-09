const {
     differenceInDays,
     differenceInHours,
     differenceInMinutes,
     differenceInWeeks,
     differenceInMonths,
     differenceInYears
} = require('date-fns')
module.exports = function time(pastTime, nowTime) {
     let past = new Date(pastTime);
     let now = new Date(nowTime);
     let years = differenceInYears(now, past)
     let months = differenceInMonths(now, past)
     let weeks = differenceInWeeks(now, past)
     let days = differenceInDays(now, past)
     let hours = differenceInHours(now, past)
     let minutes = differenceInMinutes(now, past)
     if (years >= 1) {
          if (years === 1) return `${years} Year ago`;
          else return `${years} Years ago`;
     } else if (months >= 1) {
          if (months === 1) return `${months} Month ago`;
          else return `${months} Months ago`;
     } else if (weeks >= 1) {
          if (weeks === 1) return `${weeks} Week ago`;
          else return `${weeks} Weeks ago`;
     } else if (days >= 1) {
          if (days === 1) return `${days} Day ago`;
          else return `${days} Days ago`;
     } else if (hours >= 1) {
          if (hours === 1) return `${hours} Hour ago`;
          else return `${hours} Hours ago`;
     } else if (minutes >= 1) {
          if (minutes === 1) return `${minutes} Minute ago`
          else return `${minutes} Minutes ago`
     } else {
          return `Just Now`
     }
}
