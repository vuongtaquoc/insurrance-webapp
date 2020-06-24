import { FormControl } from '@angular/forms';
import * as moment from 'moment';

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
      format: `${date}/${month}/${year}`
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
      format: `${month}/${year}`
    }
  }

  const select = new Date();
  const year = value.substring(0, 4);

  select.setFullYear(year);

  return {
    date: select,
    format: year
  }
};

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

    return birthDay.date <= now ? null : {
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

export function validateLessThanEqualNowDateSign(c: FormControl) {
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

  return birthDay.date <= now ? null : {
    lessThanEqualNow: {
      valid: false
    }
  };
}
