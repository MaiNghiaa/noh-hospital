// backend/scripts/seedAll.js
// Chạy: node backend/scripts/seedAll.js
// Seed ~100 bản ghi cho toàn bộ hệ thống (departments, doctors, schedules, news, users, patients, appointments, medical_records, medicines, prescriptions)

const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const envBackend = path.join(__dirname, '..', '.env');
const envRoot = path.join(__dirname, '..', '..', '.env');
require('dotenv').config({ path: fs.existsSync(envBackend) ? envBackend : envRoot });

// ═══════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function formatDateTime(d) {
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  const prefixes = ['032', '033', '034', '035', '036', '037', '038', '039', '056', '058', '059', '070', '076', '077', '078', '079', '081', '082', '083', '084', '085', '086', '088', '089', '090', '091', '092', '093', '094', '096', '097', '098', '099'];
  return randomItem(prefixes) + Math.floor(1000000 + Math.random() * 9000000).toString();
}

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const departments = [
  { name: 'Khoa Họng - Thanh quản', type: 'lam-sang', description: 'Khám chữa bệnh, điều trị bằng phương pháp nội khoa và ngoại khoa các bệnh lý vùng họng – thanh quản. Phẫu thuật nội soi họng thanh quản, cắt amidan, nạo VA.', phone: '024.3825.3351' },
  { name: 'Khoa Tai', type: 'lam-sang', description: 'Khám, chữa bệnh chuyên sâu về tai, tai thần kinh, nền sọ ở tuyến cao nhất. Vi phẫu thuật tai, phẫu thuật cấy ốc tai điện tử.', phone: '024.3825.3352' },
  { name: 'Khoa Khám bệnh', type: 'lam-sang', description: 'Khám, chẩn đoán bệnh và tư vấn điều trị cho người bệnh. Tiếp nhận bệnh nhân ngoại trú và chuyển tuyến.', phone: '024.3825.3353' },
  { name: 'Khoa Gây mê hồi sức', type: 'lam-sang', description: 'Gây mê hồi sức cho các phẫu thuật cấp cứu chuyên khoa TMH. Hồi sức sau mổ và chăm sóc tích cực.', phone: '024.3825.3354' },
  { name: 'Khoa Cấp cứu', type: 'lam-sang', description: 'Điều trị người bệnh nặng, nguy hiểm chức năng sống về TMH. Tiếp nhận và xử trí cấp cứu 24/7.', phone: '024.3825.3355' },
  { name: 'Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ', type: 'lam-sang', description: 'Điều trị bệnh lý TMH và chuyên sâu khối u đầu cổ. Phẫu thuật, xạ trị, hóa trị ung thư vùng đầu cổ.', phone: '024.3825.3356' },
  { name: 'Khoa Tai Mũi Họng Trẻ em', type: 'lam-sang', description: 'Khám và điều trị tất cả các bệnh lý chuyên khoa TMH trẻ em. Phẫu thuật nội soi cho trẻ nhỏ.', phone: '024.3825.3357' },
  { name: 'Khoa Tai thần kinh', type: 'lam-sang', description: 'Khám chữa bệnh chủ yếu về tai, tai-thần kinh. Chẩn đoán và điều trị rối loạn tiền đình, ù tai.', phone: '024.3825.3358' },
  { name: 'Khoa Mũi Xoang', type: 'lam-sang', description: 'Khám chẩn đoán, tư vấn và điều trị các bệnh lý về mũi xoang. Phẫu thuật nội soi mũi xoang.', phone: '024.3825.3359' },
  { name: 'Khoa Thính - Thanh học', type: 'lam-sang', description: 'Khám, chữa bệnh tai mũi họng và tiền đình. Đo thính lực, đánh giá chức năng nghe.', phone: '024.3825.3360' },
  { name: 'Khoa Phẫu thuật Tạo hình Thẩm Mỹ', type: 'lam-sang', description: 'Khám và điều trị các trường hợp cần tạo hình, phẫu thuật thẩm mỹ vùng đầu mặt cổ.', phone: '024.3825.3361' },
  { name: 'Khoa Nội soi', type: 'lam-sang', description: 'Khám, chẩn đoán, điều trị bệnh về TMH bằng nội soi. Nội soi tai mũi họng, thanh quản.', phone: '024.3825.3362' },
  { name: 'Khoa Xét nghiệm Tổng hợp', type: 'can-lam-sang', description: 'Xét nghiệm về bệnh học, tế bào học. Xét nghiệm huyết học, sinh hoá, vi sinh.', phone: '024.3825.3363' },
  { name: 'Khoa Kiểm soát nhiễm khuẩn', type: 'can-lam-sang', description: 'Giám sát công tác kiểm soát nhiễm khuẩn trong toàn bệnh viện.', phone: '024.3825.3364' },
  { name: 'Khoa Chẩn đoán hình ảnh', type: 'can-lam-sang', description: 'Thực hiện kỹ thuật chẩn đoán hình ảnh cho chuyên khoa. CT-Scanner, MRI, X-quang.', phone: '024.3825.3365' },
  { name: 'Khoa Dược', type: 'can-lam-sang', description: 'Tổ chức, triển khai hoạt động của Hội đồng thuốc và điều trị. Quản lý và cấp phát thuốc.', phone: '024.3825.3366' },
  { name: 'Khoa Dinh dưỡng', type: 'can-lam-sang', description: 'Tư vấn và điều trị bằng chế độ dinh dưỡng cho người bệnh nội trú và ngoại trú.', phone: '024.3825.3367' },
];

const doctors = [
  { name: 'PGS.TS. Phạm Tuấn Cảnh', title: 'Phó Giáo sư - Tiến sĩ', specialty: 'Phẫu thuật tạo hình TMH', dept: 10, exp: '30+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'TTƯT.TS. Lê Anh Tuấn', title: 'Tiến sĩ - Bác sĩ Cao cấp', specialty: 'Tai Mũi Họng Trẻ em', dept: 6, exp: '25+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'PGS.TS. Nguyễn Quang Trung', title: 'Phó Giáo sư - Tiến sĩ', specialty: 'Ung bướu Đầu Cổ', dept: 5, exp: '20+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'BSCKII. Hà Minh Lợi', title: 'Bác sĩ Chuyên khoa II', specialty: 'Mũi Xoang', dept: 8, exp: '18+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'TS.BS. Đào Đình Thi', title: 'Tiến sĩ - Bác sĩ', specialty: 'Nội soi TMH', dept: 11, exp: '15+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'TTND, PGS.TS. Quách Thị Cần', title: 'Phó Giáo sư - Tiến sĩ', specialty: 'Cấp cứu TMH', dept: 4, exp: '28+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'TS.BS. Trần Văn Hùng', title: 'Tiến sĩ - Bác sĩ', specialty: 'Họng - Thanh quản', dept: 0, exp: '16+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'BSCKII. Nguyễn Thị Hương', title: 'Bác sĩ Chuyên khoa II', specialty: 'Tai thần kinh', dept: 7, exp: '20+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'ThS.BS. Lê Minh Đức', title: 'Thạc sĩ - Bác sĩ', specialty: 'Khám bệnh TMH', dept: 2, exp: '10+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'PGS.TS. Vũ Trung Kiên', title: 'Phó Giáo sư - Tiến sĩ', specialty: 'Gây mê hồi sức', dept: 3, exp: '22+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'TS.BS. Hoàng Anh Tuấn', title: 'Tiến sĩ - Bác sĩ', specialty: 'Tai - Phẫu thuật tai', dept: 1, exp: '14+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'BSCKII. Phạm Thị Lan', title: 'Bác sĩ Chuyên khoa II', specialty: 'Thính - Thanh học', dept: 9, exp: '19+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'ThS.BS. Đỗ Văn Nam', title: 'Thạc sĩ - Bác sĩ', specialty: 'Nội soi mũi xoang', dept: 8, exp: '8+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'TS.BS. Nguyễn Văn Bình', title: 'Tiến sĩ - Bác sĩ', specialty: 'Ung thư thanh quản', dept: 5, exp: '17+ năm', edu: 'Đại học Y TP.HCM' },
  { name: 'BSCKI. Trần Thị Mai', title: 'Bác sĩ Chuyên khoa I', specialty: 'TMH Trẻ em', dept: 6, exp: '12+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'ThS.BS. Lý Hoàng Long', title: 'Thạc sĩ - Bác sĩ', specialty: 'Phẫu thuật tạo hình mũi', dept: 10, exp: '9+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'BSCKII. Vũ Đức Cường', title: 'Bác sĩ Chuyên khoa II', specialty: 'Họng - Thanh quản', dept: 0, exp: '21+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'TS.BS. Phan Thanh Hải', title: 'Tiến sĩ - Bác sĩ', specialty: 'Chẩn đoán hình ảnh TMH', dept: 14, exp: '13+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'ThS.BS. Nguyễn Hoàng Sơn', title: 'Thạc sĩ - Bác sĩ', specialty: 'Cấp cứu TMH', dept: 4, exp: '11+ năm', edu: 'Đại học Y Hà Nội' },
  { name: 'BSCKI. Đặng Thị Ngọc', title: 'Bác sĩ Chuyên khoa I', specialty: 'Xét nghiệm TMH', dept: 12, exp: '10+ năm', edu: 'Đại học Y Hà Nội' },
];

const newsData = [
  { title: 'Hàng trăm bác sĩ ra quân, khám và sàng lọc miễn phí cho hơn 10.000 người', category: 'su-kien', excerpt: 'Hàng nghìn người đổ về phố đi bộ Trần Nhân Tông từ sáng sớm 5/4 để được khám sàng lọc miễn phí các bệnh lý Tai Mũi Họng.' },
  { title: 'Người dân háo hức tham gia khám sức khỏe miễn phí', category: 'su-kien', excerpt: 'Chương trình khám sức khỏe miễn phí tại phố đi bộ thu hút đông đảo người dân Thủ đô.' },
  { title: 'BV TMH TW khám, tư vấn miễn phí tại Ngày hội Vì một Việt Nam khỏe mạnh', category: 'su-kien', excerpt: 'Hưởng ứng Ngày Sức khỏe toàn dân 7/4, BV TMH TW tổ chức khám miễn phí cho người dân.' },
  { title: 'Viêm tai giữa mãn tính: Cảnh báo biến chứng nguy hiểm', category: 'nghien-cuu', excerpt: 'Viêm tai giữa mãn tính chiếm khoảng 2-4% dân số, nếu không điều trị kịp thời có thể gây biến chứng nặng.' },
  { title: 'Những hiểu lầm người Việt thường mắc phải về bệnh viêm xoang', category: 'hoi-dap', excerpt: 'Viêm xoang chiếm khoảng 15% dân số. Nhiều người vẫn hiểu sai về nguyên nhân và cách điều trị.' },
  { title: 'Ứng dụng AI trong chẩn đoán ung thư vòm họng giai đoạn sớm', category: 'nghien-cuu', excerpt: 'Nghiên cứu mới cho thấy AI có thể hỗ trợ phát hiện sớm ung thư vòm họng với độ chính xác cao.' },
  { title: 'Phẫu thuật nội soi mũi xoang: Kỹ thuật mới ít xâm lấn', category: 'nghien-cuu', excerpt: 'Kỹ thuật FESS cải tiến giúp giảm đau, rút ngắn thời gian hồi phục sau phẫu thuật mũi xoang.' },
  { title: 'Hội thảo quốc tế về điều trị nghe kém ở trẻ em', category: 'su-kien', excerpt: 'BV TMH TW đồng tổ chức hội thảo quốc tế về cấy ốc tai điện tử và phục hồi chức năng nghe cho trẻ em.' },
  { title: 'Cách phòng tránh viêm mũi dị ứng khi giao mùa', category: 'hoi-dap', excerpt: 'Thời tiết giao mùa khiến nhiều người bị viêm mũi dị ứng. Bác sĩ tư vấn cách phòng tránh hiệu quả.' },
  { title: 'Thông báo lịch nghỉ lễ 30/4 - 1/5 và lịch trực cấp cứu', category: 'thong-bao', excerpt: 'BV TMH TW thông báo lịch làm việc và trực cấp cứu trong dịp lễ 30/4 - 1/5.' },
  { title: 'Ký kết hợp tác với Bệnh viện Seoul National University', category: 'hop-tac', excerpt: 'BV TMH TW ký kết MOU với Bệnh viện Đại học Quốc gia Seoul trong lĩnh vực cấy ốc tai điện tử.' },
  { title: 'Cắt amidan có đau không? Giải đáp từ chuyên gia', category: 'hoi-dap', excerpt: 'Nhiều phụ huynh lo lắng khi con cần cắt amidan. Chuyên gia giải đáp thắc mắc thường gặp.' },
  { title: 'Triển khai phẫu thuật Robot trong điều trị ung thư đầu cổ', category: 'nghien-cuu', excerpt: 'BV TMH TW là đơn vị đầu tiên triển khai phẫu thuật Robot TORS trong điều trị ung thư đầu cổ.' },
  { title: 'Hợp tác đào tạo với Đại học Y Tokyo', category: 'hop-tac', excerpt: 'Chương trình trao đổi bác sĩ nội trú giữa BV TMH TW và Đại học Y Tokyo chính thức khởi động.' },
  { title: 'Thông báo điều chỉnh giá dịch vụ khám bệnh từ 01/07/2026', category: 'thong-bao', excerpt: 'Theo quy định mới, giá dịch vụ khám bệnh sẽ được điều chỉnh từ ngày 01/07/2026.' },
  { title: 'Nguy cơ mất thính lực do sử dụng tai nghe quá nhiều', category: 'hoi-dap', excerpt: 'Xu hướng sử dụng tai nghe liên tục đang gây ra tình trạng giảm thính lực ở giới trẻ.' },
  { title: 'BV TMH TW đạt chứng nhận chất lượng ISO 9001:2015', category: 'su-kien', excerpt: 'Bệnh viện vừa đạt chứng nhận hệ thống quản lý chất lượng ISO 9001:2015 trong lĩnh vực y tế.' },
  { title: 'Nghiên cứu mới về điều trị ù tai bằng liệu pháp âm thanh', category: 'nghien-cuu', excerpt: 'Kết quả bước đầu cho thấy liệu pháp âm thanh (TRT) giúp giảm triệu chứng ù tai hiệu quả.' },
  { title: 'Hướng dẫn chăm sóc sau phẫu thuật nội soi mũi xoang', category: 'hoi-dap', excerpt: 'Chăm sóc đúng cách sau phẫu thuật giúp vết thương mau lành và giảm nguy cơ tái phát.' },
  { title: 'Khánh thành khu phẫu thuật mới với trang thiết bị hiện đại', category: 'su-kien', excerpt: 'Khu phẫu thuật mới được trang bị hệ thống phòng mổ tiêu chuẩn quốc tế, đáp ứng nhu cầu phẫu thuật ngày càng tăng.' },
];

const medicines = [
  { name: 'Amoxicillin 500mg', ingredient: 'Amoxicillin', unit: 'viên', category: 'Kháng sinh' },
  { name: 'Paracetamol 500mg', ingredient: 'Paracetamol', unit: 'viên', category: 'Giảm đau hạ sốt' },
  { name: 'Ibuprofen 400mg', ingredient: 'Ibuprofen', unit: 'viên', category: 'Kháng viêm' },
  { name: 'Cetirizine 10mg', ingredient: 'Cetirizine', unit: 'viên', category: 'Kháng dị ứng' },
  { name: 'Omeprazole 20mg', ingredient: 'Omeprazole', unit: 'viên', category: 'Dạ dày' },
  { name: 'Dexamethasone 0.5mg', ingredient: 'Dexamethasone', unit: 'viên', category: 'Corticoid' },
  { name: 'Ofloxacin nhỏ tai 0.3%', ingredient: 'Ofloxacin', unit: 'lọ', category: 'Nhỏ tai' },
  { name: 'Naphazoline nhỏ mũi', ingredient: 'Naphazoline', unit: 'lọ', category: 'Nhỏ mũi' },
  { name: 'Clarithromycin 500mg', ingredient: 'Clarithromycin', unit: 'viên', category: 'Kháng sinh' },
  { name: 'Prednisolone 5mg', ingredient: 'Prednisolone', unit: 'viên', category: 'Corticoid' },
  { name: 'Xylometazoline 0.1%', ingredient: 'Xylometazoline', unit: 'lọ', category: 'Nhỏ mũi' },
  { name: 'Loratadine 10mg', ingredient: 'Loratadine', unit: 'viên', category: 'Kháng dị ứng' },
  { name: 'Fluticasone xịt mũi', ingredient: 'Fluticasone', unit: 'lọ', category: 'Corticoid xịt' },
  { name: 'Ciprofloxacin nhỏ mắt 0.3%', ingredient: 'Ciprofloxacin', unit: 'lọ', category: 'Nhỏ mắt' },
  { name: 'Vitamin C 500mg', ingredient: 'Ascorbic acid', unit: 'viên', category: 'Vitamin' },
  { name: 'Cefuroxime 500mg', ingredient: 'Cefuroxime', unit: 'viên', category: 'Kháng sinh' },
  { name: 'Methylprednisolone 16mg', ingredient: 'Methylprednisolone', unit: 'viên', category: 'Corticoid' },
  { name: 'Montelukast 10mg', ingredient: 'Montelukast', unit: 'viên', category: 'Kháng dị ứng' },
  { name: 'Betahistine 24mg', ingredient: 'Betahistine', unit: 'viên', category: 'Tiền đình' },
  { name: 'Budesonide xịt mũi', ingredient: 'Budesonide', unit: 'lọ', category: 'Corticoid xịt' },
];

const patientNames = [
  'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
  'Vũ Thị Phương', 'Đỗ Minh Quang', 'Bùi Thị Hoa', 'Ngô Đức Hùng', 'Dương Thị Kim',
  'Lý Văn Long', 'Trịnh Thị Mai', 'Đinh Văn Nam', 'Cao Thị Oanh', 'Tạ Văn Phong',
  'Hồ Thị Quỳnh', 'Lương Văn Rạng', 'Phan Thị Sương', 'Chu Văn Thắng', 'Mai Thị Uyên',
  'Nguyễn Đức Việt', 'Trần Thị Xuân', 'Lê Văn Yên', 'Phạm Thị Ánh', 'Hoàng Minh Bảo',
];

const symptoms = [
  'Đau họng kéo dài, khó nuốt, sốt nhẹ',
  'Ù tai trái, chóng mặt khi thay đổi tư thế',
  'Nghẹt mũi mạn tính, chảy dịch mũi sau',
  'Khàn tiếng 2 tuần, không cải thiện',
  'Đau tai phải, chảy mủ tai',
  'Nghe kém dần 2 bên tai',
  'Chảy máu mũi tái phát',
  'Ho kéo dài, đau rát cổ họng',
  'Ngủ ngáy to, ngưng thở khi ngủ',
  'Sưng hạch cổ bên phải',
  'Viêm xoang tái phát nhiều đợt',
  'Chóng mặt xoay tròn đột ngột',
];

const diagnoses = [
  'Viêm amidan mãn tính',
  'Rối loạn tiền đình ngoại biên',
  'Viêm xoang mạn tính có polyp',
  'Viêm thanh quản cấp',
  'Viêm tai giữa mủ',
  'Nghe kém tiếp nhận 2 bên',
  'Chảy máu mũi do lệch vách ngăn',
  'Viêm họng hạt mãn tính',
  'Hội chứng ngưng thở tắc nghẽn khi ngủ (OSA)',
  'U lympho vùng cổ (cần sinh thiết)',
  'Viêm đa xoang do dị ứng',
  'Bệnh Meniere tai trái',
];

const treatments = [
  'Kháng sinh + kháng viêm 7 ngày, tái khám',
  'Thuốc tiền đình + tập vật lý trị liệu',
  'Phẫu thuật nội soi mũi xoang (FESS)',
  'Nghỉ ngơi giọng, uống thuốc kháng viêm',
  'Rửa tai, nhỏ kháng sinh tai, tái khám sau 2 tuần',
  'Đo thính lực, tư vấn máy trợ thính',
  'Đốt điện cầm máu + nắn vách ngăn',
  'Thuốc xịt họng + kháng histamine',
  'Chỉ định phẫu thuật cắt amidan, nạo VA',
  'Sinh thiết hạch, chuyển ung bướu đánh giá',
  'Xịt corticoid mũi + rửa mũi hàng ngày',
  'Thuốc Betahistine + chế độ ăn giảm muối',
];

// ═══════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'noh_hospital',
    multipleStatements: true,
  });

  try {
    console.log('🚀 Bắt đầu seed dữ liệu...\n');

    // ─── CLEAR OLD DATA ───
    console.log('🗑️  Xóa dữ liệu cũ...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    const tables = ['prescriptions', 'medical_records', 'appointments', 'patients', 'refresh_tokens', 'users', 'doctor_schedules', 'doctors', 'departments', 'news', 'medicines', 'documents', 'videos', 'contact_messages'];
    for (const table of tables) {
      await connection.execute(`TRUNCATE TABLE ${table}`);
    }
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    // ─── 1. DEPARTMENTS (17) ───
    console.log('🏥 Seed departments...');
    for (let i = 0; i < departments.length; i++) {
      const d = departments[i];
      await connection.execute(
        `INSERT INTO departments (name, slug, type, description, phone, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [d.name, slugify(d.name), d.type, d.description, d.phone, i + 1]
      );
    }
    console.log(`   ✅ ${departments.length} departments`);

    // ─── 2. DOCTORS (20) ───
    console.log('👨‍⚕️ Seed doctors...');
    for (let i = 0; i < doctors.length; i++) {
      const d = doctors[i];
      const deptId = d.dept + 1; // dept index -> id (auto_increment starts at 1)
      await connection.execute(
        `INSERT INTO doctors (name, slug, title, specialty, department_id, experience, education, email, phone, is_active, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          d.name,
          slugify(d.name),
          d.title,
          d.specialty,
          deptId,
          d.exp,
          d.edu,
          `${slugify(d.name).replace(/-/g, '.')}@noh.vn`,
          randomPhone(),
          i + 1,
        ]
      );
    }
    console.log(`   ✅ ${doctors.length} doctors`);

    // ─── 3. DOCTOR SCHEDULES ───
    console.log('📅 Seed doctor schedules...');
    let scheduleCount = 0;
    for (let docId = 1; docId <= doctors.length; docId++) {
      // Each doctor works 3-5 days
      const daysCount = 3 + Math.floor(Math.random() * 3);
      const allDays = [1, 2, 3, 4, 5, 6];
      const selectedDays = allDays.sort(() => Math.random() - 0.5).slice(0, daysCount);
      for (const day of selectedDays) {
        const morning = Math.random() > 0.3;
        const afternoon = Math.random() > 0.4;
        if (morning) {
          await connection.execute(
            `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients, is_active) VALUES (?, ?, '07:30:00', '11:30:00', ?, 1)`,
            [docId, day, 15 + Math.floor(Math.random() * 10)]
          );
          scheduleCount++;
        }
        if (afternoon) {
          await connection.execute(
            `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients, is_active) VALUES (?, ?, '13:30:00', '17:00:00', ?, 1)`,
            [docId, day, 10 + Math.floor(Math.random() * 10)]
          );
          scheduleCount++;
        }
      }
    }
    console.log(`   ✅ ${scheduleCount} doctor schedules`);

    // ─── 4. NEWS (20) ───
    console.log('📰 Seed news...');
    for (let i = 0; i < newsData.length; i++) {
      const n = newsData[i];
      const pubDate = randomDate(new Date('2026-01-01'), new Date('2026-04-14'));
      const content = `<h2>${n.title}</h2><p>${n.excerpt}</p><p>Nội dung chi tiết của bài viết sẽ được cập nhật. Đây là dữ liệu mẫu để hiển thị giao diện website. Bệnh viện Tai Mũi Họng Trung ương luôn nỗ lực mang lại dịch vụ y tế chất lượng cao cho người bệnh.</p><p>Liên hệ: 024.3825.3353 để biết thêm chi tiết.</p>`;
      await connection.execute(
        `INSERT INTO news (title, slug, category, excerpt, content, author, view_count, is_featured, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [n.title, slugify(n.title) + '-' + (i + 1), n.category, n.excerpt, content, 'Ban Biên tập', Math.floor(Math.random() * 5000), i < 3 ? 1 : 0, formatDateTime(pubDate)]
      );
    }
    console.log(`   ✅ ${newsData.length} news articles`);

    // ─── 5. MEDICINES (20) ───
    console.log('💊 Seed medicines...');
    for (const med of medicines) {
      await connection.execute(
        `INSERT INTO medicines (name, active_ingredient, unit, category, is_active) VALUES (?, ?, ?, ?, 1)`,
        [med.name, med.ingredient, med.unit, med.category]
      );
    }
    console.log(`   ✅ ${medicines.length} medicines`);

    // ─── 6. USERS ───
    console.log('👤 Seed users...');
    const hashedAdmin = await bcrypt.hash('Admin@2026', 12);
    const hashedDoctor = await bcrypt.hash('Doctor@2026', 12);
    const hashedPatient = await bcrypt.hash('Patient@2026', 12);

    // Super Admin
    await connection.execute(
      `INSERT INTO users (email, password_hash, role, full_name, phone, is_active) VALUES (?, ?, 'super_admin', ?, ?, 1)`,
      ['admin@noh.vn', hashedAdmin, 'Quản trị viên hệ thống', '0243853427']
    );

    // Doctor users (link to doctor records)
    for (let i = 0; i < doctors.length; i++) {
      const d = doctors[i];
      const email = slugify(d.name).replace(/-/g, '.') + '@noh.vn';
      const phone = randomPhone();
      await connection.execute(
        `INSERT INTO users (email, password_hash, role, full_name, phone, doctor_id, is_active) VALUES (?, ?, 'doctor', ?, ?, ?, 1)`,
        [email, hashedDoctor, d.name, phone, i + 1]
      );
    }

    // Patient users (25)
    const patientUserIds = [];
    for (let i = 0; i < patientNames.length; i++) {
      const name = patientNames[i];
      const email = `patient${i + 1}@gmail.com`;
      const [result] = await connection.execute(
        `INSERT INTO users (email, password_hash, role, full_name, phone, is_active) VALUES (?, ?, 'patient', ?, ?, 1)`,
        [email, hashedPatient, name, randomPhone()]
      );
      patientUserIds.push(result.insertId);
    }
    const totalUsers = 1 + doctors.length + patientNames.length;
    console.log(`   ✅ ${totalUsers} users (1 admin + ${doctors.length} doctors + ${patientNames.length} patients)`);

    // ─── 7. PATIENTS (25) ───
    console.log('🏥 Seed patients...');
    const genders = ['male', 'female', 'other'];
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const addresses = [
      'Số 12 Ngõ 45 Lạc Long Quân, Tây Hồ, Hà Nội',
      '56 Trần Phú, Ba Đình, Hà Nội',
      'Số 8 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      '120 Giải Phóng, Hai Bà Trưng, Hà Nội',
      '34 Lê Văn Lương, Thanh Xuân, Hà Nội',
      '78 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
      '15 Phố Huế, Hai Bà Trưng, Hà Nội',
      '90 Nguyễn Xiển, Thanh Xuân, Hà Nội',
      '200 Kim Mã, Ba Đình, Hà Nội',
      'Số 5 Ngõ 10 Thái Hà, Đống Đa, Hà Nội',
    ];

    const patientIds = [];
    for (let i = 0; i < patientNames.length; i++) {
      const dob = randomDate(new Date('1960-01-01'), new Date('2010-12-31'));
      const gender = i % 2 === 0 ? 'male' : 'female';
      const [result] = await connection.execute(
        `INSERT INTO patients (user_id, date_of_birth, gender, address, insurance_number, blood_type, allergies) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          patientUserIds[i],
          formatDate(dob),
          gender,
          randomItem(addresses),
          `DN4${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
          randomItem(bloodTypes),
          Math.random() > 0.7 ? randomItem(['Penicillin', 'Aspirin', 'Sulfonamide', 'Không']) : null,
        ]
      );
      patientIds.push(result.insertId);
    }
    console.log(`   ✅ ${patientNames.length} patients`);

    // ─── 8. APPOINTMENTS (30) ───
    console.log('📋 Seed appointments...');
    const statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    const appointmentIds = [];
    const times = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'];

    for (let i = 0; i < 30; i++) {
      const patientIdx = i % patientNames.length;
      const deptIdx = Math.floor(Math.random() * 12); // only lam-sang departments
      const docId = Math.floor(Math.random() * doctors.length) + 1;
      const apptDate = randomDate(new Date('2026-03-01'), new Date('2026-05-30'));
      const status = i < 5 ? 'pending' : i < 12 ? 'confirmed' : i < 20 ? 'completed' : i < 25 ? 'in_progress' : 'cancelled';

      const [result] = await connection.execute(
        `INSERT INTO appointments (full_name, phone, email, department, doctor_id, appointment_date, appointment_time, reason, patient_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patientNames[patientIdx],
          randomPhone(),
          `patient${patientIdx + 1}@gmail.com`,
          departments[deptIdx].name,
          docId,
          formatDate(apptDate),
          randomItem(times) + ':00',
          randomItem(symptoms),
          patientIds[patientIdx],
          status,
        ]
      );
      appointmentIds.push(result.insertId);
    }
    console.log(`   ✅ 30 appointments`);

    // ─── 9. MEDICAL RECORDS (15, for completed appointments) ───
    console.log('📝 Seed medical records...');
    const completedAppts = appointmentIds.slice(12, 20); // completed ones
    const recordIds = [];

    for (let i = 0; i < completedAppts.length; i++) {
      const patientIdx = (12 + i) % patientNames.length;
      const docId = Math.floor(Math.random() * doctors.length) + 1;
      const diagIdx = i % diagnoses.length;
      const followUp = Math.random() > 0.4 ? formatDate(randomDate(new Date('2026-05-01'), new Date('2026-07-30'))) : null;

      const [result] = await connection.execute(
        `INSERT INTO medical_records (appointment_id, patient_id, doctor_id, symptoms, diagnosis, treatment, notes, follow_up_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          completedAppts[i],
          patientIds[patientIdx],
          docId,
          symptoms[diagIdx],
          diagnoses[diagIdx],
          treatments[diagIdx],
          'Bệnh nhân hợp tác tốt trong quá trình khám.',
          followUp,
        ]
      );
      recordIds.push(result.insertId);
    }
    console.log(`   ✅ ${recordIds.length} medical records`);

    // ─── 10. PRESCRIPTIONS (for each medical record, 2-3 medicines) ───
    console.log('💊 Seed prescriptions...');
    let prescriptionCount = 0;
    const dosages = ['1 viên x 2 lần/ngày', '1 viên x 3 lần/ngày', '2 viên x 2 lần/ngày', '1 lọ, nhỏ 2 giọt x 3 lần/ngày', '1 xịt x 2 lần/ngày'];
    const instructions = ['Uống sau ăn', 'Uống trước ăn 30 phút', 'Nhỏ tai sau khi rửa sạch', 'Xịt mũi sau khi rửa mũi', 'Uống với nhiều nước'];

    for (const recordId of recordIds) {
      const medCount = 2 + Math.floor(Math.random() * 2); // 2-3
      const usedMeds = new Set();
      for (let j = 0; j < medCount; j++) {
        let medId;
        do {
          medId = Math.floor(Math.random() * medicines.length) + 1;
        } while (usedMeds.has(medId));
        usedMeds.add(medId);

        await connection.execute(
          `INSERT INTO prescriptions (record_id, medicine_id, quantity, dosage, duration_days, instruction) VALUES (?, ?, ?, ?, ?, ?)`,
          [recordId, medId, Math.floor(Math.random() * 20) + 5, randomItem(dosages), 5 + Math.floor(Math.random() * 10), randomItem(instructions)]
        );
        prescriptionCount++;
      }
    }
    console.log(`   ✅ ${prescriptionCount} prescriptions`);

    // ─── 11. CONTACT MESSAGES (5) ───
    console.log('📧 Seed contact messages...');
    const contactMessages = [
      { name: 'Nguyễn Văn Hải', email: 'hai.nv@gmail.com', phone: '0912345678', subject: 'Hỏi về lịch khám', message: 'Tôi muốn hỏi lịch khám bác sĩ Phạm Tuấn Cảnh vào thứ 7 có không?' },
      { name: 'Trần Thị Hồng', email: 'hong.tt@gmail.com', phone: '0987654321', subject: 'Thắc mắc về bảo hiểm', message: 'Bệnh viện có nhận BHYT tuyến tỉnh không? Tôi ở Hải Phòng muốn lên khám.' },
      { name: 'Lê Văn Tùng', email: 'tung.lv@gmail.com', phone: '0356789012', subject: 'Xin kết quả xét nghiệm', message: 'Tôi khám ngày 10/3 mã bệnh nhân BN2026-0345, xin cho tôi kết quả xét nghiệm.' },
      { name: 'Phạm Thị Nga', email: 'nga.pt@gmail.com', phone: '0823456789', subject: 'Góp ý dịch vụ', message: 'Phòng khám rất sạch sẽ nhưng thời gian chờ hơi lâu. Mong BV cải thiện.' },
      { name: 'Hoàng Minh Tuấn', email: 'tuan.hm@gmail.com', phone: '0765432198', subject: 'Đặt lịch khám cho con', message: 'Con tôi 5 tuổi bị viêm amidan tái phát, muốn đặt lịch khám khoa TMH trẻ em.' },
    ];
    for (const msg of contactMessages) {
      await connection.execute(
        `INSERT INTO contact_messages (name, email, phone, subject, message, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
        [msg.name, msg.email, msg.phone, msg.subject, msg.message, Math.random() > 0.5 ? 1 : 0]
      );
    }
    console.log(`   ✅ ${contactMessages.length} contact messages`);

    // ═══════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════
    console.log('\n════════════════════════════════════════════');
    console.log('🎉 SEED HOÀN TẤT!');
    console.log('════════════════════════════════════════════');
    console.log(`   Departments:       ${departments.length}`);
    console.log(`   Doctors:           ${doctors.length}`);
    console.log(`   Doctor Schedules:  ${scheduleCount}`);
    console.log(`   News:              ${newsData.length}`);
    console.log(`   Medicines:         ${medicines.length}`);
    console.log(`   Users:             ${totalUsers}`);
    console.log(`   Patients:          ${patientNames.length}`);
    console.log(`   Appointments:      30`);
    console.log(`   Medical Records:   ${recordIds.length}`);
    console.log(`   Prescriptions:     ${prescriptionCount}`);
    console.log(`   Contact Messages:  ${contactMessages.length}`);
    console.log('────────────────────────────────────────────');
    const total = departments.length + doctors.length + scheduleCount + newsData.length + medicines.length + totalUsers + patientNames.length + 30 + recordIds.length + prescriptionCount + contactMessages.length;
    console.log(`   TỔNG:             ~${total} bản ghi`);
    console.log('════════════════════════════════════════════');
    console.log('\n📌 THÔNG TIN ĐĂNG NHẬP:');
    console.log('   Admin:   admin@noh.vn / Admin@2026');
    console.log('   Doctor:  pgsts.pham.tuan.canh@noh.vn / Doctor@2026');
    console.log('   Patient: patient1@gmail.com / Patient@2026');
    console.log('');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await connection.end();
  }
}

seed();
