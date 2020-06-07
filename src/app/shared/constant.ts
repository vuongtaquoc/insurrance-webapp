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
  ONLY_NUMBER_INCLUDE_DECIMAL: '^[0-9]+(\.[0-9]{1,2})?$'
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
  key: 'TLD',
  value: [
    {
      documentName: 'Bản chính hợp đồng lao động',
      documentNote: 'Hợp đồng lao động',
      isContract: true,
    },
    {
      documentName: 'Bảng chỉnh lương',
      documentNote: 'Bảng lương nhân viên',
      isContract: false,
    }
  ]},
  {
    key: 'TNTG',
    value: [
      {
        documentName: 'Bản chính hợp đồng lao động',
        documentNote: 'Hợp đồng lao động',
        isContract: true,
      },
      {
        documentName: 'Bảng chỉnh lương',
        documentNote: 'Bảng lương nhân viên',
        isContract: false,
      }
    ]},
    {
      key: 'TD',
      value: [
        {
          documentName: 'Bản chính hợp đồng lao động',
          documentNote: 'Hợp đồng lao động',
          isContract: true,
        },
        {
          documentName: 'Bảng chỉnh lương',
          documentNote: 'Bảng lương nhân viên',
          isContract: false,
        }
      ]},
      {
        key: 'TH',
        value: [
          {
            documentName: 'Bản chính hợp đồng lao động',
            documentNote: 'Hợp đồng lao động',
            isContract: true,
          },
          {
            documentName: 'Bảng chỉnh lương',
            documentNote: 'Bảng lương nhân viên',
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
            isContract: false,
          }
        ]},
];
