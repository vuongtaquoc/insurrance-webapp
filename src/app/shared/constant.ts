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

export const DOCUMENTBYPLANCODE =
[
  {
  key: 'TL',
  value: [
    {
      documentName: 'Bản chính hợp đồng lao động',
      documentNote: 'Hợp đồng lao động',
      documentCode: 'TL_1',
      isContract: true,
    },
    {
      documentName: 'Bảng chỉnh lương',
      documentNote: 'Bảng lương nhân viên',
      documentCode: 'TL_2',
      isContract: false,
    }
  ]},
  {
    key: 'TN',
    value: [
      {
        documentName: 'Bản chính hợp đồng lao động',
        documentNote: 'Hợp đồng lao động',
        documentCode: 'TN_1',
        isContract: true,
      },
      {
        documentName: 'Bảng chỉnh lương',
        documentNote: 'Bảng lương nhân viên',
        documentCode: 'TN_1',
        isContract: false,
      }
    ]},
    {
      key: 'TD',
      value: [
        {
          documentName: 'Bản chính hợp đồng lao động',
          documentNote: 'Hợp đồng lao động',
          documentCode: 'TD_1',
          isContract: true,
        },
        {
          documentName: 'Bảng chỉnh lương',
          documentNote: 'Bảng lương nhân viên',
          documentCode: 'TD_1',
          isContract: false,
        }
      ]},
      {
        key: 'TH',
        value: [
          {
            documentName: 'Bản chính hợp đồng lao động',
            documentNote: 'Hợp đồng lao động',
            documentCode: 'TH_1',
            isContract: true,
          },
          {
            documentName: 'Bảng chỉnh lương',
            documentNote: 'Bảng lương nhân viên',
            documentCode: 'TH_2',
            isContract: false,
          }
        ]},
        ,
      {
        key: 'AD',
        value: [
          {
            documentName: 'Bảng chỉnh lương',
            documentNote: 'Bảng lương nhân viên',
            documentCode: 'AD_1',
            isContract: false,
          }
        ]},
];

export const ErrorMessage = {
  0: 'common.gender.male',
  8: 'common.errorMessenger.dataInvalid',
  2040: 'common.errorMessenger.employeeIsExistDeclatation',
};
