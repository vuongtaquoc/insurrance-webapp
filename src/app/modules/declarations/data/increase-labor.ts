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
    { title: 'Vùng lương tối thiểu', rowspan: '3' },
    { title: 'Nơi đăng ký KCB', colspan: '2' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Quyết định/Hợp đồng lao động', colspan: '2', rowspan: '2' },
    { title: 'Tiền lương', colspan: '8' },
    { title: 'Từ tháng, năm', rowspan: '3' },
    { title: 'Đến tháng, năm', rowspan: '3' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Mã đơn vị KCB', rowspan: '2' },
    { title: 'Tên đơn vị KCB', rowspan: '2' },
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
    { title: 'Số' },
    { title: 'Ngày ký' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Chênh lệch bảo lưu' },
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
  key: 'isurranceNo'
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo'
}, {
  type: 'numberic',
  width: 123,
  title: '(5.1)',
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 123,
  title: '(5.2)'
}, {
  type: 'dropdown',
  width: 70,
  title: '(6)',
  source: [ { id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
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
  align: 'center',
  key: 'peopleCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(10)',
  source: [ 'Chọn' ],
  align: 'center',
  key: 'nationalityCode'
}, {
  type: 'numberic',
  width: 135,
  title: '(11)',
  align: 'center',
  key: 'identityCar'
}, {
  type: 'numberic',
  width: 135,
  title: '(12)',
  key: 'mobile'
}, {
  type: 'numberic',
  autocomplete: true,
  width: 135,
  title: '(13)',
  key: 'familyNo'
}, {
  type: 'dropdown',
  width: 145,
  title: '(14.1)',
  source: [ 'Chọn' ],
  key: 'registerCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  source: [ ],
  title: '(14.2)',
  key: 'registerDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(14.3)',
  source: [  ],
  key: 'registerWardsCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(15.1)',
  source: [ 'Chọn' ],
  key: 'recipientsCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(15.2)',
  source: [ ],
  key: 'recipientsDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(15.3)',
  source: [ ],
  key: 'recipientsWardsCode',
  defaultLoad: true
}, {
  type: 'text',
  width: 165,
  title: '(15.4)',
  key: 'recipientsAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(16)',
  source: [ ],
  key: 'salaryAreaCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 85,
  title: '(17.1)',
  source: [ ],
  key: 'hospitalFirstRegistCode',
  defaultLoad: true
}, {
  type: 'text',
  width: 300,
  title: '(17.2)',
  key: 'hospitalFirstRegistName'
}, {
  type: 'text',
  width: 135,
  title: '(18)',
  key: 'levelWork'
}, {
  type: 'text',
  width: 135,
  title: '(19)'
}, {
  type: 'text',
  width: 135,
  title: '(20)'
}, {
  type: 'numberic',
  width: 100,
  title: '(21.1)',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(21.2)',
  key: 'dateSign'
}, {
  type: 'numberic',
  width: 80,
  title: '(22.1)',
  mask: '# ##0',
  decimal: ',',
  sum: true,
  key: 'salary'
}, {
  type: 'numberic',
  width: 80,
  title: '(22.2)',
  mask: '# ##0',
  decimal: ',',
  sum: true,
  key: 'ratio'
}, {
  type: 'numberic',
  width: 80,
  title: '(22.3)',
  mask: '# ##0',
  decimal: ',',
  sum: true,
  key: 'allowanceSalary'
}, {
  type: 'numberic',
  width: 80,
  title: '(22.4)',
  mask: '# ##0',
  decimal: ',',
  sum: true,
  key: 'allowanceAdditional'
}, {
  type: 'numberic',
  width: 80,
  title: '(22.5)',
  mask: '# ##0',
  decimal: ',',
  sum: true,
  key: 'allowanceLevel'
}, {
  type: 'text',
  width: 70,
  title: '(22.6)',
  key: 'allowanceSeniority',
  mask: '##%'
}, {
  type: 'text',
  width: 70,
  title: '(22.7)',
  key: 'allowanceSeniorityJob',
  mask: '##%'
}, {
  type: 'numberic',
  width: 80,
  title: '(22.8)',
  mask: '# ##0',
  decimal: ',',
  sum: true,
  key: 'allowanceOther'
}, {
  type: 'calendar',
  options: { format:'MM/YYYY' },
  width: 60,
  title: '(23)',
  key: 'fromDate'
}, {
  type: 'calendar',
  options: { format:'MM/YYYY' },
  width: 60,
  title: '(24)',
  key: 'toDate'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 50,
  title: '(25)',
  source: [ ],
  key: 'planCode'
}, {
  type: 'numberic',
  mask: '# ##0',
  decimal: ',',
  width: 50,
  title: '(26)',
  key: 'ratio'
}, {
  type: 'text',
  width: 180,
  title: '(28)',
  key: 'note'
}];
