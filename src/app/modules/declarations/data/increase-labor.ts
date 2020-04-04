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
  key: 'orders'
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
  key: 'isurranceCode'
}, {
  type: 'text',
  width: 123,
  title: '(5.1)'
}, {
  type: 'text',
  width: 123,
  title: '(5.2)'
}, {
  type: 'dropdown',
  width: 70,
  title: '(6)',
  source: [ 'Chọn', 'tháng/năm', 'năm' ]
}, {
  type: 'calendar',
  width: 80,
  title: '(7)'
}, {
  type: 'checkbox',
  width: 35,
  title: '(8)',
  align: 'center'
}, {
  type: 'dropdown',
  width: 75,
  title: '(9)',
  source: [ 'Chọn', 'Kinh', 'Mường' ],
  align: 'center'
}, {
  type: 'dropdown',
  width: 100,
  title: '(10)',
  source: [ 'Việt Nam' ],
  align: 'center'
}, {
  type: 'text',
  width: 135,
  title: '(11)',
  align: 'center'
}, {
  type: 'text',
  width: 135,
  title: '(12)'
}, {
  type: 'text',
  width: 135,
  title: '(13)'
}, {
  type: 'text',
  width: 145,
  title: '(14.1)'
}, {
  type: 'text',
  width: 145,
  title: '(14.2)'
}, {
  type: 'text',
  width: 175,
  title: '(14.3)'
}, {
  type: 'text',
  width: 145,
  title: '(15.1)'
}, {
  type: 'text',
  width: 145,
  title: '(15.2)'
}, {
  type: 'text',
  width: 175,
  title: '(15.3)'
}, {
  type: 'text',
  width: 165,
  title: '(15.4)'
}, {
  type: 'text',
  width: 75,
  title: '(16)'
}, {
  type: 'text',
  width: 85,
  title: '(17.1)'
}, {
  type: 'text',
  width: 300,
  title: '(17.2)'
}, {
  type: 'text',
  width: 135,
  title: '(18)'
}, {
  type: 'text',
  width: 135,
  title: '(19)'
}, {
  type: 'text',
  width: 135,
  title: '(20)'
}, {
  type: 'text',
  width: 100,
  title: '(21.1)'
}, {
  type: 'text',
  width: 100,
  title: '(21.2)'
}, {
  type: 'text',
  width: 80,
  title: '(22.1)',
  mask: '#.##,000',
  decimal: ',',
  sum: true
}, {
  type: 'text',
  width: 80,
  title: '(22.2)',
  mask: '#.##,000',
  decimal: ',',
  sum: true
}, {
  type: 'text',
  width: 80,
  title: '(22.3)',
  mask: '#.##,000',
  decimal: ',',
  sum: true
}, {
  type: 'text',
  width: 80,
  title: '(22.4)',
  mask: '#.##,000',
  decimal: ',',
  sum: true
}, {
  type: 'text',
  width: 80,
  title: '(22.5)',
  mask: '#.##,000',
  decimal: ',',
  sum: true
}, {
  type: 'text',
  width: 70,
  title: '(22.6)'
}, {
  type: 'text',
  width: 70,
  title: '(22.7)'
}, {
  type: 'text',
  width: 80,
  title: '(22.8)',
  mask: '#.##,000',
  decimal: ',',
  sum: true
}, {
  type: 'text',
  width: 60,
  title: '(23)'
}, {
  type: 'text',
  width: 60,
  title: '(24)'
}, {
  type: 'text',
  width: 50,
  title: '(25)'
}, {
  type: 'text',
  width: 50,
  title: '(26)'
}, {
  type: 'text',
  width: 180,
  title: '(28)'
}];
