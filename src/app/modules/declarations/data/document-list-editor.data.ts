export const TABLE_DOCUMENT_NESTED_HEADERS = [
  [
    { title: 'STT'},
    { title: 'Họ và tên' },
    { title: 'Mã sổ BHXH' },
    { title: 'Tên, loại văn bản'},
    { title: 'Số hiệu văn bản'},
    { title: 'Ngày ban hành'},
    { title: 'Ngày văn bản có hiệu lực' },
    { title: 'Cơ quan ban hành văn bản' },
    { title: 'Trích yêu văn bản'},
    { title: 'Trích lược nội dung cần thẩm định' },
  ]
];

export const TABLE_DOCUMENT_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  readOnly: true,
  align: 'center'
}, {
  type: 'text',
  width: 150,
  title: '(2)',
  key: 'fullName',
  isMasterKey: true
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  }, {
  type: 'text',
  width: 150,
  title: '(4)',
  wordWrap: true,
  key: 'documentType',
  fieldName: 'Loại văn bản',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 120,
  title: '(5)',
  align: 'left',
  key: 'documentNo',
  fieldName: 'Số hiểu văn bản',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(6)',
  align: 'left',
  key: 'dateRelease',
  fieldName: 'Ngày ban hành',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width:110,
  title: '(7)',
  align: 'left',
  key: 'dateEffective',
  fieldName: 'Ngày văn bản có hiệu lực',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 240,
  wordWrap: true,
  title: '(8)',
  align: 'left',
  key: 'companyRelease',
  fieldName: 'Cơ quan ban hành văn bản',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 250,
  title: '(9)',
  align: 'left',
  wordWrap: true,
  fieldName: 'Trích yếu văn bản',
  key: 'documentNote',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 260,
  title: '(10)',
  fieldName: 'Trích lược nội dung cần thẩm định',
  wordWrap: true,
  align: 'left',
  key: 'documentAppraisal',
  validations: {
    required: true
  }
},
{
  type: 'hidden',
  width: 240,
  align: 'left',
  key: 'isExitsIsurranceNo'
},
{
  type: 'hidden',
  width: 240,
  align: 'left',
  key: 'documentCode'
},
{
  type: 'hidden',
  width: 240,
  align: 'left',
  key: 'planCode'
},
{
  type: 'hidden',
  width: 240,
  align: 'left',
  key: 'employeeId'
}
];
