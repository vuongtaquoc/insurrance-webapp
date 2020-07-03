import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import { REGEX } from '@app/shared/constant';

const getDateNow = () => {
  const now = new Date();
  const credentials = JSON.parse(localStorage.getItem('CREDENTIALS') || '{}');
  const currentDate = credentials.currentDate;

  now.setSeconds(0);
  now.setUTCMilliseconds(0);

  if (currentDate) {
    const [ day, month, year ] = currentDate.split('/');

    now.setDate(day);
    now.setMonth(Number(month) - 1);
    now.setFullYear(year);
  }

  return now;
}

const to2Digits = (number) => {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
};

export function getBirthDay(value, birthTypeOnlyYear, birthTypeOnlyYearMonth) {
  if (!birthTypeOnlyYear && !birthTypeOnlyYearMonth) {
    const select = new Date();
    const date = value.substring(0, 2);
    const month = Number(value.substring(2, 4));
    const year = value.substring(4, 8);

    select.setDate(date);
    select.setMonth(Number(month) - 1);
    select.setFullYear(year);

    return {
      date: select,
      format: `${date}/${to2Digits(month)}/${year}`,
      text: `${date}${to2Digits(month)}${year}`
    };
  }

  if (!birthTypeOnlyYear && birthTypeOnlyYearMonth) {
    const select = new Date();
    const month = Number(value.substring(0, 2));
    const year = value.substring(2, 6);

    select.setMonth(Number(month) - 1);
    select.setFullYear(year);

    return {
      date: select,
      format: `${to2Digits(month)}/${year}`,
      text: `${to2Digits(month)}${year}`
    }
  }

  const select = new Date();
  const year = value.substring(0, 4);

  select.setFullYear(year);

  return {
    date: select,
    format: year,
    text: year
  }
};

export function getBirthDayGrid(value, type) {
  if (type === '3') {
    const select = new Date();
    const date = value.substring(0, 2);
    const month = Number(value.substring(3, 5));
    const year = value.substring(6, 10);
    select.setDate(date);
    select.setMonth(Number(month) - 1);
    select.setFullYear(year);

    return {
      date: select,
      format: `${date}/${to2Digits(month)}/${year}`
    };
  }else if(type === '1') {
    const select = new Date();
    const month = Number(value.substring(0, 2));
    const year = value.substring(3, 7);

    select.setMonth(Number(month) - 1);
    select.setFullYear(year);

    return {
      date: select,
      format: `${to2Digits(month)}/${year}`
    }
  }else {
    const select = new Date();
    const year = value.substring(0, 4);

    select.setFullYear(year);

    return {
      date: select,
      format: year
    }
  }
};


export function validateLessThanEqualNowBirthdayGrid(currentDate, type) {
  if (!currentDate || !type) return null;
  const now = getDateNow();
  // full date
  if (type === '3') {
    if (currentDate.length < 8) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    const birthDay = getBirthDayGrid(currentDate, type);
    if (!moment(birthDay.format, 'DD/MM/YYYY').isValid()) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }
    return birthDay.date <= now ? null : {
      lessThanEqualNow: {
        valid: false
      }
    }

  } //end full date
  // Month year
  else if(type === '1') {

    if (currentDate.length  < 6) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    const birthDay = getBirthDayGrid(currentDate, type);

    if (!moment(birthDay.format, 'MM/YYYY').isValid()) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    return birthDay.date.getFullYear() < now.getFullYear() || (birthDay.date.getFullYear() <= now.getFullYear() && birthDay.date.getMonth() <= now.getMonth()) ? null : {
      lessThanEqualNow: {
        valid: false
      }
    };
  }//End month year
  else {
    if (currentDate.length < 4) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    const birthDay = getBirthDayGrid(currentDate, type);

    return birthDay.date.getFullYear() <= now.getFullYear() ? null : {
      lessThanEqualNow: {
        valid: false
      }
    };
  }

}


export function validateLessThanEqualNowBirthday(c: FormControl) {
  if (!c.value || !c.parent) return null;

  const now = getDateNow();
  const birthTypeOnlyYear = c.parent.value.birthTypeOnlyYear;
  const birthTypeOnlyYearMonth = c.parent.value.birthTypeOnlyYearMonth;

  if (!birthTypeOnlyYear && !birthTypeOnlyYearMonth) {
    if (c.value.length < 8) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    const birthDay = getBirthDay(c.value, birthTypeOnlyYear, birthTypeOnlyYearMonth);

    if (!moment(birthDay.format, 'DD/MM/YYYY').isValid()) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    return birthDay.date.getTime() <= now.getTime() ? null : {
      lessThanEqualNow: {
        valid: false
      }
    }
  }

  if (!birthTypeOnlyYear && birthTypeOnlyYearMonth) {
    if (c.value.length < 6) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    const birthDay = getBirthDay(c.value, birthTypeOnlyYear, birthTypeOnlyYearMonth);

    if (!moment(birthDay.format, 'MM/YYYY').isValid()) {
      return {
        lessThanEqualNow: {
          valid: false
        }
      };
    }

    return birthDay.date.getFullYear() < now.getFullYear() || (birthDay.date.getFullYear() <= now.getFullYear() && birthDay.date.getMonth() <= now.getMonth()) ? null : {
      lessThanEqualNow: {
        valid: false
      }
    };
  }

  if (c.value.length < 4) {
    return {
      lessThanEqualNow: {
        valid: false
      }
    };
  }

  const birthDay = getBirthDay(c.value, birthTypeOnlyYear, birthTypeOnlyYearMonth);

  return birthDay.date.getFullYear() <= now.getFullYear() ? null : {
    lessThanEqualNow: {
      valid: false
    }
  };
}

export function validateLessThanEqualNow(c: FormControl) {
  if (!c.value || !c.parent) return null;

  const now = getDateNow();

  if (c.value.length < 8) {
    return {
      lessThanEqualNow: {
        valid: false
      }
    };
  }

  const birthDay = getBirthDay(c.value, false, false);

  if (!moment(birthDay.format, 'DD/MM/YYYY').isValid()) {
    return {
      lessThanEqualNow: {
        valid: false
      }
    };
  }

  return birthDay.date.getTime() <= now.getTime() ? null : {
    lessThanEqualNow: {
      valid: false
    }
  };
}

export function validateDateSign(c: FormControl) {
  if (!c.value || !c.parent) return null;

  const birthDay = c.parent.value.birthday;

  if (!birthDay) return null;

  const dateSign = getBirthDay(c.value, false, false);
  const birthTypeOnlyYearMonth = c.parent.value.birthTypeOnlyYearMonth;
  const birthTypeOnlyYear = c.parent.value.birthTypeOnlyYear;

  // validate full date
  if (!birthTypeOnlyYearMonth && !birthTypeOnlyYear) {
    return dateSign.text > birthDay ? null : { greaterThanBirthday: { valid: false } };
  }

  if (birthTypeOnlyYearMonth && !birthTypeOnlyYear) {
    const birthday = getBirthDay(birthDay, false, true);

    return dateSign.date.getFullYear() < birthday.date.getFullYear() || (dateSign.date.getFullYear() === birthday.date.getFullYear() && dateSign.date.getMonth() >= birthday.date.getMonth()) ? null : {
      greaterThanBirthday: { valid: false }
    };
  }

  const birthday = getBirthDay(birthDay, true, false);

  return dateSign.date.getFullYear() <= birthday.date.getFullYear() ? null : {
    greaterThanBirthday: { valid: false }
  };
}

// VALIDATE CARD ID
const normalize = function(id) {
  let re;
  re = /[-\/\s]/g;
  id = id.toUpperCase().replace(re, '');
  re = /\([A-Z0-9]\)$/;

  if (re.test(id)) {
    id = id.replace(/[\(\)]/g, '');
  }

  return id;
};

const validCardId = function(id, type = 'peopleId') {
  var isFormatValid, isLengthValid;

  isLengthValid = function isLengthValid(id) {
    if (type === 'peopleId') {
      return id.length === 9;
    }
    return id.length === 12;
  };

  isFormatValid = function isFormatValid(id) {
    if (type === 'peopleId') {
      return /^[0-9]{9}$/.test(id);
    }
    return /^[0-9]{12}$/.test(id);
  };

  id = normalize(id);

  return isLengthValid(id) && isFormatValid(id);
};

const validPassport = function(id) {
  const isLengthValid = function isLengthValid(id) {
    return id.length === 8;
  };

  const isFormatValid = function(id) {
    return REGEX.VALIDATE_PASSPORT.test(id);
  };

  id = normalize(id);

  return isLengthValid(id) && isFormatValid(id);
};

export function validateIdentifyCard(c: FormControl) {
  if (!c.value) return null;

  const isValid = validCardId(c.value, 'peopleId') || validCardId(c.value, 'cardId') || validPassport(c.value);

  return isValid ? null : { cardId: { valid: false } };
}
