import format from '@app/shared/utils/format';

export const TABLE_NESTED_HEADERS = [
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
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: '3' },
    { title: 'Số điện thoại liên hệ', rowspan: '3' },
    { title: 'Mã số hộ gia đình', rowspan: '3' },
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
    { title: 'Mực thu nhập tháng đóng BHXH', rowspan: '3' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Phương thức đóng', colspan: '3', rowspan: '2' },
    { title: 'Số tền đóng', colspan: '8'},
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Tổng số tiền phải đóng', rowspan: '2' },
    { title: 'NSNN hỗ trợ', colspan: '2' },
    { title: 'NS địa phương hỗ trợ', colspan: '2' },
    { title: 'Tổ chức, cá nhân khác hỗ trợ', colspan: '2' },
    { title: 'Người tham gia đóng', rowspan: '2' },
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },
    { title: 'Phương thức đóng' },
    { title: 'Số tháng đóng' },
    { title: 'Từ tháng/ năm' },
    { title: 'Tỷ lệ(%)' },
    { title: 'Số tiền' },
    { title: 'Tỷ lệ(%)' },
    { title: 'Số tiền' },
    { title: 'Tỷ lệ(%)' },
    { title: 'Số tiền' },
  ],
];

export const TABLE_HEADER_COLUMNS = [{
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
  fieldName: 'Họ và tên',
  key: 'fullName',
  warnings: {
    duplicateUserFields: {
      primary: 'fullName',
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
  key: 'hasBookIsurrance'
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo',
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
  type: 'numeric',
  align: 'right',
  width: 123,
  title: '(5.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10
  }
}, {
  type: 'text',
  key: 'isurranceCodeStatus',
  width: 123,
  title: '(5.2)',
  wordWrap: true,
  readOnly:true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(6)',
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  warnings: {
    duplicateUserFields: {
      primary: 'typeBirthday',
      check: ['fullName']
    }
  }
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
    required: true,
  },
  warnings: {
    duplicateUserFields: {
      primary: 'peopleCode',
      check: ['fullName']
    }
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
    required: true,
  },
  warnings: {
    duplicateUserFields: {
      primary: 'nationalityCode',
      check: ['fullName']
    }
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
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(12)',
  fieldName: 'Số điện thoại',
  key: 'mobile',
  validations: {
    phone: true
  }
},{
  type: 'numeric',
  align: 'right',
  autocomplete: true,
  width: 135,
  title: '(13)',
  key: 'familyNo',
}, {
  type: 'dropdown',
  fieldName: 'Tỉnh thàng đăng ký khai sinh',
  autocomplete: true,
  validations: {
    required:true,
  },
  width: 145,
  title: '(14.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  fieldName: 'Quận huyện đăng ký khai sinh',
  validations: {
    required:true,
  },
  source: [ ],
  title: '(14.2)',
  align: 'left',
  key: 'registerDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(14.3)',
  source: [  ],
  align: 'left',
  key: 'registerWardsCode',
  defaultLoad: true,
  fieldName: 'Xã phương đăng ký khai sinh',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(15.1)',
  align: 'left',
  source: [ 'Chọn' ],
  key: 'recipientsCityCode',
  fieldName: 'Tỉnh thành nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(15.2)',
  align: 'left',
  source: [ ],
  key: 'recipientsDistrictCode',
  defaultLoad: true,
  fieldName: 'Quận huyện nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(15.3)',
  align: 'left',
  source: [],
  key: 'recipientsWardsCode',
  defaultLoad: true,
  fieldName: 'Xã phường nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'text',
  width: 165,
  title: '(15.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(16)',
  source: [],
  key: 'livesAreaCode'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 50,
  title: '(28)',
  source: [ ],
  key: 'planCode',
  fieldName: 'Phương án',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 150,
  title: '(18.1)',
  align: 'left',
  wordWrap: true,
  key: 'hospitalFirstRegistName'
}, {
  type: 'text',
  width: 135,
  title: '(18.2)',
  key: 'levelWork'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(18.3)',
  source: [],
  key: 'workTypeCode'
}, {
  type: 'text',
  width: 80,
  title: '(19.1)',
  key: 'workTypeFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 80,
  title: '(19.2)',
  key: 'workTypeToDate',
  fieldName: 'Từ ngày',
},
{
  type: 'text',
  width: 100,
  title: '(19.3)',
  key: 'careFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 80,
  title: '(19.4)',
  key: 'careTypeToDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 100,
  wordWrap: true,
  title: '(19.5)',
  key: 'workAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 80,
  title: '(19.6)',
  key: 'departmentCode'
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(19.7)',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(19.8)',
  key: 'dateSign',
  fieldName: 'Ngày ký',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'text',
  width: 220,
  title: '(20)',
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
