export const validationColumnsPlanCode: any = {
  'GH1': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    },
    note: {
      message: 'Điều chỉnh tiền lương',
      argsColumn: []
    }
  },
  'DC': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    },
    note: {
      message: 'Điều chỉnh tiền lương',
      argsColumn: []
    }
  },
  'CD': {
    contractNo: {
      required: true,
    },
    levelWork: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    },
    note: {
      message: 'Điều chỉnh chức danh', 
      argsColumn: []      
    }
  },
  'TV' : {
    note: {
      message: 'Tăng quỹ HTTT', 
      argsColumn: []      
    }
  },
   'AT' : {
    note: {
      message: 'Truy đóng theo MLCS tại thời điểm', 
      argsColumn: []      
    }
  },
  'GV' : {
    note: {
      message: 'Tăng quỹ HTTT', 
      argsColumn: []      
    }
  },'DL' : {
    note: {
      message: 'Điều chỉnh lương/điều chỉnh chức danh tham gia BH TNLĐ, BNN',
      argsColumn: []   
    }
  },
  'GH2': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    },note: {
      message: '', 
      argsColumn: []    
    }
  },
  'GH3': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    },note: {
      message: '', 
      argsColumn: []    
    }
  },
  'GH4': {
    motherDayDead: {
      required: true
    },note: {
      message: '', 
      argsColumn: []    
    }
  },
  'GC': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    },note: {
      message: '', 
      argsColumn: []    
    }
  },
  'GD': {
    contractNo: {
      required: true,
    },
    dateSign: {
      required: true,
      lessThanNow: true
    },note: {
      message: '', 
      argsColumn: []    
    }
  },
  'SB': {
    toDate: {
      required: true,
      lessThanNow: true
    },note: {
      message: '', 
      argsColumn: []    
    }
  },
  'AD': {
    toDate: {
      required: true,
      lessThanNow: true
    },note: {
      message: 'Tăng nguyên lương', 
      argsColumn: []    
    }
  },
  'TT': {
    toDate: {
      required: true,
      lessThanNow: true
    },note: {
      message: 'Tăng BHYT', 
      argsColumn: []    
    }
  },
  'TM': {
    note: {
      message: 'HĐLĐ số {0} ngày {1}', 
      argsColumn: ['contractNo','dateSign']    
    }
  },'TD': {
    note: {
      message: 'HĐLĐ số {0} ngày {1}', 
      argsColumn: ['contractNo','dateSign']    
    }
  },'TC': {
    note: {
      message: 'HĐLĐ số {0} ngày {1}', 
      argsColumn: ['contractNo','dateSign']    
    }
  },'TH': {
    note: {
      message: 'HĐLĐ dưới 3 tháng số {0} ngày {1}', 
      argsColumn: ['contractNo','dateSign']    
    }
  },'ON (ts)': {
    note: {
      message: 'Thai sản đi làm lại', 
      argsColumn: []    
    }
  },'ON (om)': {
    note: {
      message: 'Nghỉ ốm đi làm lại', 
      argsColumn: []    
    }
  },'ON (kl)': {
    note: {
      message: 'Nghỉ không lương đi làm lại', 
      argsColumn: []    
    }
  },
  'TU': {
    toDate: {
      required: true,
      lessThanNow: true
    },note: {
      message: 'Giảm BHYT', 
      argsColumn: []    
    }
  } 
};
 
