# Hướng Dẫn Tích Hợp Google Sheets (Google Sheets Integration Guide)

Hướng dẫn này sẽ giúp bạn kết nối form gửi lời chúc với Google Sheets để lưu trữ tất cả lời chúc từ khách mời.

This guide will help you connect the wish form to Google Sheets to store all guest wishes.

---

## 📋 Tổng Quan (Overview)

Sau khi hoàn thành thiết lập:
- Khách mời điền form → Dữ liệu tự động lưu vào Google Sheets
- Bạn có thể xem tất cả lời chúc trong 1 bảng tính duy nhất
- Dữ liệu backup tự động vào localStorage để đảm bảo không mất dữ liệu

After setup completion:
- Guests fill form → Data automatically saved to Google Sheets
- You can view all wishes in a single spreadsheet
- Data automatically backed up to localStorage to prevent data loss

---

## 🚀 Bước 1: Tạo Google Sheet (Step 1: Create Google Sheet)

### 1.1. Tạo Sheet Mới
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo spreadsheet mới
3. Đặt tên: **"Wedding Wishes"** (hoặc tên bạn muốn)

### 1.2. Thêm Tiêu Đề Cột (Add Column Headers)
Trong hàng đầu tiên, nhập 3 cột:

| A | B | C |
|---|---|---|
| **Timestamp** | **Name** | **Message** |

**Quan trọng:** Tên cột phải chính xác như trên!

---

## 🔧 Bước 2: Triển Khai Apps Script (Step 2: Deploy Apps Script)

### 2.1. Mở Apps Script Editor
1. Trong Google Sheet của bạn, click **Extensions** → **Apps Script**
2. Một tab mới sẽ mở với code editor

### 2.2. Dán Code
1. **Xóa toàn bộ** code mặc định trong editor
2. Mở file `google-apps-script.js` trong project của bạn
3. **Copy toàn bộ** nội dung file
4. **Paste** vào Apps Script editor
5. Click **Save** (biểu tượng đĩa mềm) hoặc `Ctrl+S`

### 2.3. Đặt Tên Project
1. Click **"Untitled project"** ở góc trên bên trái
2. Đổi tên thành: **"Wedding Wishes API"**
3. Click **Rename**

---

## 🌐 Bước 3: Deploy Web App (Step 3: Deploy Web App)

### 3.1. Tạo Deployment Mới
1. Click nút **Deploy** (góc trên bên phải)
2. Chọn **New deployment**

### 3.2. Cấu Hình Deployment

#### Chọn Type:
- Click ⚙️ icon bên cạnh "Select type"
- Chọn **Web app**

#### Cấu Hình:
- **Description:** `Wedding wishes form integration`
- **Execute as:** `Me (your-email@gmail.com)`
- **Who has access:** `Anyone`

**⚠️ Quan trọng:** Phải chọn "Anyone" để website có thể gửi dữ liệu!

### 3.3. Authorize và Deploy
1. Click **Deploy**
2. Nếu hiện thông báo yêu cầu quyền:
   - Click **Authorize access**
   - Chọn tài khoản Google của bạn
   - Click **Advanced** (nếu có cảnh báo)
   - Click **Go to Wedding Wishes API (unsafe)**
   - Click **Allow**

### 3.4. Copy Web App URL
Sau khi deploy thành công:
1. Một popup sẽ hiện với **Web app URL**
2. URL sẽ có dạng: `https://script.google.com/macros/s/AKfycbz.../exec`
3. Click **Copy** để copy URL này
4. **LƯU URL NÀY** - bạn sẽ cần nó ở bước tiếp theo!

---

## 💻 Bước 4: Cập Nhật Website Code (Step 4: Update Website Code)

### 4.1. Mở File script.js
1. Mở file `/script.js` trong project
2. Tìm dòng này (gần đầu file):
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

### 4.2. Thay Thế URL
1. Paste **Web App URL** bạn đã copy ở Bước 3.4
2. Kết quả sẽ như này:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

### 4.3. Lưu File
- Lưu file `script.js`
- Deploy website của bạn lên hosting

---

## ✅ Bước 5: Kiểm Tra (Step 5: Test)

### 5.1. Test Form Submission
1. Mở website của bạn
2. Click button **"Gửi Lời Chúc Mừng"**
3. Điền form với thông tin test:
   - **Tên:** Test User
   - **Lời chúc:** This is a test message
4. Click **"Gửi Lời Chúc"**

### 5.2. Kiểm Tra Google Sheets
1. Quay lại Google Sheet của bạn
2. Bạn sẽ thấy dữ liệu test xuất hiện trong hàng mới:

| Timestamp | Name | Message |
|-----------|------|---------|
| 2025-01-15T10:30:00.000Z | Test User | This is a test message |

### 5.3. Kiểm Tra Browser Console (Optional)
1. Mở Developer Tools (F12)
2. Chuyển đến tab **Console**
3. Bạn sẽ thấy message: `"Wish sent to Google Sheets successfully"`

---

## 🔒 Bảo Mật & Lưu Ý (Security & Notes)

### ✅ Được Phép (Allowed)
- ✅ Web App URL sẽ public trong code JavaScript (điều này là bình thường)
- ✅ Bất kỳ ai cũng có thể gửi dữ liệu vào Google Sheet
- ✅ Data validation được xử lý trong Apps Script

### ⚠️ Hạn Chế (Limitations)
- ⚠️ Không có authentication - bất kỳ ai biết URL đều có thể gửi data
- ⚠️ Có thể bị spam nếu URL bị lộ
- ⚠️ Google Apps Script có giới hạn: 20,000 requests/day

### 🛡️ Bảo Vệ Chống Spam (Spam Protection)
Apps Script code đã bao gồm:
- Input validation (kiểm tra dữ liệu)
- Character limits (giới hạn ký tự)
- Error handling (xử lý lỗi)

### 💾 Backup Tự Động (Automatic Backup)
- Tất cả wishes cũng được lưu vào `localStorage` của browser
- Nếu Google Sheets fail, data vẫn được lưu local
- Có thể export từ localStorage nếu cần

---

## 🔄 Cập Nhật Sau Deploy (Post-Deployment Updates)

### Nếu Cần Deploy Lại Apps Script:

#### Option 1: Update Existing Deployment
1. Sửa code trong Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click ✏️ icon bên deployment hiện tại
4. Change **Version** → **New version**
5. Click **Deploy**
6. **URL giữ nguyên** - không cần update website!

#### Option 2: New Deployment (Không Khuyến Khích)
- URL sẽ thay đổi
- Phải update lại `GOOGLE_SCRIPT_URL` trong website
- Phải deploy lại website

---

## 📊 Xem Dữ Liệu (Viewing Data)

### Trong Google Sheets:
- Mở sheet để xem real-time data
- Sort, filter, analyze như Excel
- Export sang Excel/PDF nếu cần

### Trong Browser Console:
1. Mở website → F12 → Console
2. Nhập:
```javascript
JSON.parse(localStorage.getItem('weddingWishes'))
```
3. Sẽ hiển thị tất cả wishes đã lưu local

---

## 🆘 Troubleshooting

### ❌ Form không gửi được
**Kiểm tra:**
1. GOOGLE_SCRIPT_URL đã cập nhật chưa?
2. URL có đúng format không? (phải có `/exec` ở cuối)
3. Deploy đã chọn "Anyone" chưa?
4. Mở F12 Console xem có error gì không

### ❌ Data không xuất hiện trong Sheet
**Kiểm tra:**
1. Sheet name có phải "Sheet1" không? (hoặc update SHEET_NAME trong code)
2. Các cột header có đúng: Timestamp, Name, Message không?
3. Trong Apps Script editor, click **Executions** xem có error không

### ❌ Authorization Error
**Giải pháp:**
1. Trong Apps Script, click **Deploy** → **Manage deployments**
2. Click **⋮** menu → **Remove deployment**
3. Tạo deployment mới theo Bước 3

### ⚠️ Cors / Network Error
**Đây là bình thường!**
- Website dùng `mode: 'no-cors'` nên không đọc được response
- Nếu không có error, data vẫn được gửi thành công
- Kiểm tra Google Sheet để confirm

---

## 🧪 Test Commands (Advanced)

### Test trong Apps Script Editor:
1. Chọn function `doPost` từ dropdown
2. Click **Run**
3. Xem **Execution log** ở dưới

### Manual Test API:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","message":"Hello","timestamp":"2025-01-15T10:00:00.000Z"}' \
  YOUR_WEB_APP_URL
```

---

## 📝 Optional Functions

Apps Script code bao gồm các function bổ sung:

### getAllWishes()
- Lấy tất cả wishes dưới dạng JSON
- Chạy manual trong Apps Script editor

### clearAllWishes()
- Xóa toàn bộ data (giữ header)
- **CẢNH BÁO:** Không thể undo!
- Chạy manual trong Apps Script editor

---

## 🎉 Hoàn Tất! (Complete!)

Bạn đã tích hợp thành công Google Sheets với form gửi lời chúc!

Giờ đây:
- ✅ Khách mời có thể gửi lời chúc
- ✅ Dữ liệu tự động lưu vào Google Sheets
- ✅ Bạn có thể xem và quản lý tất cả lời chúc ở một nơi
- ✅ Data được backup trong localStorage

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra section **Troubleshooting** ở trên
2. Xem **Console log** (F12) để debug
3. Kiểm tra **Apps Script Executions** để xem errors
4. Đảm bảo deployment settings đúng: "Anyone" access

---

**Chúc mừng! Your wedding wish form is now connected to Google Sheets! 🎊**
