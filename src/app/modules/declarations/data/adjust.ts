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
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
    { title: 'Vùng lương tối thiểu', rowspan: '3' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Tiền lương mức đóng cũ', colspan: '8' },
    { title: 'Tiền lương mức đóng mới', colspan: '8' },
    { title: 'Từ tháng, năm', rowspan: '3' },
    { title: 'Đến tháng, năm', rowspan: '3' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Quyết định châm dứt HĐLD/ chuyển công tác/nghỉ hưu', colspan: '2', rowspan: '2' },
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Mức lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '6' },
    { title: 'Mức lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '6' }
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },
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
  key: 'isurranceNo'
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
  source: [{ id: '3', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday'
}, {
  type: 'text',
  width: 80,
  title: '(7)',
  key: 'birthday'
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
  key: 'peopleCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(10)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'nationalityCode'
}, {
  type: 'dropdown',
  width: 145,
  title: '(11.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  source: [ ],
  title: '(11.2)',
  align: 'left',
  key: 'registerDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(11.3)',
  source: [],
  align: 'left',
  key: 'registerWardsCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.1)',
  align: 'left',
  source: [],
  key: 'recipientsCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.2)',
  align: 'left',
  source: [],
  key: 'recipientsDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.3)',
  align: 'left',
  source: [ ],
  key: 'recipientsWardsCode',
  defaultLoad: true
}, {
  type: 'text',
  width: 145,
  title: '(12.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(13)',
  source: [],
  key: 'salaryAreaCode'
},{
  type: 'text',
  width: 135,
  title: '(14)',
  fieldName: 'Cấp bậc, chức vụ, chức danh nghề',
  key: 'levelWork'
},{
  type: 'text',
  width: 135,
  wordWrap: true,
  title: '(15)',
  key: 'workAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(16)',
  key: 'departmentId'
}, {
  type: 'numeric',
  width: 80,
  title: '(17.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary',
  fieldName: 'Mức lương',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(17.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratio',
  fieldName: 'Hệ số',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(17.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalary',
  fieldName: 'Các khoản bổ sung',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(17.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceAdditional'
}, {
  type: 'numeric',
  width: 80,
  title: '(17.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel'
}, {
  type: 'numeric',
  width: 70,
  title: '(17.6)',
  fieldName: 'Thâm niên vK(%)',
  key: 'allowanceSeniority',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(17.7)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề(%)',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(17.8)',
  fieldName: 'Chênh lệch bảo lưu',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOther',
  validations: {
    number: true
  }
},{
  type: 'numeric',
  width: 80,
  title: '(18.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salaryNew',
  fieldName: 'Mức lương mới',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratioNew',
  fieldName: 'Hệ số lương mới',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalaryNew',
  fieldName: 'Phụ cấp lương lương mới',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceAdditionalNew',
  fieldName: 'Phụ cấp lương lương mới',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevelNew',
  fieldName: 'Chức vụ lương mới',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(18.6)',
  key: 'allowanceSeniorityNew',
  suffix: '%',
  fieldName: 'Thâm niên VK lương mới',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(18.7)',
  key: 'allowanceSeniorityJobNew',
  suffix: '%',
  fieldName: 'Thâm niên nghề lương mới',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.8)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOtherNew',
  fieldName: 'Chênh lệch bảo lưu lương mới',
  validations: {
    number: true
  }
}, {
  type: 'text',
  width: 60,
  title: '(19)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(20)',
  key: 'toDate',
  isCalendar: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 60,
  title: '(21)',
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
  title: '(22)',
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
  title: '(23.1)',
  key: 'contractNo',
  fieldName: 'Số quyết định',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(23.2)',
  fieldName: 'Ngày quyết định',
  key: 'dateSign',
  validations: {
    required: true
  }
},
{
  type: 'text',
  width: 180,
  title: '(24)',
  key: 'note'
},
{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
}];
