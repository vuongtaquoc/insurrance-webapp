export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT'},
    { title: 'Họ và tên' },
    { title: 'Số sổ BHXH' },
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

export const TABLE_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  readOnly: true,
  align: 'center'
}, {
  type: 'text',
  width: 170,
  title: '(2)',
  key: 'fullName'
}, {
  type: 'text',
  width: 120,
  title: '(3)',
  key: 'isurranceNo',
  fieldName: 'Số sổ bảo hiểm',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceCode',
  fieldName: 'Mã số bảo hiểm',
  validations: {
    required: true
  }

}, {
  type: 'text',
  width: 170,
  title: '(5)',
  wordWrap: true,
  key: 'documentType',
  fieldName: 'Loại văn bản',
  validations: {
    required: true
  }

}, {
  type: 'text',
  width: 123,
  title: '(6)',
  align: 'left',
  key: 'documentNo',
  fieldName: 'Số hiểu văn bản',
  validations: {
    required: true
  }
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 100,
  title: '(7)',
  align: 'left',
  key: 'dateRelease',
  fieldName: 'Ngày ban hành',
  validations: {
    required: true
  }
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width:120,
  title: '(8)',
  align: 'left',
  key: 'dateEffective',
  fieldName: 'Ngày văn bản có hiệu lực',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 155,
  wordWrap: true,
  title: '(9)',
  align: 'left',
  key: 'companyRelease'
}, {
  type: 'text',
  width: 220,
  title: '(10)',
  align: 'left',
  wordWrap: true,
  key: 'documentNote'
}, {
  type: 'text',
  width: 225,
  title: '(11)',
  wordWrap: true,
  align: 'left',
  key: 'documentAppraisal'
}];
