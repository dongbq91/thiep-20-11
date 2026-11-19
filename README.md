# 💐 Thiệp 20.11 – Ngày Nhà giáo Việt Nam

Thiệp điện tử tri ân thầy cô nhân ngày 20/11, tối ưu cho điện thoại.

- Trang chính: bản **bảng đen & trang vở ô ly** (thư mục gốc)
- `/ban-cu/`: bản bìa kem – quyển sách (mẫu đầu tiên)
- `/wow/`: chuyển hướng về trang chính

Viết thuần HTML / CSS / JS, deploy tự động lên GitHub Pages.

## Tính năng
- Bìa màu kem – vàng, quyển sách mở với bút lông và hoa, cành đào ở góc khung
- Bấm **Mở thiệp** → bìa lật mở 3D, hoa bung ra
- Lời chúc dài hiện **từng chữ một**, tự cuộn theo; chạm để hiện nhanh
- Cánh hoa rơi nhẹ, lấp lánh quanh viền
- Nút ↺ nhỏ ở góc để xem lại

## Cấu trúc
```
index.html   – khung trang + hình SVG (hoa, sách, bút)
style.css    – giao diện & hiệu ứng
script.js    – mở thiệp, chạy chữ, cánh hoa
config.js    – ✏️ NỘI DUNG THIỆP (sửa ở đây)
assets/      – ảnh
```

## Tùy chỉnh
Sửa `config.js`: tên người nhận/gửi, chữ trên bìa, lời chúc, tốc độ chạy chữ, số cánh hoa, nhạc nền.

## Deploy
Mỗi lần push lên `main`, GitHub Actions (`.github/workflows/deploy.yml`) tự deploy lên GitHub Pages
và gắn mã phiên bản vào link CSS/JS/ảnh để điện thoại luôn tải bản mới (tự xóa cache).
