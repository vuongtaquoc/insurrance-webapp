export const TABLE_NESTED_HEADERS_PART_1 = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Họ và tên', rowspan: 2 },
    { title: 'Mã số BHXH/ Số sổ BHXH', rowspan: 2 },
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: 2 },
    { title: 'Mã nhân viên', rowspan: 2 },
    { title: 'Nghỉ hàng tuần', rowspan: 2 },
    { title: 'Ngày/tháng/năm đi làm thực tế', rowspan: 2 },
    { title: 'Số series', rowspan: 2 },
    { title: 'Nghỉ hưởng chế độ', colspan: 4 },
    { title: 'Điều kiện khám thai', rowspan: 2 },
    { title: 'Điều kiện sinh con', rowspan: 2 },
    { title: 'Thông tin của con', colspan: 9 },
    { title: 'Thông tin của mẹ', colspan: 9 },
    { title: 'Số sổ BHXH của người nuôi dưỡng', subtitle: 'trường hợp mẹ chết', rowspan: 2 },
    { title: 'Cha/mẹ nghỉ chăm sóc con', rowspan: 2 },
    { title: 'Đợt duyệt bổ sung', colspan: 2 },
    { title: 'Hình thức trợ cấp', colspan: 4 },
    { title: 'Phương án', rowspan: 2 },
    { title: 'Ghi chú', rowspan: 2 }
  ], [
    { title: 'Từ ngày' },
    { title: 'Đến ngày' },
    { title: 'Tổng số' },
    { title: 'Từ ngày đơn vị đề nghị...' },
    { title: 'Mã số BHXH của con' },
    { title: 'Số thẻ BHYT của con' },
    { title: 'Số tuần tuổi thai' },
    { title: 'Ngày sinh của con' },
    { title: 'Số con' },
    { title: 'Ngày con chết' },
    { title: 'Số con chết hoặc số thai chết lưu khi sinh' },
    { title: 'Ngày nhận nuôi con nuôi' },
    { title: 'Ngày nhận nuôi', subtitle: 'Đối với người mẹ nhận mang thai hộ nhận con' },
    { title: 'Mã số BHXH của mẹ' },
    { title: 'Số thẻ BHYT của mẹ' },
    { title: 'Số CMTND của mẹ' },
    { title: 'Nghỉ dưỡng thai' },
    { title: 'Mang thai hộ' },
    { title: 'Phẫu thuật hoặc thai dưới 32 tuần' },
    { title: 'Ngày mẹ chết' },
    { title: 'Ngày kết luận', subtitle: 'mẹ được kết luận không còn đủ sức khỏe chăm con' },
    { title: 'Phí giám định y khoa' },
    { title: 'Đợt' },
    { title: 'Tháng/năm' },
    { title: 'Hình thức nhận' },
    { title: 'Số tài khoản' },
    { title: 'Tên chủ tài khoản' },
    { title: 'Ngân hàng' }
  ]
];

export const TABLE_HEADER_COLUMNS_PART_1 = [{
  type: 'text',
  width: 35,
  title: '(A)',
  key: 'orders',
  align: 'center',
  readOnly: true,
}, {
  type: 'text',
  width: 180,
  title: '(B)',
  key: 'fullName'
}, {
  type: 'text',
  width: 120,
  title: '(1)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 135,
  title: '(2)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'isurranceCode'
}, {
  type: 'dropdown',
  width: 190,
  title: '(4)',
  key: 'isurranceCode',
  source: [ ],
}, {
  type: 'text',
  width: 80,
  title: '(5)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'dropdown',
  width: 120,
  title: '(6.1)',
  key: 'isurranceCode',
  source: [ ],
}, {
  type: 'text',
  width: 80,
  title: '(6.2)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 80,
  title: '(6.3)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(6.4)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 100,
  title: '(7)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'dropdown',
  source: [],
  width: 170,
  title: '(8)',
  key: 'isurranceCode'
}, {
  type: 'dropdown',
  source: [],
  width: 230,
  title: '(9)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 120,
  title: '(10.1)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 120,
  title: '(10.2)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 50,
  title: '(10.3)',
  key: 'isurranceCode',
}, {
  type: 'text',
  width: 80,
  title: '(10.4)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 50,
  title: '(10.5)',
  key: 'isurranceCode',
}, {
  type: 'text',
  width: 80,
  title: '(10.6)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 65,
  title: '(10.7)',
  key: 'isurranceCode',
}, {
  type: 'text',
  width: 80,
  title: '(10.8)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 90,
  title: '(10.9)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 120,
  title: '(11.1)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 120,
  title: '(11.2)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 135,
  title: '(11.3)',
  key: 'isurranceCode',
}, {
  type: 'checkbox',
  width: 60,
  title: '(11.4)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 120,
  title: '(11.5)',
  key: 'isurranceCode',
}, {
  type: 'text',
  width: 65,
  title: '(11..6)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 80,
  title: '(11.7)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 90,
  title: '(11.8)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 100,
  title: '(11.9)',
  key: 'isurranceCode',
}, {
  type: 'text',
  width: 140,
  title: '(12)',
  key: 'isurranceCode',
}, {
  type: 'checkbox',
  width: 40,
  title: '(13)',
  key: 'isurranceCode',
}, {
  type: 'dropdown',
  width: 55,
  title: '(14.1)',
  key: 'isurranceCode',
  source: []
}, {
  type: 'text',
  width: 75,
  title: '(14.2)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'dropdown',
  width: 190,
  title: '(C.1)',
  key: 'isurranceCode',
  source: [ ],
}, {
  type: 'text',
  width: 120,
  title: '(C.2)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 120,
  title: '(C.3)',
  key: 'isurranceCode'
}, {
  type: 'dropdown',
  width: 280,
  title: '(C.4)',
  key: 'isurranceCode',
  source: [ ],
}, {
  type: 'dropdown',
  source: [ ],
  width: 180,
  title: '(D)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 180,
  title: '(E)',
  key: 'isurranceCode'
}];

export const TABLE_NESTED_HEADERS_PART_2 = [
  [
    { title: 'STT', rowspan: 3 },
    { title: 'Họ và tên', rowspan: 3 },
    { title: 'Mã số BHXH/ Số sổ BHXH', rowspan: 3 },
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: 3 },
    { title: 'Mã nhân viên', rowspan: 3 },
    { title: 'Số ngày đề nghị hưởng chế độ tại đơn vị', colspan: 3 },
    { title: 'Hồ sơ đã giải quyết', colspan: 3 },
    { title: 'Lý do đề nghị điều chỉnh', rowspan: 3 },
    { title: 'Hình thức trợ cấp', colspan: 4 },
    { title: 'Ghi chú', rowspan: 3 }
  ], [
    { title: 'Từ ngày', rowspan: 2 },
    { title: 'Đến ngày', rowspan: 2 },
    { title: 'Tổng số', rowspan: 2 },
    { title: 'Từ ngày đã giải quyết', rowspan: 2 },
    { title: 'Đợt đã giải quyết', colspan: 2 },
    { title: 'Hình thức nhận', rowspan: 2 },
    { title: 'Số tài khoản', rowspan: 2 },
    { title: 'Tên chủ tài khoản', rowspan: 2 },
    { title: 'Ngân hàng', rowspan: 2 },
  ], [
    { title: 'Đợt' },
    { title: 'Tháng/năm' }
  ]
];

export const TABLE_HEADER_COLUMNS_PART_2 = [{
  type: 'text',
  width: 35,
  title: '(A)',
  key: 'orders',
  align: 'center',
  readOnly: true,
}, {
  type: 'text',
  width: 180,
  title: '(B)',
  key: 'fullName'
}, {
  type: 'text',
  width: 120,
  title: '(1)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 135,
  title: '(2)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 95,
  title: '(4.1)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 95,
  title: '(4.2)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(4.3)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 85,
  title: '(5.1)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'dropdown',
  source: [],
  width: 55,
  title: '(5.2)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 75,
  title: '(5.3)',
  key: 'isurranceCode',
  isCalendar: true
}, {
  type: 'text',
  width: 150,
  title: '(6)',
  key: 'isurranceCode'
}, {
  type: 'dropdown',
  source: [],
  width: 130,
  title: '(C.1)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 145,
  title: '(C.2)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 145,
  title: '(C.3)',
  key: 'isurranceCode'
}, {
  type: 'dropdown',
  source: [],
  width: 240,
  title: '(C.4)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 150,
  title: '(D)',
  key: 'isurranceCode'
}];
