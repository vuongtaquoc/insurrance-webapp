export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Họ và tên', rowspan: 2 },
    { title: 'Mã số BHXH', rowspan: 2 },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: 2 },
    { title: 'Ngày, tháng, năm sinh', rowspan: 2 },
    { title: 'Nữ', rowspan: 2 },
    { title: 'Nơi cấp giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: 3 },
    { title: 'Mối quan hệ với chủ hộ', rowspan: 2 },
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: 2 },
    { title: 'Ghi chú', rowspan: 2 }
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Phường/ xã' }
  ]
];

export const TABLE_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  align: 'center',
  readOnly: true,
}, {
  type: 'text',
  width: 180,
  title: '(2)',
  key: 'fullName'
}, {
  type: 'text',
  width: 110,
  title: '(3)',
  key: 'isurranceCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(4)',
  source: [ { id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday'
}, {
  type: 'text',
  width: 80,
  title: '(5)',
  key: 'birthday',
  isCalendar: true,
  // validations: {
  //   required: true
  // }
}, {
  type: 'checkbox',
  width: 30,
  title: '(6)',
  key: 'gender',
  align: 'center',
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 130,
  title: '(7)',
  key: 'cityCode',
  source: [],
  // validations: {
  //   required: true
  // }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 170,
  title: '(8)',
  key: 'districtCode',
  defaultLoad: true,
  source: [ ],
  // validations: {
  //   required: true
  // }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 170,
  title: '(9)',
  key: 'wardsCode',
  defaultLoad: true,
  source: [ ],
  // validations: {
  //   required: true
  // }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 65,
  title: '(10)',
  key: 'relationshipCode',
  source: [ ]
}, {
  type: 'text',
  width: 120,
  title: '(11)',
  key: 'identityCar'
}, {
  type: 'text',
  width: 120,
  title: '(12)',
  key: 'note'
}];
