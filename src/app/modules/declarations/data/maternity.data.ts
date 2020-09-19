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
    { title: 'Ngày kết luận', subtitle: 'mẹ được kết luận không còn đủ sức khỏe chăm con', quote: 'Ngày kết luận (mẹ được kết luận không còn đủ sức khỏe chăm con)' },
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
  fieldName: 'Mã số BHXH, Số sổ BHXH',
  validations: {
    numberLength: 10,
    required: true
  }

}, {
  type: 'text',
  width: 135,
  title: '(2)',
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    cardId: true,
    duplicate: true,
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(3)',
  key: 'code'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 190,
  title: '(4)',
  key: 'holidayWeekly',
  multiple:true,
  source: [],
}, {
  type: 'text',
  width: 80,
  title: '(5)',
  key: 'dateStartWork',
  isCalendar: true
}, {
  type: 'text',
  width: 120,
  title: '(6.1)',
  key: 'SeriNo'
}, {
  type: 'text',
  width: 80,
  title: '(6.2)',
  key: 'regimeFromDate',
  isCalendar: true,
  fieldName: 'Ngày đầu tiên người lao động thực tế nghỉ việc hưởng chế độ theo quy định',
  validations: {
    required: true
  },
  ignoreRequiredRow: ['VIII']
}, {
  type: 'text',
  width: 80,
  title: '(6.3)',
  key: 'regimeToDate',
  isCalendar: true,
  fieldName: 'Ngày cuối cùng người lao động thực tế nghỉ việc hưởng chế độ theo quy định',
  validations: {
    required: true
  },
  ignoreRequiredRow: ['VIII']
}, {
  type: 'numeric',
  width: 60,
  title: '(6.4)',
  key: 'regimeSum',
  fieldName: 'Tổng số ngày thực tế người lao động nghỉ việc trong kỳ đề nghị giải quyết',
  validations: {
    required: true,
    min: 1
  },
  readOnly: true,
  ignoreRequiredRow: ['VIII']
}, {
  type: 'text',
  width: 100,
  title: '(7)',
  key: 'regimeRequestDate',
  isCalendar: true,
  fieldName: 'Từ ngày đơn vị đề nghị hưởng',
  validations: {
    required: true,
    lessThanNow: true
  },
  ignoreRequiredRow: ['VIII']
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [],
  width: 170,
  title: '(8)',
  key: 'conditionPrenatal'
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [],
  width: 230,
  title: '(9)',
  key: 'conditionReproduction'
}, {
  type: 'text',
  width: 120,
  title: '(10.1)',
  key: 'childrenIsurranceCode'
}, {
  type: 'text',
  width: 120,
  title: '(10.2)',
  key: 'childrenHealthNo'
}, {
  type: 'numeric',
  width: 50,
  title: '(10.3)',
  key: 'childrenWeekOld',
  validations: {
    numeric: true,
  }
}, {
  type: 'text',
  width: 80,
  title: '(10.4)',
  key: 'childrenBirthday',
  isCalendar: true
}, {
  type: 'numeric',
  width: 50,
  title: '(10.5)',
  key: 'childrenNumber',
}, {
  type: 'text',
  width: 80,
  title: '(10.6)',
  key: 'childrenDayDead',
  isCalendar: true,
  checkReadonly: true
}, {
  type: 'numeric',
  width: 65,
  title: '(10.7)',
  key: 'childrenNumberSick',
  validations: {
    numeric: true,
  }
}, {
  type: 'text',
  width: 80,
  title: '(10.8)',
  key: 'childrenGodchilDreceptionDate',
  isCalendar: true
}, {
  type: 'text',
  width: 90,
  title: '(10.9)',
  key: 'childrenDreceptionDate',
  isCalendar: true
}, {
  type: 'text',
  width: 120,
  title: '(11.1)',
  key: 'motherIsurranceCode'
}, {
  type: 'text',
  width: 120,
  title: '(11.2)',
  key: 'motherHealthNo'
}, {
  type: 'text',
  width: 135,
  title: '(11.3)',
  key: 'motherIdentityCar',
}, {
  type: 'checkbox',
  align: 'center',
  width: 60,
  title: '(11.4)',
  key: 'maternityLeave'
}, {
  type: 'text',
  width: 120,
  title: '(11.5)',
  key: 'surrogacy',
}, {
  type: 'checkbox',
  width: 65,
  align: 'center',
  title: '(11..6)',
  key: 'isSurgeryOrPremature'
}, {
  type: 'text',
  width: 80,
  title: '(11.7)',
  key: 'motherDayDead',
  isCalendar: true
}, {
  type: 'text',
  width: 90,
  title: '(11.8)',
  key: 'cotherConclusionDate',
  isCalendar: true
}, {
  type: 'text',
  width: 100,
  title: '(11.9)',
  key: 'sponsorIsurranceCode',
}, {
  type: 'checkbox',
  align: 'center',
  width: 140,
  title: '(12)',
  key: 'parentsOffWork',
}, {
  type: 'numeric',
  width: 40,
  title: '(13)',
  key: 'examinationCost',
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 55,
  title: '(14.1)',
  key: 'recruitmentNumber',
  source: []
}, {
  type: 'text',
  width: 75,
  title: '(14.2)',
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
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 180,
  title: '(D)',
  key: 'planCode',
  fieldName: 'Phương án',
  // validations: {
  //   required: true
  // }
}, {
  type: 'text',
  width: 180,
  title: '(E)',
  key: 'note'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
}
];

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
  key: 'fullName',
  validations: {
    required: true,
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
  isCalendar: true,
  ignoreRequiredRow: ['VIII']
}, {
  type: 'text',
  width: 95,
  title: '(4.2)',
  key: 'regimeToDate',
  isCalendar: true,
  ignoreRequiredRow: ['VIII']
}, {
  type: 'numeric',
  width: 60,
  title: '(4.3)',
  key: 'regimeSum',
  fieldName: 'Tổng số',
  ignoreRequiredRow: ['VIII'],
  readOnly: true,
  validations: {
    required: true,
    min: 1
  }
}, {
  type: 'text',
  width: 85,
  title: '(5.1)',
  key: 'recordSolvedFromDate',
  isCalendar: true,
  fieldName: 'Từ ngày đã giải quyết',
  ignoreRequiredRow: ['VIII'],
  validations: {
    required: true,
    lessThanNow: true
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
  source: [],
  width: 130,
  title: '(C.1)',
  key: 'subsidizeReceipt'
}, {
  type: 'text',
  width: 145,
  title: '(C.2)',
  key: 'bankAccount'
}, {
  type: 'text',
  width: 145,
  title: '(C.3)',
  key: 'accountHolder'
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [],
  width: 240,
  title: '(C.4)',
  key: 'bankId'
}, {
  type: 'text',
  width: 150,
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

export const VALIDATION_RULES = {
  SC1: {
    numberLengthByOtherField: 1
  },
  SC2: {
    numberLengthByOtherField: 2
  },
  SC3: {
    minNumberLengthByOtherField: 3
  }
};
