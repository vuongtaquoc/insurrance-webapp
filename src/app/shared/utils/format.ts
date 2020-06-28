import numeral from 'numeral';

export default {
  currency: (value) => {
    if (value === '' || value === null || typeof value === 'undefined') {
      return value;
    }

    return numeral(value).format('0,0');
  }
};
