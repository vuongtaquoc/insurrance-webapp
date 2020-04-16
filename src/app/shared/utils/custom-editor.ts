import * as $ from 'jquery';
import 'bootstrap-datepicker';

export const customPicker = (table, mode, checkPrevCol = false) => {
  return {
    // Methods
    closeEditor : function(cell, save) {
      const value = cell.children[0].value;
      cell.innerHTML = value;
      return value;
    },
    openEditor : function(cell) {
      // Create input
      const element = document.createElement('input');
      element.value = cell.innerHTML;
      // Update cell
      cell.classList.add('editor');
      cell.innerHTML = '';
      cell.appendChild(element);
      const options: any = {
        format: 'dd/mm/yyyy'
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

      $(element).datepicker(options).on('hiden', function(e) {
        setTimeout(function() {
          // To avoid double call
          if (cell.children[0]) {
            table.closeEditor(cell, true);
            $(element).destroy();
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