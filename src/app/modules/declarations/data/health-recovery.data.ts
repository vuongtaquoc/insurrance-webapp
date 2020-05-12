export const TABLE_NESTED_HEADERS_PART_1 = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Họ và tên', rowspan: 2 },
    { title: 'Mã số BHXH/ Số sổ BHXH', rowspan: 2 },
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: 2 },
    { title: 'Mã nhân viên', rowspan: 2 },
    { title: 'Ngày quay trở lại làm việc tại đơn vị', rowspan: 2 },
    { title: 'Số Seri', rowspan: 2 },
    { title: 'Nghỉ hưởng chế độ', colspan: 4 },
    { title: 'Thông tin giám định', colspan: 2 },
    { title: 'Đợt duyệt bổ sung', colspan: 2 },
    { title: 'Hình thức trợ cấp', colspan: 4 },
    { title: 'Ghi chú', rowspan: 2 }
  ], [
    { title: 'Từ ngày' },
    { title: 'Đến ngày' },
    { title: 'Tổng số' },
    { title: 'Từ ngày đơn vị đề nghị...' },
    { title: 'Tỷ lệ suy giảm (%)' },
    { title: 'Ngày giám định' },
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
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    cardId: true,
    duplicate: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'code'
}, {
  type: 'text',
  width: 80,
  title: '(4)',
  key: 'dateStartWork',
  isCalendar: true
}, {
  type: 'text',
  width: 130,
  title: '(5)',
  key: 'seriNo',
}, {
  type: 'text',
  width: 80,
  title: '(6.1)',
  key: 'regimeFromDate',
  isCalendar: true,
  fieldName: 'Ngày đầu tiên người lao động thực tế nghỉ việc hưởng chế độ theo quy định',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 80,
  title: '(6.2)',
  key: 'regimeToDate',
  isCalendar: true,
  fieldName: 'Ngày cuối cùng người lao động thực tế nghỉ việc hưởng chế độ theo quy định',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  width: 60,
  title: '(6.3)',
  key: 'regimeSum',
  sum: true,
  fieldName: 'Tổng số ngày thực tế người lao động nghỉ việc trong kỳ đề nghị giải quyết',
  validations: {
    min: 1
  }
}, {
  type: 'text',
  width: 80,
  title: '(7)',
  key: 'regimeRequestDate',
  isCalendar: true,
  fieldName: 'Từ ngày đơn vị đề nghị hưởng',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  width: 60,
  title: '(8.1)',
  key: 'ratioReduction',
  suffix: '%'
}, {
  type: 'text',
  width: 90,
  title: '(8.2)',
  key: 'expertiseDate',
  isCalendar: true
}, {
  type: 'dropdown',
  width: 55,
  title: '(9.1)',
  key: 'recruitmentNumber'
}, {
  type: 'text',
  width: 75,
  title: '(9.2)',
  key: 'recruitmentDate',
  isCalendar: true
}, {
  type: 'dropdown',
  autocomplete: true,
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
  autocomplete: true,
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
},{
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
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    cardId: true,
    duplicate: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'code'
}, {
  type: 'text',
  width: 95,
  title: '(4.1)',
  key: 'regimeFromDate',
  isCalendar: true
}, {
  type: 'text',
  width: 95,
  title: '(4.2)',
  key: 'regimeToDate',
  isCalendar: true
}, {
  type: 'numeric',
  width: 60,
  title: '(4.3)',
  key: 'regimeSum',
  sum: true
}, {
  type: 'text',
  width: 85,
  title: '(5.1)',
  key: 'recordSolvedFromDate',
  isCalendar: true,
  fieldName: 'Từ ngày đã giải quyết',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [],
  width: 55,
  title: '(5.2)',
  key: 'recordSolvedNumber',
  fieldName: 'Đợt đã giải quyết',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 75,
  title: '(5.3)',
  key: 'recordSolvedEndDate',
  isCalendar: true,
  fieldName: 'Tháng duyệt đợt đã giải quyết',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 150,
  title: '(6)',
  key: 'reasonAdjustment',
  wordWrap: true,
  fieldName: 'Lý do đề nghị điều chỉnh',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
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
  autocomplete: true,
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
