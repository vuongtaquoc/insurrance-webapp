import format from '@app/shared/utils/format';

export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '2' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '2' },    
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '2' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '2' },
    { title: 'Nữ', rowspan: '2' },
    { title: 'Dân tộc', rowspan: '2' },
    { title: 'Quốc tịch', rowspan: '2' },
    { title: 'Mã số hộ gia đình', rowspan: '2' },
    { title: 'Số CCCD/CMTND/ Hộ chiếu', rowspan: '2' },
    { title: 'Số điện thoại liên hệ', rowspan: '2' },
	  { title: 'Email', rowspan: '2' },
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4' },
    { title: 'Nơi đăng ký KCB',colspan: '2' },
    { title: 'Nội dung thay đổi, yêu câu', rowspan: '2' },
    { title: 'Hồ sơ kèm theo', rowspan: '2' },
  ],
 
  [
    { title: 'Mã số BHXH' },
    { title: 'Trạng thái', },    
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },   
    { title: 'Mã đơn vị KCB' },
    { title: 'Tên đơn vị KCB' }    
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
  type: 'numeric',
  align: 'right',
  width: 123,
  title: '(3.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    duplicate: true,
    numberLength: 10
  }
}, {
  type: 'text',
  key: 'isurranceCodeStatuss',
  width: 123,
  title: '(3.2)',
  wordWrap: true,
  readOnly:true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(4)',
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
  title: '(5)',
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(6)',
  align: 'center',
  key: 'gender'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(7)',
  source: [ 'Chọn' ],
  fieldName: 'Dân tộc',
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
  title: '(8)',
  source: [ 'Chọn' ],
  fieldName: 'Quốc tịch',
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
},{
  type: 'numeric',
  align: 'right',
  autocomplete: true,
  fieldName: 'Mã số hộ gia đình',
  width: 135,
  title: '(9)',
  key: 'familyNo',
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(10)',
  key: 'identityCar',
  fieldName: 'Số CCCD/CMTND/ Hộ chiếu',
  validations: {
    required: true,
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
  type: 'text',
  width: 100,
  title: '(12)',
  align: 'left',
  wordWrap: true,
  key: 'email'
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
  source: [ ],
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
  fieldName: 'Mã đơn vị KCB',
  validations: {
    required:true,
  },
  defaultLoad: true,
}, {
  type: 'text',
  width: 300,
  title: '(15.2)',
  align: 'left',
  wordWrap: true,
  fieldName: 'Tên đơn vị KCB',
  key: 'hospitalFirstRegistName',
  validations: {
    required:true,
  }
},
{
  type: 'text',
  width: 250,
  title: '(16)',
  wordWrap: true,
  fieldName:'Nội dung thay đổi',
  key: 'note',
  validations: {
    required:true,
  }
},
{
  type: 'text',
  width: 250,
  title: '(17)',
  wordWrap: true,
  fieldName:'Tài liệu đính kèm',
  key: 'documentAttached'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'hospitalFirstRegistCodeOld'
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
