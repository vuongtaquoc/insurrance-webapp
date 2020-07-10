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
    },
    copy: {
      type: 'I_1',
      note: 'Truy thu BHYT',
      tableName : 'reductionlabor'
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
  },'DN' : {
    note: {
      message: 'Điều chỉnh tham gia thất nghiệp',
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
      message: 'Nghỉ hưu', 
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
      message: 'Nghỉ thai sản/ốm/không lương chuyển sang Giảm', 
      argsColumn: []    
    }
  },
  'GH4': {
    motherDayDead: {
      required: true
    },note: {
      message: 'Giảm hẳn do chết, người lao động chết, ngày chết ', 
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
      message: 'Giảm do chuyển tỉnh', 
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
      message: 'Giảm do chuyển đơn vị', 
      argsColumn: []    
    }
  },
  'SB': {
    toDate: {
      required: true,
      lessThanNow: true
    },note: {
      message: 'Giảm nguyên lương', 
      argsColumn: []    
    }
  },'OF': {
    note: {
      message: 'Nghỉ ốm', 
      argsColumn: []    
    }
  },'KL': {
    note: {
      message: 'Nghỉ không lương', 
      argsColumn: []    
    }
  },'TS': {
    note: {
      message: 'Nghỉ thai sản', 
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
 
