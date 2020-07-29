export const TABLE_NESTED_HEADERS_PART_1 = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Họ và tên', rowspan: 2 },
    { title: 'Mã số BHXH/ Số sổ BHXH', rowspan: 2 },
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: 2 },
    { title: 'Mã nhân viên', rowspan: 2 },
    { title: 'Điều kiện làm việc', rowspan: 2, quote: 'Điều kiện làm việc tại thời điểm nghỉ chế độ của NLĐ', },
    { title: 'Nghỉ hàng tuần', rowspan: 2, quote: 'Ghi ngày nghỉ hàng tuần của NLĐ nếu khác với quy định chung là nghỉ bao gồm Thứ 7 và Chủ nhật', },
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
    { title: 'Từ ngày', quote: 'Ngày đầu tiên được chỉ định nghỉ chế độ' },
    { title: 'Đến ngày', quote: 'Ngày cuối cùng được chỉ định nghỉ chế độ (không có thời gian gián đoạn)' },
    { title: 'Tổng số', quote: 'Ghi tổng số ngày thực tế NLĐ nghỉ việc trong kỳ đề nghị giải quyết theo từng loại chế độ' },
    { title: 'Từ ngày đơn vị đề nghị...', quote: 'Kê khai ngày sinh của con trong trường hợp nghỉ việc để chăm sóc con ốm mà Giấy ra viện/Giấy chứng nhận nghỉ việc hưởng BHXH không thể hiện ngày sinh của con.' },
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
  key: 'fullName',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 120,
  title: '(1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10
  }
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
  type: 'dropdown',
  autocomplete: true,
  width: 170,
  title: '(4)',
  key: 'conditionWork',
  source: [ ],
}, {
  type: 'dropdown',
  width: 190,
  title: '(5)',
  key: 'holidayWeekly',
  autocomplete: true,
  multiple:true,
  source: [ ],
}, {
  type: 'dropdown',
  autocomplete: true,
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
  type: 'text',
  width: 80,
  title: '(7.1)',
  key: 'regimeFromDate',
  isCalendar: true,
  fieldName: 'Từ ngày',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 80,
  title: '(7.2)',
  key: 'regimeToDate',
  isCalendar: true,
  fieldName: 'Đến ngày',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  width: 60,
  title: '(7.3)',
  key: 'regimeSum',
  sum: true,
  fieldName: 'Tổng số',
  readOnly: true,
  validations: {
    required: true,
    min: 1
  }
}, {
  type: 'text',
  width: 80,
  title: '(7.4)',
  key: 'regimeRequestDate',
  isCalendar: true,
  fieldName: 'Từ ngày đơn vị đề nghị',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'text',
  width: 80,
  title: '(8.1)',
  key: 'childrenBirthday',
  isCalendar: true,
  fieldName: 'Ngày sinh con',
  validations: {
    greaterThanNow: true
  }
}, {
  type: 'numeric',
  width: 130,
  title: '(8.2)',
  key: 'childrenHealthNo',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(8.3)',
  key: 'childrenNumberSick',
  sum: true,
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 120,
  title: '(9.1)',
  key: 'diagnosticCode',
  defaultLoad: true,
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
  autocomplete: true,
  width: 55,
  title: '(11.1)',
  key: 'recruitmentNumber',
  source: [ ],
}, {
  type: 'text',
  width: 75,
  title: '(11.2)',
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
  key: 'bankAccount',
  validations: {
    required: true
  }
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
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
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
    { title: 'Lý do đề nghị điều chỉnh', rowspan: 3, quote: 'Ghi chi tiết lý do phát sinh việc điều chỉnh' },
    { title: 'Hình thức trợ cấp', colspan: 4 },
    { title: 'Ghi chú', rowspan: 3 }
  ], [
    { title: 'Từ ngày', rowspan: 2, quote: 'Ngày đầu tiên được chỉ định nghỉ chế độ' },
    { title: 'Đến ngày', rowspan: 2, quote: 'Ngày cuối cùng được chỉ định nghỉ chế độ (không có thời gian gián đoạn)' },
    { title: 'Tổng số', rowspan: 2, quote: 'Ghi tổng số ngày thực tế NLĐ nghỉ việc trong kỳ đề nghị giải quyết theo từng loại chế độ' },
    { title: 'Từ ngày đã giải quyết', rowspan: 2 },
    { title: 'Đợt đã giải quyết', colspan: 2, quote: 'Ghi Đợt...tháng...năm...cơ quan BHXH đã xét duyệt NLĐ được tính hưởng trợ cấp bị sai' },
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
  key: 'fullName',
  fieldName: 'Họ và tên',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 120,
  title: '(1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10
  }
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
  type: 'text',
  width: 60,
  title: '(4.3)',
  key: 'regimeSum',
  sum: true,
  readOnly: true,
  validations: {
    required: true,
    min: 1
  },
  fieldName: 'Tổng số'
}, {
  type: 'text',
  width: 85,
  title: '(5)',
  key: 'recordSolvedFromDate',
  isCalendar: true,
  fieldName: 'Từ ngày đã giải quyết',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [],
  width: 55,
  title: '(6.1)',
  key: 'recordSolvedNumber',
  fieldName: 'Đợt đã giải quyết',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 75,
  title: '(6.2)',
  key: 'recordSolvedEndDate',
  isCalendar: true,
  fieldName: 'Tháng duyệt đợt đã giải quyết',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 150,
  title: '(7)',
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
},
{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
}];
