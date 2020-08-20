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
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
	  { title: 'Vùng sinh sống', rowspan: '3' },
    { title: 'Vùng lương tối thiểu', rowspan: '3' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Ngày chết', rowspan: '3' },
    { title: 'Tiền lương', colspan: '8' },
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
  validations: {
    duplicateUserFields: {
      primary: 'fullName',
      check: ['employeeId']
    },
    required: true,
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
  autocomplete: true,
  width: 70,
  title: '(6)',
  source: [ { id: '3', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
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
  autocomplete: true,
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
  width: 175,
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
  width: 175,
  title: '(12.3)',
  align: 'left',
  source: [ ],
  key: 'recipientsWardsCode',
  defaultLoad: true
}, {
  type: 'text',
  width: 165,
  title: '(12.4)',
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
},
 {
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
  key: 'levelWork'
},{
  type: 'text',
  width: 135,
  wordWrap: true,
  title: '(16)',
  key: 'workAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(17)',
  key: 'departmentId'
}, {
  type: 'text',
  width: 70,
  title: '(18)',
  key: 'motherDayDead',
  fieldName: 'Ngày chết',
  isCalendar: true
}, {
  type: 'numeric',
  width: 80,
  title: '(19.1)',
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
  title: '(19.2)',
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
  title: '(19.3)',
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
  title: '(19.4)',
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
  title: '(19.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(19.6)',
  key: 'allowanceSeniority',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(19.7)',
  key: 'allowanceSeniorityJob',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(19.8)',
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
  title: '(20)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(21)',
  key: 'toDate',
  isCalendar: true,
  fieldName: 'Đến tháng năm'
  
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 60,
  title: '(22)',
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
  title: '(23)',
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
  title: '(24.1)',
  key: 'contractCancelNo',
  fieldName: 'Số quyết định chấm dứt hợp đồng'
}, {
  type: 'text',
  width: 100,
  title: '(24.2)',
  key: 'dateCancelSign',
  fieldName: 'Ngày ký quyết định chấm dứt hợp đồng'
},
{
  type: 'text',
  width: 180,
  title: '(25)',
  wordWrap: true,
  key: 'note'
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
