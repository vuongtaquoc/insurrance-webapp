import format from '@app/shared/utils/format';
export const TABLE_REDUCTION_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Đã có sổ BHXH', rowspan: '3' },
    { title: 'Số sổ BHXH', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Dân tộc', rowspan: '3' },
    { title: 'Quốc tịch', rowspan: '3' },
    { title: 'Số CMTNN/Hộ chiếu/Thẻ căn cước', rowspan: '3' }, 
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
	{ title: 'Vùng sinh sống', rowspan: '3' },
    { title: 'Vùng lương tối thiểu', rowspan: '3' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Vị trí làm việc', colspan: '3' },
    { title: 'Ngành/nghề nặng nhọc độc hại', colspan: '2' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Ngày chết', rowspan: '3' },
    { title: 'Quyết định/Hợp đồng lao động', colspan: '5', rowspan: '2' },
    { title: 'Tiền lương', colspan: '8' },
    { title: 'Thời điểm đóng', colspan: '2' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Quyết định châm dứt HĐLD/ chuyển công tác/nghỉ hưu', colspan: '2', rowspan: '2' },
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Loại', rowspan: '2' },
    { title: 'Từ ngày', rowspan: '2' },
    { title: 'Đến ngày', rowspan: '2' },
    { title: 'Từ ngày', rowspan: '2' },
    { title: 'Đến ngày', rowspan: '2' },
    { title: 'Mức lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '6' },
    { title: 'Tháng. năm bắt đầu', rowspan: '2' },
    { title: 'Tháng. năm kết thúc', rowspan: '2' },
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },
    { title: 'Số' },
    { title: 'Ngày ký' },
    { title: 'Loại hợp đồng' },
    { title: 'Ngày bắt đầu' },
    { title: 'Ngày kết thúc' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Chênh lệch bảo lưu' },
    { title: 'Số' },
    { title: 'Ngày ký' },
  ],
];

export const TABLE_REDUCTION_HEADER_COLUMNS = [{
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
  key: 'fullName',
  fieldName: 'Họ và tên',
  isMasterKey: true,
  warnings: {
    duplicateUserFields: {
      primary: 'isurranceNo',
      check: ['employeeId']
    },
  },
  validations: {     
    required: true,    
  }
}, {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'isExitsIsurranceNo',
  readOnly: true
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo',
  fieldName: 'Số sổ BHXH',
  warnings: {
    duplicateUserFields: {
      primary: 'isurranceNo',
      check: ['employeeId']
    },
  },
  validations: {
    required: true,
    duplicate: true   
  }
}, {
  type: 'numeric',
  width: 123,
  title: '(5.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  warnings: {
    duplicateUserFields: {
      primary: 'isurranceCode',
      check: ['employeeId']
    },
  },
  validations: {
    required: true,
    duplicate: true,
    numberLength: 10
  }
}, {
  type: 'text',
  width: 123,
  title: '(5.2)',
  fieldName: 'Trạng thái',
  readOnly: true,
  wordWrap: true,
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 70,
  title: '(6)',
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  warnings: {
    duplicateUserFields: {
      primary: 'typeBirthday',
      check: ['employeeId']
    },
  }
}, {
  type: 'text',
  width: 80,
  title: '(7)',
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
  validations: {
    required: true,
    lessThanNow: true
  },
  warnings: {
    duplicateUserFields: {
      primary: 'birthday',
      check: ['employeeId']
    },
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(8)',
  align: 'center',
  key: 'gender'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(9)',
  source: [ 'Chọn' ],
  key: 'peopleCode',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(10)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'nationalityCode',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(11)',
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    required: true,
    cardId: true,
    duplicate: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  source: [ ],
  title: '(12.2)',
  align: 'left',
  key: 'registerDistrictCode',
  defaultLoad: true,
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(12.3)',
  source: [],
  align: 'left',
  key: 'registerWardsCode',
  defaultLoad: true,
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(13.1)',
  align: 'left',
  source: [],
  key: 'recipientsCityCode',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(13.2)',
  align: 'left',
  source: [],
  key: 'recipientsDistrictCode',
  defaultLoad: true,
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(13.3)',
  align: 'left',
  source: [ ],
  key: 'recipientsWardsCode',
  validations: {
    required: true
  },
  defaultLoad: true
}, {
  type: 'text',
  width: 165,
  title: '(13.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(14)',
  source: [],
  key: 'livesAreaCode'
},
 {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(15)',
  source: [],
  key: 'salaryAreaCode'
},{
  type: 'text',
  width: 135,
  title: '(16)',
  validations: {
    required: true,
  },
  key: 'levelWork'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(17.1)',
  source: [],
  key: 'workTypeCode'
}, {
  type: 'text',
  width: 80,
  title: '(17.2)',
  key: 'workTypeFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 80,
  title: '(17.3)',
  key: 'workTypeToDate',
  fieldName: 'Từ ngày',
},
{
  type: 'text',
  width: 100,
  title: '(18.1)',
  key: 'careFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 100,
  title: '(18.2)',
  key: 'careTypeToDate',
  fieldName: 'Từ ngày',
},
{
  type: 'text',
  width: 135,
  wordWrap: true,
  title: '(19)',
  fieldName: 'Nới làm việc',
  key: 'workAddress',
  validations: {
    required: true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(20)',
  key: 'departmentCode'
}, {
  type: 'text',
  width: 70,
  title: '(21)',
  key: 'motherDayDead',
  fieldName: 'Ngày chết',
  isCalendar: true
},
{
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(22.1)',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(22.2)',
  key: 'dateSign',
  fieldName: 'Ngày ký',
  validations: {
    lessThanNow: true
  }
},{
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 100,
  title: '(22.3)',
  key: 'contractTypeCode',
  fieldName: 'Loại hợp đồng'  
},{
  type: 'text',
  width: 100,
  title: '(22.4)',
  key: 'contractTypeFromDate',
  fieldName: 'Ngày băt đầu',
  isCalendar: true
},{
  type: 'text',
  width: 100,
  title: '(22.5)',
  key: 'contractTypeToDate',
  fieldName: 'Ngày kết thúc',
  isCalendar: true
}, {
  type: 'numeric',
  width: 80,
  title: '(23.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(23.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratio',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(23.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalary',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(23.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceAdditional',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(23.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
  validations: {
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(23.6)',
  key: 'allowanceSeniority',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(23.7)',
  key: 'allowanceSeniorityJob',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(23.8)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOther',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'text',
  width: 60,
  title: '(24.1)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(24.2)',
  key: 'toDate',
  isCalendar: true,
  fieldName: 'Đến tháng năm'
  
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 60,
  title: '(25)',
  source: [ ],
  key: 'planCode',
  fieldName: 'Phương án',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  mask: '#,##0',
  // decimal: ',',
  width: 50,
  title: '(26)',
  key: 'ratio',
  fieldName: 'Tỷ lệ đóng',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
},
{
  type: 'numeric',
  width: 100,
  title: '(27.1)',
  key: 'contractCancelNo',
  fieldName: 'Số quyết định chấm dứt hợp đồng'
}, {
  type: 'text',
  width: 100,
  title: '(27.2)',
  key: 'dateCancelSign',
  fieldName: 'Ngày ký quyết định chấm dứt hợp đồng'
},
{
  type: 'text',
  width: 180,
  title: '(28)',
  wordWrap: true,
  key: 'reason'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeIdClone'
}];
