export const validationColumnsPlanCode: any = {
  'GH1': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    }
  },
  'GH2': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    }
  },
  'GH3': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    }
  },
  'GH4': {
    motherDayDead: {
      required: true
    }
  },
  'GC': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    }
  },
  'GD': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    }
  },
  'SB': {
    toDate: {
      required: true,
      lessThanNow: true
    }
  } 
};
 
