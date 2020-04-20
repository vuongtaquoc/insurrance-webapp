export const TABLE_NESTED_HEADERS_PART_1 = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Họ và tên', rowspan: 2 },
    { title: 'Mã số BHXH/ Số sổ BHXH', rowspan: 2 },
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: 2 },
    { title: 'Mã nhân viên', rowspan: 2 },
    { title: 'Điều kiện làm việc', rowspan: 2 },
    { title: 'Nghỉ hàng tuần', rowspan: 2 },
    { title: 'Giấy ra viện/Chứng nhận nghỉ việc hưởng BHXH', colspan: 2 },
    { title: 'Nghỉ hưởng chế độ', colspan: 4 },
    { title: 'Trường hợp con ốm', colspan: 3 },
    { title: 'Chuẩn đoán bệnh', colspan: 2 },
    { title: 'Nghỉ dưỡng thai', rowspan: 2 },
    { title: 'Đợt duyệt bổ sung', colspan: 2 },
    { title: 'Hình thức trợ cấp', colspan: 4 },
    { title: 'Ghi chú', rowspan: 2 }
  ], [
    { title: 'Tuyến bệnh viện' },
    { title: 'Số Seri' },
    { title: 'Từ ngày' },
    { title: 'Đến ngày' },
    { title: 'Tổng số' },
    { title: 'Từ ngày đơn vị đề nghị...' },
    { title: 'Ngày sinh con' },
    { title: 'Số thẻ BHYT của con' },
    { title: 'Số con bị ốm' },
    { title: 'Mã bệnh dài ngày' },
    { title: 'Tên bệnh' },
    { title: 'Đợt' },
    { title: 'Tháng/năm' },
    { title: 'Hình thức nhận' },
    { title: 'Số tài khoản' },
    { title: 'Tên chủ tài khoản' },
    { title: 'Ngân hàng' },
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
  key: 'identityCar'
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'code'
}, {
  type: 'dropdown',
  width: 170,
  title: '(4)',
  key: 'conditionWork',
  source: [ ],
}, {
  type: 'dropdown',
  width: 190,
  title: '(5)',
  key: 'holidayWeekly',
  source: [ ],
}, {
  type: 'dropdown',
  width: 240,
  title: '(6.1)',
  key: 'certificationHospital',
  source: [ ],
}, {
  type: 'text',
  width: 130,
  title: '(6.2)',
  key: 'certificationSeri'
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 80,
  title: '(7.1)',
  key: 'regimeFromDate'
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 80,
  title: '(7.2)',
  key: 'regimeToDate'
}, {
  type: 'numberic',
  width: 60,
  title: '(7.3)',
  key: 'regimeSum'
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 80,
  title: '(7.4)',
  key: 'regimeRequestDate'
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 80,
  title: '(8.1)',
  key: 'childrenBirthday'
}, {
  type: 'numberic',
  width: 130,
  title: '(8.2)',
  key: 'childrenHealthNo'
}, {
  type: 'numberic',
  width: 80,
  title: '(8.3)',
  key: 'childrenNumberSick'
}, {
  type: 'dropdown',
  width: 120,
  title: '(9.1)',
  key: 'diagnosticCode',
  source: [ ],
}, {
  type: 'text',
  width: 330,
  title: '(9.2)',
  key: 'diagnosticName'
}, {
  type: 'checkbox',
  width: 45,
  title: '(10)',
  key: 'maternityLeave',
  align: 'center'
}, {
  type: 'dropdown',
  width: 55,
  title: '(11.1)',
  key: 'recruitmentNumber',
  source: [ ],
}, {
  type: 'calendar',
  options: { format:'MM/YYYY' },
  width: 75,
  title: '(11.2)',
  key: 'recruitmentDate'  
}, {
  type: 'dropdown',
  width: 190,
  title: '(C.1)',
  key: 'subsidizeReceipt',
  source: [ ],
}, {
  type: 'text',
  width: 120,
  title: '(C.2)',
  key: 'bankAccount'
}, {
  type: 'text',
  width: 120,
  title: '(C.3)',
  key: 'accountHolder'
}, {
  type: 'dropdown',
  width: 280,
  title: '(C.4)',
  key: 'bankId',
  source: [ ],
}, {
  type: 'text',
  width: 165,
  title: '(D)',
  key: 'note',
  wordWrap: true  
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
  key: 'identityCar'
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'code'
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 95,
  title: '(4.1)',
  key: 'regimeFromDate'
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 95,
  title: '(4.2)',
  key: 'regimeToDate'
}, {
  type: 'text',
  width: 60,
  title: '(4.3)',
  key: 'regimeSum'
}, {
  type: 'calendar',
  options: { format:'DD/MM/YYYY' },
  width: 85,
  title: '(5)',
  key: 'recordSolvedFromDate',
}, {
  type: 'dropdown',
  source: [],
  width: 55,
  title: '(6.1)',
  key: 'recordSolvedNumber'
}, {
  type: 'calendar',
  options: { format:'MM/YYYY' },
  width: 75,
  title: '(6.2)',
  key: 'recordSolvedEndDate'
}, {
  type: 'text',
  width: 150,
  title: '(7)',
  key: 'reasonAdjustment',
  wordWrap: true  
}, {
  type: 'dropdown',
  width: 190,
  title: '(C.1)',
  key: 'subsidizeReceipt',
  source: [ ],
}, {
  type: 'text',
  width: 120,
  title: '(C.2)',
  key: 'bankAccount'
}, {
  type: 'text',
  width: 120,
  title: '(C.3)',
  key: 'accountHolder'
}, {
  type: 'dropdown',
  width: 280,
  title: '(C.4)',
  key: 'bankId',
  source: [ ],
}, {
  type: 'text',
  width: 165,
  title: '(D)',
  key: 'note',
  wordWrap: true  
}];
