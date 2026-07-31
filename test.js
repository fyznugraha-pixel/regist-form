const QRCode = require('qrcode');
const fs = require('fs');

function generateHtmlQrCode(data) {
  const qr = QRCode.create(data, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const modules = qr.modules.data;
  
  let html = '<div style="background-color: #ffffff; padding: 15px; display: inline-block;">\n';
  html += '<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0 auto; line-height: 0;">\n';
  
  for (let row = 0; row < size; row++) {
    html += '  <tr style="line-height: 0; font-size: 0;">\n';
    for (let col = 0; col < size; col++) {
      const isDark = modules[row * size + col];
      const color = isDark ? '#000000' : '#ffffff';
      html += `    <td style="width: 8px; height: 8px; background-color: ${color}; padding: 0; margin: 0; font-size: 0; line-height: 0; border: none;"></td>\n`;
    }
    html += '  </tr>\n';
  }
  
  html += '</table></div>';
  return html;
}

fs.writeFileSync('qr-test.html', generateHtmlQrCode('TK-1784554821-H6L1'));
console.log('Done!');
