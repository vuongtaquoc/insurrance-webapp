export const DATE_FORMAT = {
  ONLY_MONTH_YEAR: 'MM/YYYY',
  ONLY_YEAR: 'YYYY',
  FULL: 'DD/MM/YYYY'
};

export const PAGE_SIZE = 10;

export const GENDER = {
  0: 'common.gender.male',
  1: 'common.gender.female',
};

export const STATUS = {
  0: 'common.notActive',
  1: 'common.active',
};


export const ACTION = {
  ADD: 'Add',
  EDIT: 'Edit',
  MUNTILEADD: 'MultipleAdd',
  MUNTILEUPDATE: 'MultipleUpdate',
  DELETE: 'Delete'
};

export const MIME_TYPE =
[
  {
  key: 'xlsx',
  value:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  {
    key: 'docx',
    value:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  {
    key: 'zip',
    value:'application/zip'
  },
  {
    key: 'xml',
    value:'application/xml'
  }
];

export const REGEX = {
  ONLY_CHARACTER_NUMBER: '^[a-zA-Z0-9]+$',
  ONLY_NUMBER: '^[0-9]*$',
  ONLY_NUMBER_INCLUDE_DECIMAL: '^[0-9]+(\.[0-9]{1,2})?$',
  VALIDATE_NUMBER: /^-?\d+\.?\d*$/,
  VALIDATE_PASSPORT: /^([A-Z a-z]){1}([0-9]){7}$/,
  PHONE_NUMBER: '^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$',
  EMAIL: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
};

export const DECLARATIONS =
[
  {
  key: '600',
  value:'Báo tăng lao động'
  },
  {
    key: '630',
    value:'Xét duyệt chế độ ốm đau, thai sản, phụ hồi sức khỏe'
  },
  {
    key: '630a',
    value:'Xét duyệt chế độ ốm đau'
  },
  {
    key: '630b',
    value:'Xét duyệt chế độ ốm đau'
  },
  {
    key: '601',
    value:'Truy thu (Trường hợp vi phạm quy định của pháp luật vè đóng BHXH,BHYT,BHTN, BHTNLD,BNN)'
  }
];

export const CONSTPARENTDELETEAUTOROW =
[
  {
    parent: 'reductionlabor_II_1',
    tableName:'Giảm lao động'
  }
]

export const DOCUMENTBYPLANCODE =
[
  {
    key: 'TM',
    value: [
      {
        documentType: 'Bản chính hợp đồng lao động',
        documentNote: 'Hợp đồng lao động',
        documentNo:  {
          mesage: '{0}',
          column: ['contractNo'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '{0}',
          column: ['dateSign'],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TM_1',
        isContract: true,
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TM_2',
      }
  ]},
  {
    key: 'TD',
    value: [
      {
        documentType: 'Bản chính hợp đồng lao động',
        documentNote: 'Hợp đồng lao động',
        documentNo:  {
          mesage: '{0}',
          column: ['contractNo'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '{0}',
          column: ['dateSign'],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TD_1',
        isContract: true,
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TD_2',
      }
  ]},
  {
    key: 'TC',
    value: [
      {
        documentType: 'Bản chính hợp đồng lao động',
        documentNote: 'Hợp đồng lao động',
        documentNo:  {
          mesage: '{0}',
          column: ['contractNo'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '{0}',
          column: ['dateSign'],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TC_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TC_2',
      }
  ]},
  {
    key: 'TH',
    value: [
      {
        documentType: 'Bản chính hợp đồng lao động',
        documentNote: 'Hợp đồng lao động',
        documentNo:  {
          mesage: '',
          column: ['contractNo'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '{0}',
          column: ['dateSign'],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TH_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TH_2',
      }
  ]},
  {
    key: 'AD',
    value: [
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'AD_1',
      }
  ]},
  {
    key: 'AT',
    value: [
      {
        documentType: '',
        documentNote: '',
        documentNo:  {
          mesage: '{0}',
          column: ['contractNo'],
        },
        companyRelease: {
          mesage: '',
          column: [],
        },
        dateRelease: {
          mesage: '{0}',
          column: ['dateSign'],
        },
        documentAppraisal: {
          mesage: '',
          column: [],
        },
        documentCode: 'AT_1',
      }
  ]},
  {
    key: 'ON (ts)',
    value: [
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'ON (ts)_1',
      }
  ]},{
    key: 'ON (kl)',
    value: [
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'ON (kl)_1',
      }
  ]},
  {
    key: 'ON (om)',
    value: [
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'ON (om)_1',
      }
  ]},{
    key: 'GH1',
    value: [
      {
        documentType: 'Bản chính Quyết định',
        documentNote: 'Quyết định nghỉ việc',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH1_1',
        isContract: true,
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH1_2',
      }
  ]},{
    key: 'GH2',
    value: [
      {
        documentType: 'Bản chính Quyết định',
        documentNote: 'Quyết định nghỉ hưu',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH2_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH2_2',
      }
  ]},{
    key: 'GH3',
    value: [
      {
        documentType: 'Bản chính Quyết định',
        documentNote: 'Quyết định nghỉ việc',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH3_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH3_2',
      }
  ]},{
    key: 'GH4',
    value: [
      {
        documentType: 'Giấy chứng tử',
        documentNote: 'Quyết định nghỉ việc',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH4_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GH4_2',
      }
  ]} ,{
    key: 'GC',
    value: [
      {
        documentType: 'Giấy chứng tử',
        documentNote: 'Quyết định nghỉ việc',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GC_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GC_2',
      }
  ]},{
    key: 'GD',
    value: [
      {
        documentType: 'Bản chính Quyết định',
        documentNote: 'Quyết định nghỉ việc',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GD_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'GD_2',
      }
  ]},{
    key: 'SB',
    value: [
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Quyết định nghỉ việc',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'SB_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'SB_2',
      }
  ]} ,{
    key: 'OF',
    value: [
      {
        documentType: 'Giấy ra viện/Chứng nhận nghỉ việc hưởng BHXH',
        documentNote: 'Quyết định nghỉ việc',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '',
          column: [],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: '',
          column: [],
        },
        documentCode: '0F_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'OF_2',
      }
  ]},{
    key: 'KL',
    value: [
     {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'KL_1',
      }
  ]},{
    key: 'TS',
    value: [
      {
        documentType: 'Giấy khai sinh/Giấy chứng sinh con',
        documentNote: '',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '',
          column: [],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: '',
          column: [],
        },
        documentCode: 'TS_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Truy tăng {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'TS_2',
      }
  ]},{
    key: 'DC',
    value: [
      {
        documentType: 'Bản chính Quyết định',
        documentNote: 'Quyết định điều chỉnh lương, chức danh',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Thay đổi lương, chức danh {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'DC_1',
      },
      {
        documentType: 'Bản chính Bảng lương',
        documentNote: 'Bảng lương nhân viên',
        documentNo:  {
          mesage: '{0}',
          column: ['fromDate'],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Thay đổi lương, chức danh {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'DC_2',
      }
  ]},{
    key: 'CD',
    value: [
      {
        documentType: 'Bản chính Quyết định',
        documentNote: 'Quyết định điều chỉnh chức danh',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: 'Thay đổi chức danh {0} từ {1}',
          column: ['fullName', 'fromDate'],
        },
        documentCode: 'CD_1',
      }
  ]},{
    key: 'DN',
    value: [
      {
        documentType: '',
        documentNote: '',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '{0}',
          column: ['companyRelease'],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: '',
          column: [],
        },
        documentCode: 'DN_1',
      }
  ]},{
    key: 'TV',
    value: [
      {
        documentType: '',
        documentNote: '',
        documentNo:  {
          mesage: '',
          column: [],
        },
        companyRelease: {
          mesage: '',
          column: [],
        },
        dateRelease: {
          mesage: '',
          column: [],
        },
        documentAppraisal: {
          mesage: '',
          column: [],
        },
        documentCode: 'TV_1',
      }
  ]}
];
export const PERMISSIONS = {
  regime_approval: {
    C: 'regimeApproval_C',
    R: 'regimeApproval_R',
    U: 'regimeApproval_U',
    D: 'regimeApproval_D',
  },
  increase_labor: {
    C: 'increaseLabor_C',
    R: 'increaseLabor_R',
    U: 'increaseLabor_U',
    D: 'increaseLabor_D',
  },
  reduction_labor: {
    C: 'reductionLabor_C',
    R: 'reductionLabor_R',
    U: 'reductionLabor_U',
    D: 'reductionLabor_D',
  },
  adjust: {
    C: 'adjust_C',
    R: 'adjust_R',
    U: 'adjust_U',
    D: 'adjust_D',
  },
  arrears: {
    C: 'arrears_C',
    R: 'arrears_R',
    U: 'arrears_U',
    D: 'arrears_D',
  },
  adjust_general: {
    C: 'adjustGeneral_C',
    R: 'adjustGeneral_R',
    U: 'adjustGeneral_U',
    D: 'adjustGeneral_D',
  },
  employees: {
    C: 'employees_C',
    R: 'employees_R',
    U: 'employees_U',
    D: 'employees_D',
  } 
}
export const ErrorMessage = {
  0: 'common.gender.male',
  8: 'common.errorMessenger.dataInvalid',
  2040: 'common.errorMessenger.employeeIsExistDeclatation',
};

export const errorMessages = {
  0: 'Nam',
  8: 'Dữ liệu không hợp lệ',
  2040: 'NLĐ đã có hồ sơ, bạn không thể xóa',
  2001: 'Sai Tên đăng nhập hoặc Mật khẩu. Vui lòng thử lại!',
  3018: 'Email đã tồn tại trong hệ thống'
}
