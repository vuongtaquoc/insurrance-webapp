import { FormControl } from '@angular/forms';

const getDateNow = () => {
  const now = new Date();
  now.setSeconds(0);
  now.setUTCMilliseconds(0);

  return now;
}

export function validateLessThanEqualNow(c: FormControl) {
  if (!c.value) return null;

  const now = getDateNow();
  const select = new Date(c.value);
  const birthTypeOnlyYear = c.parent.value.birthTypeOnlyYear;
  const birthTypeOnlyYearMonth = c.parent.value.birthTypeOnlyYearMonth;

  if (!birthTypeOnlyYear && !birthTypeOnlyYearMonth) {
    return select <= now ? null : {
      lessThanEqualNow: {
        valid: false
      }
    }
  }

  if (!birthTypeOnlyYear && birthTypeOnlyYearMonth) {
    return select.getFullYear() <= now.getFullYear() && select.getMonth() <= now.getMonth() ? null : {
      lessThanEqualNow: {
        valid: false
      }
    };
  }

  return select.getFullYear() <= now.getFullYear() ? null : {
    lessThanEqualNow: {
      valid: false
    }
  };
}
