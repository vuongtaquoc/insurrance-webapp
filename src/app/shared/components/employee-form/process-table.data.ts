export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Từ tháng/năm', rowspan: 2 },
    { title: 'Đến tháng/năm', rowspan: 2 },
    { title: 'Đơn vị', colspan: 2 },
    { title: 'Chức vụ/công việc', rowspan: 2 },
    { title: 'Mức đóng', rowspan: 2 },
    { title: 'PC chức vụ', rowspan: 2 },
    { title: 'Thâm niên VK (%)', rowspan: 2 },
    { title: 'Thâm niên nghề (%)', rowspan: 2 },
    { title: 'PC khác', rowspan: 2 },
    { title: 'PC lương', rowspan: 2 },
    { title: 'Các khoản bổ sung', rowspan: 2 },
    { title: 'PA', rowspan: 2 },
    { title: 'Tỷ lệ đóng (%)', colspan: 4 }
  ],
  [
    { title: 'Mã ĐV' },
    { title: 'Tên ĐV' },
    { title: 'BHXH' },
    { title: 'BHTNXH. BNN' },
    { title: 'BHTN' },
    { title: 'BHYT' }
  ]
];

export const TABLE_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  align: 'center',
}, {
  type: 'calendar',
  width: 70,
  title: '(2)',
  key: 'fromDate'
}, {
  type: 'calendar',
  width: 70,
  title: '(3)',
  key: 'toDate'
}, {
  type: 'text',
  width: 75,
  title: '(4)',
  key: 'companyCode'
}, {
  type: 'text',
  width: 210,
  title: '(5)',
  key: 'companyName'
}, {
  type: 'text',
  width: 120,
  title: '(6)',
  key: 'levelWork'
}, {
  type: 'numberic',
  width: 90,
  title: '(7)',
  key: 'salary'
}, {
  type: 'numberic',
  width: 55,
  title: '(8)',
  key: 'allowanceLevel'
}, {
  type: 'numberic',
  width: 65,
  title: '(9)',
  key: 'allowanceSeniority'
}, {
  type: 'numberic',
  width: 65,
  title: '(10)',
  key: 'allowanceSeniorityJob'
}, {
  type: 'numberic',
  width: 65,
  title: '(11)',
  key: 'allowanceOther'
}, {
  type: 'numberic',
  width: 90,
  title: '(12)',
  key: 'allowanceSalary'
}, {
  type: 'numberic',
  width: 90,
  title: '(13)',
  key: 'allowanceAdditional'
}, {
  type: 'dropdown',
  width: 40,
  title: '(14)',
  source: [],
  key: 'planCode'
}, {
  type: 'numberic',
  width: 70,
  title: '(15)',
  key: 'ratioBHXH'
}, {
  type: 'numberic',
  width: 70,
  title: '(16)',
  key: 'ratioBHTNLD'
}, {
  type: 'numberic',
  width: 70,
  title: '(17)',
  key: 'ratioBHTN'
}, {
  type: 'numberic',
  width: 70,
  title: '(18)',
  key: 'ratioBHYT'
}];
