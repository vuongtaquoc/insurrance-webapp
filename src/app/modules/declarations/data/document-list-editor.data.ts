export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT'},
    { title: 'Họ và tên' },
    { title: 'Số sổ BHXH' },
    { title: 'Mã sổ BHXH' },
    { title: 'Tên, loại văn bản'},
    { title: 'Số hiệu văn bản'},
    { title: 'Ngày ban hàng'},
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
  align: 'center',
  key: 'isurranceNo'
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo'
}, {
  type: 'numberic',
  width: 170,
  title: '(5)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 123,
  title: '(6)',
  align: 'left',
}, {
  type: 'text',
  width: 100,
  title: '(7)',
  align: 'left',
  key: 'typeBirthday'
}, {
  type: 'text',
  width:120,
  title: '(8)',
  align: 'left',
  key: 'birthday'
}, {
  type: 'text',
  width: 155,
  title: '(9)',
  align: 'left',
  key: 'gender'
}, {
  type: 'text',
  width: 220,
  title: '(10)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'peopleCode'
}, {
  type: 'text',
  width: 225,
  title: '(11)',
  wordWrap: true,
  align: 'left',
  key: 'nationalityCode'
}];
