export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Người tham gia', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Người tham gia là chủ hộ', rowspan: '3' },
    { title: 'THÔNG TIN HỘ GIA ĐÌNH CỦA NGƯỜI THAM GIA', colspan: '8' },
    { title: 'THÔNG TIN THÀNH VIÊN HỘ GIA ĐÌNH', colspan: '13' },     
  ],
  [
    { title: 'Chủ hộ', rowspan: '2' },
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
    { title: 'Nơi cấp giấy khai sinh', colspan: '4'},
    { title: 'Mối quan hệ với chủ hộ', rowspan: '2'},
    { title: 'Số CMND/ thẻ căn cước/ Hộ chiếu', rowspan: '2'},
    { title: 'Ghi chú', rowspan: '2'},
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Thôn/bản/ tổ dân phố' },
    { title: 'Trùng địa chỉ Hộ khẩu' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' }
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
  key: 'fullName'
}, {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'IsMaster'
}, {
  type: 'text',
  width: 150,
  title: '(4)',
  key: 'relationshipName'
}, {
  type: 'text',
  width: 80,
  title: '(5)',
  key: 'relationshipMobile'  
}, {
  type: 'dropdown',
  width: 123,
  title: '(6)',
  key: 'relationshipDocumentType',
  source: []
}, {
  type: 'text',
  width: 150,
  title: '(7)',
  key: 'relationshipBookNo'
}, {
  type: 'dropdown',
  width: 120,
  title: '(8.1)',
  key: 'relationshipCityCode',
  source: []
}, {
  type: 'dropdown',
  width: 120,
  title: '(8.2)',
  key: 'relationshipDistrictCode',
  source: []
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 120,
  title: '(8.3)',
  source: [],
  key: 'relationshipWardsCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 120,
  title: '(8.4)',
  source: [ 'Chọn' ],
  key: 'relationshipVillageCode'
}, {
  type: 'text',
  width: 35,
  title: '(9)',
  key: 'orders',
  align: 'left'  
}, {
  type: 'text',
  width: 135,
  title: '(10)',
  align: 'left',
  key: 'fullName'
}, {
  type: 'text',
  width: 110,
  title: '(11',
  key: 'isurranceCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(12)',
  source: [ { id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday'
},  {
  type: 'text',
  width: 80,
  title: '(13)',
  key: 'birthday',
  isCalendar: true
}, {
  type: 'checkbox',
  width: 30,
  title: '(14)',
  key: 'gender',
  align: 'center',
}, {
  type: 'checkbox',
  width: 100,
  title: '(15)',
  key: 'sameAddress',
  align: 'center',
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 130,
  title: '(16)',
  key: 'cityCode',
  source: []
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 170,
  title: '(17)',
  key: 'districtCode',
  defaultLoad: true,
  source: [ ]
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 170,
  title: '(18)',
  key: 'wardsCode',
  defaultLoad: true,
  source: [ ]
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 65,
  title: '(19)',
  key: 'relationshipCode',
  source: [ ]
},{
  type: 'text',
  width: 120,
  title: '(20)',
  key: 'identityCar'
},  {
  type: 'text',
  width: 120,
  title: '(21)',
  key: 'note'
}];
