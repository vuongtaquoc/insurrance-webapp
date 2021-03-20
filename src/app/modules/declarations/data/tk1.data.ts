export const TABLE_FAMILIES_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Dân tộc', rowspan: '3' },
    { title: 'Quốc tịch', rowspan: '3' },
    { title: 'Số CMND/CCCD/ Hộ chiếu', rowspan: '3' },
    { title: 'Số điện thoại', rowspan: '3' },
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4' },
    { title: 'Nơi đăng ký KCB', colspan: '2' },
    { title: 'Ghi chú', rowspan: '3' },
    { title: 'Hồ sơ đính kèm', rowspan: '3' },
    { title: 'Người tham gia là chủ hộ', rowspan: '3' },
    { title: 'THÔNG TIN HỘ GIA ĐÌNH CỦA NGƯỜI THAM GIA', colspan: '9' },
    { title: 'THÔNG TIN THÀNH VIÊN HỘ GIA ĐÌNH', colspan: '15' },
  ],
  [
    { title: 'Tỉnh/TP', rowspan: '2' },
    { title: 'Quận/huyện', rowspan: '2' },
    { title: 'Xã/phường', rowspan: '2' },
    { title: 'Tỉnh/TP', rowspan: '2' },
    { title: 'Quận/huyện', rowspan: '2' },
    { title: 'Xã/phường', rowspan: '2' },
    { title: 'Số nhà, đường phố, thôn, xóm', rowspan: '2' },  
    { title: 'Mã đơn vị KCB', rowspan: '2' },
    { title: 'Tên đơn vị KCB', rowspan: '2' },  
    { title: 'Chủ hộ', rowspan: '2' },
    { title: 'Mã số hộ gia đình', rowspan: '2' },
    { title: 'Số điện thoại', rowspan: '2' },
    { title: 'Loại giấy tờ', rowspan: '2' },
    { title: 'Số sổ hộ khẩu (hoặc số tạm trú)', rowspan: '2' },
    { title: 'Địa chỉ số hộ khẩu(hoặc sổ tạm trú)', colspan: '4' },
    { title: 'STT TV HGD',rowspan: '2'},
    { title: 'Họ và tên', rowspan: '2'},
    { title: 'Mã số BHXH', rowspan: '2'},
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '2'},
    { title: 'Ngày tháng năm sinh', rowspan: '2'},
    { title: 'Nữ', rowspan: '2'},
    { title: 'Quốc tịch', rowspan: '2'},
    { title: 'Dân tộc', rowspan: '2'},
    { title: 'Nơi cấp giấy khai sinh', colspan: '4'},
    { title: 'Mối quan hệ với chủ hộ', rowspan: '2'},
    { title: 'Số CMND/CCCD/Hộ chiếu', rowspan: '2'},
    { title: 'Ghi chú', rowspan: '2'},
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Địa chỉ hộ khẩu' },
    { title: 'Trùng địa chỉ Hộ khẩu' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' }
  ],
];

export const TABLE_FAMILIES_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  keyMapping: 'orders',
  readOnly: true,
  align: 'center'
},
 {
  type: 'text',
  width: 180,
  title: '(2)',
  readOnly: true,
  key: 'employeeName',
  keyMapping: 'fullName',
  willBeValid: true
}, {
  type: 'dropdown',
  width: 100,
  title: '(4)',
  fieldName: 'Loại ngày tháng nắm sinh',
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'declarationTypeBirthday',
  keyMapping: 'typeBirthday',
}, {
  type: 'text',
  width: 80,
  title: '(5)',
  fieldName: 'Nắm sinh',
  key: 'declarationBirthday',
  keyMapping: 'birthday',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(6)',
  align: 'center',
  key: 'declarationGender',
  keyMapping: 'gender',
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(7)',
  source: [ 'Chọn' ],
  key: 'declarationPeopleCode',
  keyMapping: 'peopleCode',
  fieldName: 'Dân tộc',
  validations: {
    required: true,
  },
  warnings: {
    // duplicateUserFields: {
    //   primary: 'peopleCode',
    //   check: ['employeeId']
    // }
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(8)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'declarationNationalityCode',
  fieldName: 'Quốc tịch',
  keyMapping: 'nationalityCode',
  
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(9)',
  key: 'declarationIdentityCar',
  fieldName: 'Số CMND/CCCD/Hộ chiếu',
  keyMapping: 'identityCar',
  validations: {
    cardId: true,
    duplicate: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(10)',
  fieldName: 'Số điện thoại',
  key: 'declarationMobile',
  keyMapping: 'mobile',
  validations: {
    phone: true
  }
}, {
  type: 'dropdown',
  fieldName: 'Tỉnh thành đăng ký khai sinh',
  autocomplete: true,
  validations: {
    required:true,
  },
  width: 145,
  title: '(12.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode',
  keyMapping: 'registerCityCode',
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  fieldName: 'Quận huyện đăng ký khai sinh',
  validations: {
    required:true,
  },
  source: [],
  title: '(12.2)',
  align: 'left',
  key: 'registerDistrictCode',
  keyMapping: 'registerDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(12.3)',
  source: [  ],
  align: 'left',
  key: 'registerWardsCode',
  keyMapping: 'registerWardsCode',
  defaultLoad: true,
  fieldName: 'Xã phương đăng ký khai sinh',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(13.1)',
  align: 'left',
  source: [ 'Chọn' ],
  key: 'recipientsCityCode',
  keyMapping: 'recipientsCityCode',
  fieldName: 'Tỉnh thành nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(13.2)',
  align: 'left',
  source: [ ],
  key: 'recipientsDistrictCode',
  keyMapping: 'recipientsDistrictCode',
  defaultLoad: true,
  fieldName: 'Quận huyện nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(13.3)',
  align: 'left',
  source: [],
  key: 'recipientsWardsCode',
  keyMapping: 'recipientsWardsCode',
  defaultLoad: true,
  fieldName: 'Xã phường nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'text',
  width: 165,
  title: '(13.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress',
  keyMapping: 'recipientsAddress',
},
{
  type: 'text',
  autocomplete: true,
  width: 85,
  title: '(14.1)',
  source: [ ],
  wordWrap: true,
  key: 'hospitalFirstRegistCode',
  keyMapping: 'hospitalFirstRegistCode',
  defaultLoad: true,
  fieldName: 'Mã đơn vị KCB',
  validations: {
    required: true,
  }
}, {
  type: 'text',
  width: 300,
  title: '(14.2)',
  align: 'left',
  wordWrap: true,
  key: 'hospitalFirstRegistName',
  keyMapping: 'hospitalFirstRegistName',
  fieldName: 'Tên đơn vị KCB',
  validations: {
    required: true,
  }
}, {
  type: 'text',
  width: 180,
  title: '(15)',
  wordWrap: true,
  key: 'reason',
  keyMapping: 'reason',
  fieldName: 'Ghi chú'
}, {
  type: 'text',
  width: 180,
  title: '(16)',
  fieldName: 'Hồ sơ đình kèm',
  key: 'documentAttached',
  keyMapping: 'documentAttached'   
},
 {
  type: 'checkbox',
  width: 45,
  title: '(17)',
  align: 'center',
  key: 'isMaster'
}, {
  type: 'text',
  width: 140,
  title: '(18)',
  key: 'relationshipFullName',
  keyMapping: 'relationshipFullName',
  fieldName: 'Chủ hộ',
  validations: {
    required: true
  }
},{
  type: 'text',
  width: 80,
  title: '(19)',
  key: 'relationFamilyNo',
  keyMapping: 'relationFamilyNo'
}, {
  type: 'text',
  width: 80,
  title: '(20)',
  key: 'relationshipMobile',
  keyMapping: 'relationshipMobile'
}, {
  type: 'dropdown',
  width: 80,
  title: '(21)',
  key: 'relationshipDocumentType',
  keyMapping: 'relationshipDocumentType',
  source: []
}, {
  type: 'text',
  width: 80,
  title: '(22)',
  key: 'relationshipBookNo',
  keyMapping: 'relationshipBookNo'
}, {
  type: 'dropdown',
  width: 100,
  title: '(22.1)',
  key: 'relationshipCityCode',
  keyMapping: 'relationshipCityCode',
  source: [],
  fieldName: 'Tỉnh thành phố',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  width: 100,
  title: '(22.2)',
  defaultLoad: true,
  key: 'relationshipDistrictCode',
  keyMapping: 'relationshipDistrictCode',
  source: [],
  fieldName: 'Quận huyện',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(22.3)',
  defaultLoad: true,
  source: [],
  key: 'relationshipWardsCode',
  keyMapping: 'relationshipWardsCode',
  fieldName: 'Xã phường',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(22.4)',
  defaultLoad: true,
  key: 'relationAddress' ,
  keyMapping: 'relationAddress'
}, {
  type: 'text',
  width: 35,
  title: '(23)',
  key: 'orderEmpl',
  keyMapping: 'orderEmpl',
  align: 'left'
}, {
  type: 'text',
  width: 135,
  title: '(24)',
  willBeValid: true,
  align: 'left',
  key: 'fullName',
  keyMapping: 'fullName',
  fieldName: 'Tên thành viên',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(25)',
  key: 'isurranceCode',
  keyMapping: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(26)',
  source: [{ id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  keyMapping: 'typeBirthday',
  fieldName: 'Loại ngày tháng năm sinh',
  defaultLoad: true,
  validations: {
    required: true
  }
},  {
  type: 'text',
  width: 80,
  title: '(27)',
  key: 'birthday',
  keyMapping: 'birthday',
  fieldName: 'Năm sinh',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 30,
  title: '(28)',
  key: 'gender',
  keyMapping: 'gender',
  align: 'center',
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(29)',
  fieldName: 'Quốc tịch',
  key: 'nationalityCode',
  keyMapping: 'nationalityCode',
  source: [],
  validations: {
    required: true
  }
},{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(30)',
  fieldName: 'Dân tộc',
  key: 'peopleCode',
  keyMapping: 'peopleCode',
  source: [],
  validations: {
    required: true
  }
},{
  type: 'checkbox',
  width: 100,
  title: '(31)',
  key: 'sameAddress',
  align: 'center',
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(32)',
  key: 'cityCode',
  source: [],
  fieldName: 'Tình thành phố',
  defaultLoad: true,
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(33)',
  key: 'districtCode',
  defaultLoad: true,
  source: [ ],
  fieldName: 'Quận huyện',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(34)',
  defaultLoad: true,
  source: [],
  key: 'wardsCode',
  fieldName: 'Xã phường',
  validations: {
    required: true
  }
}
, {
  type: 'dropdown',
  autocomplete: true,
  defaultLoad: true,
  width: 100,
  title: '(35)',
  key: 'relationshipCode',
  source: []
},{
  type: 'text',
  width: 120,
  title: '(36)',
  key: 'identityCar'
},  {
  type: 'text',
  width: 150,
  title: '(37)',
  key: 'note'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  isMasterKey: true,
  key: 'conditionValid'
}];
