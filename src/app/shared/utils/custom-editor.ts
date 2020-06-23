import * as $ from 'jquery';
import 'bootstrap-datepicker';
import * as moment from 'moment';

$.fn.datepicker.dates['vi'] = {
  days: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
  daysShort: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  daysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
  monthsShort: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
  today: "Hôm nay",
  clear: "Xóa",
  format: "dd/mm/yyyy"
};

export const customPicker = (table, mode, checkPrevCol = false) => {
  return {
    // Methods
    closeEditor : function(cell, save) {
      const options: any = {
        format: 'dd/mm/yyyy',
        language: 'vi'
      };

      if (checkPrevCol) {
        const dataset = cell.dataset;
        const x = Number(dataset.x);
        const y = Number(dataset.y);

        const prevData = table.getValueFromCoords(x - 1, y);

        if (prevData === '1') {
          options.format = 'mm/yyyy';
          options.viewMode = 'months';
          options.minViewMode = 'months';
        } else if (prevData === '2') {
          options.format = 'yyyy';
          options.viewMode = 'years';
          options.minViewMode = 'years';
        }
      } else {
        if (mode === 'month') {
          options.format = 'mm/yyyy';
          options.viewMode = 'months';
          options.minViewMode = 'months';
        } else if (mode === 'year') {
          options.format = 'yyyy';
          options.viewMode = 'years';
          options.minViewMode = 'years';
        }
      }

      const value = cell.children[0].value;
      const isValid = moment(value, options.format.toUpperCase(), true).isValid();
      cell.innerHTML = isValid ? value : '';
      return isValid ? value : '';
    },
    openEditor : function(cell) {
      const options: any = {
        format: 'dd/mm/yyyy',
        language: 'vi'
      };

      if (checkPrevCol) {
        const dataset = cell.dataset;
        const x = Number(dataset.x);
        const y = Number(dataset.y);

        const prevData = table.getValueFromCoords(x - 1, y);

        if (prevData === '1') {
          options.format = 'mm/yyyy';
          options.viewMode = 'months';
          options.minViewMode = 'months';
        } else if (prevData === '2') {
          options.format = 'yyyy';
          options.viewMode = 'years';
          options.minViewMode = 'years';
        }
      } else {
        if (mode === 'month') {
          options.format = 'mm/yyyy';
          options.viewMode = 'months';
          options.minViewMode = 'months';
        } else if (mode === 'year') {
          options.format = 'yyyy';
          options.viewMode = 'years';
          options.minViewMode = 'years';
        }
      }

      const isValid = moment(cell.innerHTML, options.format.toUpperCase(), true).isValid();

      // Create input
      const element = document.createElement('input');
      element.value = isValid ? table.runMask(cell.innerHTML, options.format) : '';
      // Update cell
      cell.classList.add('editor');
      cell.innerHTML = '';
      cell.appendChild(element);

      $(element).on('keyup', function(e) {
        this.value = table.runMask(this.value, options.format)
      });

      $(element).datepicker(options).on('changeDate', function(e) {
        setTimeout(function() {
          // To avoid double call
          if (cell.children[0]) {
            table.closeEditor(cell, true);
            $(element).datepicker('destroy');
          }
        });
      });

      // Focus on the element
      element.focus();
    },
    getValue : function(cell) {
      return cell.innerHTML;
    },
    setValue : function(cell, value) {
      cell.innerHTML = value;
    }
  };
}
