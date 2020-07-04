import numeral from 'numeral';

import { REGEX } from '@app/shared/constant';

export default {
  currency: (value, format = '0,0') => {
    if (!REGEX.VALIDATE_NUMBER.test(value)) {
      return value;
    }

    return numeral(value).format(format);
  }
};
