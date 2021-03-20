export const TABLE_FAMILIES_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Họ và tên', rowspan: 2 },
    { title: 'Mã số BHXH', rowspan: 2 },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: 2 },
    { title: 'Ngày, tháng, năm sinh', rowspan: 2 },
    { title: 'Nữ', rowspan: 2 },
    { title: 'Quốc tịch', rowspan: 2 },
    { title: 'Dân tộc', rowspan: 2 },
    { title: 'Nơi cấp giấy khai sinh', subtitle: '', colspan: 3 },
    { title: 'Mối quan hệ với chủ hộ', rowspan: 2 },
    { title: 'Số CCCD/CMTND/ Hộ chiếu', rowspan: 2 },
    { title: 'Ghi chú', rowspan: 2 }
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Phường/ xã' }
  ]
];

export const TABLE_FAMILIES_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  align: 'center',
  readOnly: true,
}, {
  type: 'text',
  width: 180,
  title: '(2)',
  key: 'fullName',
  isMasterKey: true
}, {
  type: 'text',
  width: 110,
  title: '(3)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  // validations: {
  //   numberLength: 10
  // }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(4)',
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 80,
  title: '(5)',
  key: 'birthday',
  fieldName: 'Ngày tháng năm sinh',
  isCalendar: true,
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 30,
  title: '(6)',
  key: 'gender',
  align: 'center',
},{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(7)',
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
  title: '(8)',
  fieldName: 'Dân tộc',
  key: 'peopleCode',
  source: [],
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 130,
  title: '(9)',
  key: 'cityCode',
  fieldName: 'Thành phố',
  source: [],
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 170,
  title: '(10)',
  fieldName: 'Quận huyện',
  key: 'districtCode',
  defaultLoad: true,
  source: [],
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 170,
  title: '(11)',
  fieldName: 'Phường xã',
  key: 'wardsCode',
  defaultLoad: true,
  source: [],
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  defaultLoad: true,
  width: 65,
  title: '(12)',
  key: 'relationshipCode',
  source: []
}, {
  type: 'text',
  width: 120,
  title: '(13)',
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/ Thẻ căn cước',
  validations: {
    onlyCharacterNumber: true,
    maxLength: 15
  }
}, {
  type: 'text',
  width: 120,
  title: '(14)',
  key: 'note'
}];
