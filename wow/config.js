/* =========================================================
   THIỆP 20/11 – BẢN "THƯ GỬI DƯỚI TRỜI SAO"
   - {to}   tên đầy đủ người nhận
   - {nick} tên gọi trong lời chúc
   - {from} tên người gửi
   - Mỗi đoạn trong message cách nhau 1 dòng trống
   ========================================================= */
window.CARD_CONFIG = {
  receiver: "Hoàng Hải Anh",
  nickname: "Hải Anh",
  sender: "HiDongne",

  // Ảnh polaroid trong thư (để "" nếu không muốn hiện ảnh)
  avatar: "../assets/avatar.jpg",
  photoCaption: "Cô {nick} 💐",

  // Màn mở đầu
  skyText: "20.11",                       // chữ do các hạt sáng ghép thành
  skySub: "Ngày Nhà giáo Việt Nam",
  hint: "Chạm vào con dấu để mở thư",
  envelopeNote: "Gửi cô {nick}",          // chữ nhỏ trên lá thư trong phong bì

  // Lá thư
  date: "20 · 11 · 2026",
  greeting: "Kính gửi cô giáo,",
  name: "{to}",
  message: `Nhân ngày Nhà giáo Việt Nam 20/11, xin gửi đến cô những lời chúc tốt đẹp và chân thành nhất.

Cảm ơn cô vì đã chọn một nghề thật đẹp — nghề gieo chữ, gieo ước mơ và thắp sáng những tâm hồn non trẻ. Mỗi bài giảng của cô không chỉ là kiến thức, mà còn là sự kiên nhẫn, là tình thương và cả những buổi tối miệt mài bên trang giáo án.

Chúc cô luôn dồi dào sức khỏe, giữ mãi ngọn lửa nhiệt huyết với nghề. Mong mỗi ngày đến lớp đều là một ngày vui, học trò ngoan ngoãn, chăm chỉ và luôn biết ơn những điều cô đã dành cho các em.

Chúc cô luôn xinh đẹp, hạnh phúc, bình an, và giữ mãi nụ cười rạng rỡ ấy trên mọi chặng đường — cả trên bục giảng lẫn những cung đường chạy bộ mỗi sáng.

Chúc mừng ngày Nhà giáo Việt Nam!`,
  closing: "Thân gửi,",
  signature: "{from}",
  finale: "Happy Teacher's Day",

  // Tốc độ hiện chữ (ms cho mỗi từ, nhỏ hơn = nhanh hơn)
  wordSpeed: 110
};
