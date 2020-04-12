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
}, {
  type: 'text',
  width: 180,
  title: '(2)',
  key: 'orders'
}, {
  type: 'text',
  width: 110,
  title: '(3)',
  key: 'orders'
}, {
  type: 'dropdown',
  width: 75,
  title: '(4)',
  source: [ 'Chọn', 'tháng/năm', 'năm' ],
  key: 'typeBirthday'
}, {
  type: 'calendar',
  width: 80,
  title: '(5)',
  key: 'birthday'
}, {
  type: 'checkbox',
  width: 30,
  title: '(6)',
  key: 'gender',
  align: 'center',
}, {
  type: 'dropdown',
  width: 130,
  title: '(7)',
  key: 'orders',
  source: [ 'Chọn' ]
}, {
  type: 'dropdown',
  width: 170,
  title: '(8)',
  key: 'orders',
  source: [ ]
}, {
  type: 'dropdown',
  width: 170,
  title: '(9)',
  key: 'orders',
  source: [ ]
}, {
  type: 'dropdown',
  width: 65,
  title: '(10)',
  key: 'orders',
  source: [ ]
}, {
  type: 'text',
  width: 120,
  title: '(11)',
  key: 'orders'
}, {
  type: 'text',
  width: 120,
  title: '(12)',
  key: 'orders'
}];
