import format from '@app/shared/utils/format';
export const TABLE_ADJUST_NESTED_HEADERS = [
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
    { title: 'Quyết định/Hợp đồng lao động', colspan: '3', rowspan: '2' },
    { title: 'Tiền lương mức đóng cũ', colspan: '8' },
    { title: 'Tiền lương mức đóng mới', colspan: '8' },
    { title: 'Thời điểm đóng', colspan: '2' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Quyết định điều chỉnh chức danh mức đóng', colspan: '2', rowspan: '2' },
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
    { title: 'Loại hợp đồng' },
    { title: 'Ngày bắt đầu' },
    { title: 'Ngày kết thúc' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Chênh lệch bảo lưu' },
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

export const TABLE_ADJUST_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  readOnly: true,
  align: 'left'
}, {
  type: 'text',
  width: 170,
  title: '(2)',
  key: 'fullName',
  fieldName: 'Họ và tên',
  validations: {
    required: true
  }
   
}, {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'hasBookIsurrance',
  readOnly: true
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo'
}, {
  type: 'numeric',
  width: 123,
  title: '(5.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10
  }
}, {
  type: 'text',
  width: 123,
  title: '(5.2)',
  wordWrap: true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(6)',
  source: [{ id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday'
}, {
  type: 'text',
  width: 80,
  title: '(7)',
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
  validations: {
    lessThanNow: true
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
    required:true,
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
    required:true,
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(11)',
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    required:true,
    cardId: true,
    duplicate: true
  }
}, {
  type: 'dropdown',
  width: 145,
  title: '(12.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  source: [ ],
  title: '(12.2)',
  align: 'left',
  key: 'registerDistrictCode',
  validations: {
    required:true,
  },
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.3)',
  source: [],
  align: 'left',
  key: 'registerWardsCode',
  defaultLoad: true,
  validations: {
    required:true,
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
    required:true,
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
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(13.3)',
  align: 'left',
  source: [ ],
  key: 'recipientsWardsCode',
  defaultLoad: true,
  validations: {
    required:true,
  }
}, {
  type: 'text',
  width: 145,
  title: '(13.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(13)',
  source: [],
  key: 'livesAreaCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(14)',
  source: [],
  key: 'salaryAreaCode'
},{
  type: 'text',
  width: 135,
  title: '(15)',
  fieldName: 'Cấp bậc, chức vụ, chức danh nghề',
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
  fieldName: 'Đến ngày',
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
  fieldName: 'Đến ngày',
},{
  type: 'text',
  width: 135,
  wordWrap: true,
  title: '(19)',
  key: 'workAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(20)',
  key: 'departmentCode'
},{
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 100,
  title: '(21.1)',
  key: 'contractTypeCode',
  fieldName: 'Loại hợp đồng'  
},{
  type: 'text',
  width: 100,
  title: '(22.2)',
  key: 'contractTypeFromDate',
  fieldName: 'Ngày băt đầu',   
},{
  type: 'text',
  width: 100,
  title: '(22.3)',
  key: 'contractTypeToDate',
  fieldName: 'Ngày kết thúc',
  checkReadonly: true,
}, {
  type: 'numeric',
  width: 80,
  title: '(22.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary',
  fieldName: 'Mức lương',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(22.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratio',
  fieldName: 'Hệ số',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(22.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalary',
  fieldName: 'Các khoản bổ sung',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(22.4)',
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
  title: '(22.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
  validations: {
    number: true,
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(22.6)',
  fieldName: 'Thâm niên vK(%)',
  key: 'allowanceSeniority',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(22.7)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề(%)',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(22.8)',
  fieldName: 'Chênh lệch bảo lưu',
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
},{
  type: 'numeric',
  width: 80,
  title: '(23.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salaryNew',
  fieldName: 'Mức lương mới',
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
  key: 'ratioNew',
  fieldName: 'Hệ số lương mới',
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
  key: 'allowanceSalaryNew',
  fieldName: 'Phụ cấp lương lương mới',
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
  key: 'allowanceAdditionalNew',
  fieldName: 'Phụ cấp lương lương mới',
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
  key: 'allowanceLevelNew',
  fieldName: 'Chức vụ lương mới',
  validations: {
    number: true,
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
  key: 'allowanceSeniorityNew',
  suffix: '%',
  fieldName: 'Thâm niên VK lương mới',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(23.7)',
  key: 'allowanceSeniorityJobNew',
  suffix: '%',
  fieldName: 'Thâm niên nghề lương mới',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(23.8)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOtherNew',
  fieldName: 'Chênh lệch bảo lưu lương mới',
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
  isCalendar: true
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
  validations: {
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
  fieldName: 'Số quyết định',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(27.2)',
  fieldName: 'Ngày quyết định',
  key: 'dateCancelSign',
  validations: {
    required: true
  }
},
{
  type: 'text',
  width: 180,
  title: '(28)',
  wordWrap: true,
  key: 'note'
},
{
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
