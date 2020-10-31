import format from '@app/shared/utils/format';

export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
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
    { title: 'Nơi đăng ký KCB', colspan: '2' },
    { title: 'Nội dung thay đổi, yêu cầu', rowspan: '3' },
    { title: 'Hồ sơ đính kèm', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Mã đơn vị KCB', rowspan: '2' },
    { title: 'Tên đơn vị KCB', rowspan: '2' },
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },    
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
  // warnings: {
  //   duplicateUserFields: {
  //     primary: 'fullName',
  //     check: ['employeeId']
  //   },
  // },
  validations: {
    required: true,
  }
}, 
{
  type: 'text',
  width: 120,
  title: '(3)',
  key: 'isurranceNo',
  fieldName: 'Số số BHXH',
  // warnings: {
  //   duplicateUserFields: {
  //     primary: 'isurranceNo',
  //     check: ['employeeId']
  //   },
  // },
  validations: {
    required: true,
    duplicate: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 123,
  title: '(4.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    required: true,
    duplicate: true,
    numberLength: 10
  }
}, {
  type: 'text',
  key: 'isurranceCodeStatus',
  width: 123,
  readOnly: true,
  title: '(4.2)',
  wordWrap: true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(5)',
  fieldName: 'Loại ngày tháng nắm sinh',
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  // warnings: {
  //   duplicateUserFields: {
  //     primary: 'typeBirthday',
  //     check: ['employeeId']
  //   }
  // }
}, {
  type: 'text',
  width: 80,
  title: '(6)',
  fieldName: 'Nắm sinh',
  key: 'birthday',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(7)',
  align: 'center',
  key: 'gender'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(8)',
  source: [ 'Chọn' ],
  key: 'peopleCode',
  // warnings: {
  //   duplicateUserFields: {
  //     primary: 'peopleCode',
  //     check: ['employeeId']
  //   }
  // }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(9)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'nationalityCode',
  // warnings: {
  //   duplicateUserFields: {
  //     primary: 'nationalityCode',
  //     check: ['employeeId']
  //   }
  // }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(10)',
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    cardId: true,
    duplicate: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(11)',
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
  title: '(12)',
  key: 'familyNo',
}, {
  type: 'dropdown',
  fieldName: 'Tỉnh thành đăng ký khai sinh',
  autocomplete: true,
  validations: {
    required:true,
  },
  width: 145,
  title: '(13.1)',
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
  source: [],
  title: '(13.2)',
  align: 'left',
  key: 'registerDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(13.3)',
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
  title: '(14.1)',
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
  title: '(14.2)',
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
  title: '(14.3)',
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
  title: '(14.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress'
},
{
  type: 'text',
  autocomplete: true,
  width: 85,
  title: '(15.1)',
  source: [ ],
  wordWrap: true,
  key: 'hospitalFirstRegistCode',
  defaultLoad: true,
}, {
  type: 'text',
  width: 300,
  title: '(15.2)',
  align: 'left',
  wordWrap: true,
  key: 'hospitalFirstRegistName'
}, {
  type: 'text',
  width: 180,
  title: '(16)',
  wordWrap: true,
  key: 'note'
}, {
  type: 'text',
  width: 180,
  title: '(17)',
  wordWrap: true,
  key: 'documentAttached'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  isMasterKey: true,
  key: 'employeeId'
}];
