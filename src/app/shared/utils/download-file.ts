import { MIME_TYPE } from '@app/shared/constant';

export const download = (fileName, data: any, type: string = MIME_TYPE[0].value) => {
  const blob = new Blob([ data ], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
