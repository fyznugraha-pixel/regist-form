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
  var sheetName = "Pendaftar Folago Academy - Payment";
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
      "Bank",
      "No Rekening Tujuan",
      "Nominal",
      "Link Bukti Bayar",
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

  // Folder tujuan upload bukti bayar = folder yang sama dengan spreadsheet
  var ssFile = DriveApp.getFileById(spreadsheet.getId());
  var parents = ssFile.getParents();
  var proofFolder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();

  var tickets = [];
  var participantsList = (data.participants && Array.isArray(data.participants))
    ? data.participants
    : [data];

  for (var i = 0; i < participantsList.length; i++) {
    var p = participantsList[i];
    var randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    var ticketId = "FA-WJ" + randomStr;

    var proofLink = savePaymentProof(proofFolder, p, ticketId);

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
      p.paymentBank || '',
      p.paymentAccount || '',
      p.paymentAmount || '',
      proofLink,
      new Date()
    ]);

    tickets.push({
      ticketId: ticketId,
      email: p.email,
      fullName: p.fullName
    });

    Utilities.sleep(50);
  }

  // Format Border untuk data terbaru yang masuk
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var dataRange = sheet.getRange(2, 1, lastRow - 1, 15);
    dataRange.setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);
  }

  // Menyesuaikan ukuran kolom agar lebih proporsional
  sheet.setColumnWidth(1, 120);  // Kode Unik
  sheet.setColumnWidth(2, 200);  // Nama Lengkap
  sheet.setColumnWidth(3, 150);  // Username Tiktok
  sheet.setColumnWidth(4, 250);  // Link Tiktok
  sheet.setColumnWidth(5, 100);  // Followers
  sheet.setColumnWidth(6, 180);  // Kategori
  sheet.setColumnWidth(7, 150);  // Anggota Komunitas
  sheet.setColumnWidth(8, 200);  // Nama Komunitas
  sheet.setColumnWidth(9, 200);  // Email
  sheet.setColumnWidth(10, 150); // WA
  sheet.setColumnWidth(11, 100); // Bank
  sheet.setColumnWidth(12, 150); // No Rekening Tujuan
  sheet.setColumnWidth(13, 120); // Nominal
  sheet.setColumnWidth(14, 250); // Link Bukti Bayar
  sheet.setColumnWidth(15, 160); // Timestamp

  return ContentService.createTextOutput(JSON.stringify({
    "status": "success",
    "message": "Data berhasil disimpan",
    "tickets": tickets
  })).setMimeType(ContentService.MimeType.JSON);
}

// Decode bukti bayar (data URL base64) lalu simpan sebagai file di Drive.
// Mengembalikan URL file, atau string kosong kalau tidak ada bukti bayar.
function savePaymentProof(folder, p, ticketId) {
  if (!p.paymentProof) {
    return '';
  }

  var matches = String(p.paymentProof).match(/^data:(.*?);base64,(.*)$/);
  if (!matches) {
    return '';
  }

  var mimeType = matches[1];
  var base64Data = matches[2];
  var decoded = Utilities.base64Decode(base64Data);

  var extension = getFileExtension(mimeType, p.paymentProofName);
  var safeName = (p.fullName || 'peserta').toString().trim();
  var fileName = ticketId + "_" + safeName + extension;

  var blob = Utilities.newBlob(decoded, mimeType, fileName);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

function getFileExtension(mimeType, originalFileName) {
  if (originalFileName && originalFileName.indexOf('.') !== -1) {
    return originalFileName.substring(originalFileName.lastIndexOf('.'));
  }

  if (mimeType === 'image/png') {
    return '.png';
  }

  return '.jpg';
}
