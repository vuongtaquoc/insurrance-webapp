import numeral from 'numeral';

import { REGEX } from '@app/shared/constant';

export default {
  currency: (value) => {
    if (!REGEX.VALIDATE_NUMBER.test(value)) {
      return value;
    }

    return numeral(value).format('0,0');
  }
};
