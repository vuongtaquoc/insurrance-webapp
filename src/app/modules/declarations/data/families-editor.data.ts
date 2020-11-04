export const TABLE_FAMILIES_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Người tham gia', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Người tham gia là chủ hộ', rowspan: '3' },
    { title: 'THÔNG TIN HỘ GIA ĐÌNH CỦA NGƯỜI THAM GIA', colspan: '9' },
    { title: 'THÔNG TIN THÀNH VIÊN HỘ GIA ĐÌNH', colspan: '15' },
  ],
  [
    { title: 'Chủ hộ', rowspan: '2' },
    { title: 'Mã số hộ gia đình', rowspan: '2' },
    { title: 'Số điện thoại (nếu có)', rowspan: '2' },
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
    { title: 'Số CMND/ thẻ căn cước/ Hộ chiếu', rowspan: '2'},
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
  readOnly: true,
  align: 'center'
},
 {
  type: 'text',
  width: 140,
  title: '(2)',
  readOnly: true,
  key: 'employeeName',
  keyMapping: 'fullName',
  willBeValid: true
},
 {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'isMaster'
}, {
  type: 'text',
  width: 140,
  title: '(4)',
  key: 'relationshipFullName',
  fieldName: 'Chủ hộ',
  validations: {
    required: true
  }
},{
  type: 'text',
  width: 80,
  title: '(5)',
  key: 'relationFamilyNo'
}, {
  type: 'text',
  width: 80,
  title: '(6)',
  key: 'relationshipMobile'
}, {
  type: 'dropdown',
  width: 80,
  title: '(7)',
  key: 'relationshipDocumentType',
  source: []
}, {
  type: 'text',
  width: 80,
  title: '(8)',
  key: 'relationshipBookNo'
}, {
  type: 'dropdown',
  width: 100,
  title: '(9.1)',
  key: 'relationshipCityCode',
  source: [],
  fieldName: 'Tỉnh thành phố',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  width: 100,
  title: '(9.2)',
  defaultLoad: true,
  key: 'relationshipDistrictCode',
  source: [],
  fieldName: 'Quận huyện',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(9.3)',
  defaultLoad: true,
  source: [],
  key: 'relationshipWardsCode',
  fieldName: 'Xã phường',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(9.4)',
  defaultLoad: true,
  key: 'relationAddress'  
}, {
  type: 'text',
  width: 35,
  title: '(10)',
  key: 'orderEmpl',
  align: 'left'
}, {
  type: 'text',
  width: 135,
  title: '(11)',
  willBeValid: true,
  align: 'left',
  key: 'fullName',
  fieldName: 'Tên thành viên',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(12)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10,
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(13)',
  source: [{ id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  fieldName: 'Loại ngày tháng năm sinh',
  defaultLoad: true,
  validations: {
    required: true
  }
},  {
  type: 'text',
  width: 80,
  title: '(14)',
  key: 'birthday',
  fieldName: 'Năm sinh',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 30,
  title: '(15)',
  key: 'gender',
  align: 'center',
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(16)',
  fieldName: 'Quốc tịch',
  key: 'nationalityCode',
  source: [],
  validations: {
    required: true
  }
},{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(17)',
  fieldName: 'Dân tộc',
  key: 'peopleCode',
  source: [],
  validations: {
    required: true
  }
},{
  type: 'checkbox',
  width: 100,
  title: '(18)',
  key: 'sameAddress',
  align: 'center',
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(19)',
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
  title: '(20)',
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
  title: '(21)',
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
  title: '(22)',
  key: 'relationshipCode',
  source: []
},{
  type: 'text',
  width: 120,
  title: '(23)',
  key: 'identityCar'
},  {
  type: 'text',
  width: 150,
  title: '(24)',
  key: 'note'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  isMasterKey: true,
  key: 'conditionValid'
}];
