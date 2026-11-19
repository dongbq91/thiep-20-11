/* =========================================================
   TÙY CHỈNH NỘI DUNG THIỆP 20/11 Ở ĐÂY
   - {to}   tên đầy đủ người nhận
   - {nick} tên gọi trong lời chúc
   - {from} tên người gửi
   - Xuống dòng trong message: chỉ cần Enter (dùng dấu ` ` bao quanh)
   ========================================================= */
window.CARD_CONFIG = {
  receiver: "Hoàng Hải Anh",
  nickname: "Hải Anh",
  sender: "HiDongne",

  // Ảnh đại diện trong thiệp (để "" nếu không muốn hiện ảnh)
  avatar: "../assets/avatar.jpg",

  // Mặt ngoài thiệp
  coverTop: "Happy Teacher's Day",
  coverBig: "20.11",
  coverSub: "Kính tặng cô giáo {to} 💐",
  openButton: "Mở thiệp 💌",

  // Nội dung bên trong (hiện từng chữ)
  title: "Gửi cô giáo\n{nick} 💐",
  message: `Nhân ngày Nhà giáo Việt Nam 20/11, xin gửi đến cô những lời chúc tốt đẹp và chân thành nhất.

Cảm ơn cô vì đã chọn một nghề thật đẹp — nghề gieo chữ, gieo ước mơ và thắp sáng những tâm hồn non trẻ. Mỗi bài giảng của cô không chỉ là kiến thức, mà còn là sự kiên nhẫn, là tình thương và cả những buổi tối miệt mài bên trang giáo án.

Chúc cô luôn dồi dào sức khỏe, giữ mãi ngọn lửa nhiệt huyết với nghề. Mong mỗi ngày đến lớp đều là một ngày vui, học trò ngoan ngoãn, chăm chỉ và luôn biết ơn những điều cô đã dành cho các em.

Chúc cô luôn xinh đẹp, hạnh phúc, bình an, và giữ mãi nụ cười rạng rỡ ấy trên mọi chặng đường — cả trên bục giảng lẫn những cung đường chạy bộ mỗi sáng.

Chúc mừng ngày Nhà giáo Việt Nam! 💐`,
  signature: "— {from} —",

  // Hiệu ứng
  typingSpeed: 40,   // ms cho mỗi ký tự (nhỏ hơn = nhanh hơn)
  petalCount: 14,    // số cánh hoa bay trên màn hình

  // Nhạc nền (tùy chọn): đặt file vào thư mục assets rồi ghi "assets/ten-file.mp3"
  music: ""
};
