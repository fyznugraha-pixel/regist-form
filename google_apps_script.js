/**
 * INSTRUKSI DEPLOYMENT (PENTING):
 * 1. Buka https://script.google.com/
 * 2. Buka project script yang sudah Anda buat sebelumnya.
 * 3. Hapus kode lama, lalu paste/tempel semua kode baru di bawah ini.
 * 4. Klik Save (icon disket).
 * 5. Klik "Deploy" > "Manage deployments".
 * 6. Klik icon pensil (Edit) di deployment Anda.
 * 7. Pada tulisan "Version", ubah dari "1" ke "New version".
 * 8. Klik "Deploy" lagi.
 * 9. Selesai!
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return handleRegistration(data);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRegistration(data) {
  var sheetName = "Pendaftar Folago Academy";
  var files = DriveApp.getFilesByName(sheetName);
  var spreadsheet;
  var sheet;
  
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
    sheet = spreadsheet.getActiveSheet();
  } else {
    spreadsheet = SpreadsheetApp.create(sheetName);
    sheet = spreadsheet.getActiveSheet();
    
    // Buat Header Row
    var headers = [
      "Kode Unik", 
      "Nama Lengkap", 
      "Username Tiktok (bukan nama tiktok)", 
      "Link Username Tiktok", 
      "Followers", 
      "Pilih salah satu kategori di bawah ini yang paling sesuai dengan kategori konten kamu", 
      "Apakah Kamu Datang dari Anggota Komunitas/Mahasiswa/Institusi/Organisasi?",
      "Kalau iya, sebutkan",
      "Email",
      "No Whatsapp",
      "Timestamp"
    ];
    sheet.appendRow(headers);
    
    // Styling Header
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#0056b3"); // Biru tua agar terlihat profesional
    headerRange.setFontColor("white");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    headerRange.setWrap(true);
    
    // Set tinggi baris header sedikit lebih besar
    sheet.setRowHeight(1, 40);
    
    // Freeze header
    sheet.setFrozenRows(1);
    
    // Terapkan Alternating Colors (Banding) untuk kemudahan membaca
    // Kita terapkan ke range yang cukup besar (misal 1000 baris) agar otomatis rapi
    var fullRange = sheet.getRange(1, 1, 1000, headers.length);
    fullRange.setVerticalAlignment("middle");
    fullRange.setWrap(true); // Teks panjang tidak akan tembus ke kolom sebelah
    
    try {
      fullRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
    } catch (e) {
      // Abaikan jika banding sudah ada
    }
  }
  
  var tickets = [];
  
  if (data.participants && Array.isArray(data.participants)) {
    for (var i = 0; i < data.participants.length; i++) {
      var p = data.participants[i];
      var randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      var ticketId = "FA-WJ" + randomStr;
      
      sheet.appendRow([
        ticketId,
        p.fullName,
        p.tiktokUsername,
        p.tiktokLink,
        p.followers,
        p.kategori,
        p.isCommunity,
        p.communityName,
        p.email,
        p.whatsapp,
        new Date()
      ]);
      
      tickets.push({
        ticketId: ticketId,
        email: p.email,
        fullName: p.fullName
      });
      
      Utilities.sleep(50);
    }
  } else {
    var randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    var ticketId = "FA-WJ" + randomStr;
    
    sheet.appendRow([
        ticketId,
        data.fullName,
        data.tiktokUsername,
        data.tiktokLink,
        data.followers,
        data.kategori,
        data.isCommunity,
        data.communityName,
        data.email,
        data.whatsapp,
        new Date()
    ]);
    
    tickets.push({
      ticketId: ticketId,
      email: data.email,
      fullName: data.fullName
    });
  }
  
  // Format Border untuk data terbaru yang masuk
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var dataRange = sheet.getRange(2, 1, lastRow - 1, 11);
    dataRange.setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);
  }
  
  // Menyesuaikan ukuran kolom agar lebih proporsional
  sheet.setColumnWidth(1, 120); // Kode Unik
  sheet.setColumnWidth(2, 200); // Nama Lengkap
  sheet.setColumnWidth(3, 150); // Username Tiktok
  sheet.setColumnWidth(4, 250); // Link Tiktok
  sheet.setColumnWidth(5, 100); // Followers
  sheet.setColumnWidth(6, 180); // Kategori
  sheet.setColumnWidth(7, 150); // Anggota Komunitas
  sheet.setColumnWidth(8, 200); // Nama Komunitas
  sheet.setColumnWidth(9, 200); // Email
  sheet.setColumnWidth(10, 150); // WA
  sheet.setColumnWidth(11, 160); // Timestamp
  
  return ContentService.createTextOutput(JSON.stringify({
    "status": "success",
    "message": "Data berhasil disimpan",
    "tickets": tickets
  })).setMimeType(ContentService.MimeType.JSON);
}
