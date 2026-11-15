# Hệ thống dự đoán AFC Asian Cup 2027

Đây là dự án phân tích dữ liệu bóng đá mang tính học thuật, sử dụng dữ liệu lịch sử các trận đấu quốc tế cùng những phương pháp thống kê và học máy để ước tính kết quả trận đấu, tỷ số và xác suất các kịch bản tại AFC Asian Cup 2027.

> **Trạng thái dự án: Giai đoạn phát triển ban đầu.** Repository hiện đang được xây dựng. Các tệp khởi tạo API và frontend mới cung cấp bộ khung ứng dụng ban đầu. Cần triển khai và đánh giá các mô hình dự đoán, xác minh dữ liệu giải đấu và hoàn thiện bộ mô phỏng Monte Carlo trước khi xem các kết quả là dự báo có ý nghĩa.

## 1. Mục tiêu dự án

### 1.1. Dự đoán kết quả giải đấu

Ước tính xác suất để mỗi đội tuyển quốc gia đã giành quyền tham dự:

- Vô địch hoặc giành vị trí á quân.
- Vào bán kết, tứ kết hoặc vòng 16 đội.
- Bị loại ở vòng bảng hoặc tại một vòng đấu loại trực tiếp cụ thể.

Ứng dụng cần phân biệt rõ xác suất **lọt vào** một vòng đấu với xác suất **bị loại tại** vòng đấu đó.

### 1.2. Dự đoán kết quả trận đấu

Cho phép người dùng chọn hai đội tuyển quốc gia và ước tính:

- Xác suất Đội A thắng, hai đội hòa và Đội B thắng sau 90 phút.
- Số bàn thắng kỳ vọng của mỗi đội.
- Phân phối xác suất của các tỷ số có thể xảy ra.
- Những tỷ số có xác suất cao nhất, chẳng hạn 5 tỷ số đứng đầu.

Đối với các trận đấu loại trực tiếp, xác suất trong 90 phút phải được báo cáo riêng với xác suất trong hiệp phụ, loạt sút luân lưu và xác suất giành quyền đi tiếp.

### 1.3. Mô phỏng giải đấu

Chạy mô phỏng Monte Carlo dựa trên các phân phối xác suất ở cấp độ trận đấu. Bộ mô phỏng cần:

- Áp dụng chính xác thể thức vòng bảng và vòng đấu loại trực tiếp.
- Xếp hạng các đội theo điều lệ giải đấu và các tiêu chí phụ tương ứng.
- Chọn các đội xếp thứ ba có thành tích tốt nhất theo thể thức chính thức.
- Mô phỏng hiệp phụ và loạt sút luân lưu khi cần thiết.
- Tổng hợp kết quả thành xác suất vô địch, đi tiếp và bị loại tại từng vòng.

Thông tin bảng đấu, lịch thi đấu, ngày thi đấu và các tiêu chí phân định thứ hạng cần được lưu dưới dạng dữ liệu/tệp cấu hình thay vì viết cố định trong mã nguồn. Trước mỗi lần phát hành, cần đối chiếu các thông tin này với thông báo chính thức mới nhất từ AFC.

## 2. Công nghệ sử dụng

Ứng dụng được xây dựng theo kiến trúc tách biệt frontend và backend:

| Tầng | Công nghệ | Trách nhiệm |
|---|---|---|
| Frontend | React 19 + Vite | Giao diện người dùng và dashboard tương tác |
| Biểu đồ frontend | Recharts | Trực quan hóa giải đấu, đội tuyển và trận đấu |
| HTTP client frontend | Axios | Gửi yêu cầu đến backend API |
| Backend API | FastAPI | Cung cấp REST API, kiểm tra dữ liệu đầu vào và điều phối xử lý |
| Lược đồ API | Pydantic | Kiểm tra và xác thực dữ liệu request/response |
| Phân tích dữ liệu | Python, Pandas, NumPy, SciPy | Thu thập, làm sạch, EDA và xây dựng đặc trưng |
| Machine Learning | Scikit-learn, CatBoost, Statsmodels | Xây dựng mô hình dự đoán kết quả và tỷ số |
| Cơ sở dữ liệu | PostgreSQL + SQLAlchemy | Lưu trữ dữ liệu có cấu trúc và thông tin dự đoán |
| Kiểm thử | Pytest + Vitest (dự kiến) | Kiểm thử backend và frontend |
| Triển khai | Docker + GitHub Actions | Đảm bảo môi trường chạy nhất quán và CI |

React là tầng hiển thị. Phần xử lý dữ liệu và mã nguồn mô hình Python được đặt trong `src/`; FastAPI cung cấp các chức năng đó cho frontend React. Không đặt mã huấn luyện mô hình trong React.

## 3. Phương pháp dự kiến

1. **Thu thập dữ liệu:** thu thập kết quả các trận đấu quốc tế trong quá khứ, lịch sử Asian Cup, các mốc xếp hạng FIFA và thông tin giải đấu chính thức.
2. **Làm sạch dữ liệu:** chuẩn hóa định danh đội tuyển, ngày tháng, tên giải đấu, vòng đấu và cách biểu diễn tỷ số; phát hiện bản ghi trùng lặp và giá trị thiếu.
3. **EDA (phân tích dữ liệu khám phá):** khảo sát xu hướng ghi bàn, ảnh hưởng sân nhà/sân khách và sân trung lập, phong độ gần đây, chênh lệch thứ hạng và thành tích Asian Cup trong lịch sử.
4. **Feature Engineering (xây dựng đặc trưng):** tính Elo trước trận, phong độ gần đây, số bàn thắng/bàn thua, sức mạnh đối thủ, số ngày nghỉ và các đặc trưng khác có thể biết trước thời điểm bóng lăn.
5. **Mô hình dự đoán kết quả trận đấu:** xây dựng mô hình cơ sở bằng Logistic Regression và so sánh với các mô hình cây như CatBoost.
6. **Mô hình dự đoán tỷ số:** phát triển mô hình Poisson và đánh giá các phương pháp mở rộng như Dixon-Coles để mô hình hóa tốt hơn những tỷ số có ít bàn thắng.
7. **Hiệu chỉnh xác suất:** đánh giá và hiệu chỉnh các ước tính xác suất, thay vì chỉ sử dụng trực tiếp điểm số thô từ mô hình.
8. **Mô phỏng giải đấu:** lặp lại việc mô phỏng vòng bảng và nhánh đấu loại trực tiếp bằng phương pháp Monte Carlo.
9. **API và frontend:** cung cấp các dịch vụ dự đoán/mô phỏng thông qua FastAPI và hiển thị kết quả bằng React.

Đây là các phương pháp dự kiến, không phải tuyên bố rằng mô hình đã được triển khai hoặc đạt hiệu suất cụ thể. Việc lựa chọn mô hình phải dựa trên kiểm thử ngược theo thời gian (chronological backtesting) và các kết quả đánh giá được ghi lại rõ ràng.

## 4. Nguồn dữ liệu

Đây là những nguồn dữ liệu tiềm năng. Trước khi thu thập hoặc phân phối lại dữ liệu, cần xem xét phạm vi dữ liệu, tần suất cập nhật, điều khoản sử dụng và giấy phép.

| Dữ liệu | Nguồn có thể sử dụng | Mục đích |
|---|---|---|
| Kết quả các trận đấu quốc tế | [International football results (martj42)](https://github.com/martj42/international_results) | Kết quả và tỷ số các trận đấu trong quá khứ |
| Dữ liệu trận đấu quốc tế | [OpenFootball Internationals](https://github.com/openfootball/internationals) | Đối chiếu và bổ sung dữ liệu trận đấu |
| Thể thức, điều lệ và lịch thi đấu | [Liên đoàn Bóng đá châu Á (AFC)](https://www.the-afc.com/) | Quy định chính thức và thông tin giải đấu |
| Bảng xếp hạng đội tuyển quốc gia | [FIFA Men's World Ranking](https://inside.fifa.com/fifa-world-ranking/men) | Xây dựng đặc trưng từ thứ hạng lịch sử |

Các thống kê trận đấu nâng cao (bàn thắng kỳ vọng – xG, số cú sút, tỷ lệ kiểm soát bóng, đội hình và tình trạng sẵn sàng của cầu thủ) có thể được bổ sung sau nếu tìm được nguồn đáng tin cậy và có quyền sử dụng phù hợp.

### Nguyên tắc quản lý dữ liệu

- Giữ nguyên các tệp nguồn trong `data/raw/` nếu chính sách repository và giấy phép dữ liệu cho phép.
- Lưu riêng dữ liệu đã làm sạch và dữ liệu sẵn sàng cho mô hình.
- Ghi lại URL nguồn, ngày thu thập, các bước biến đổi và phiên bản dữ liệu.
- Không commit API key, thông tin xác thực hoặc dữ liệu riêng tư.
- Không commit các bộ dữ liệu lớn hoặc tệp mô hình nếu không có lý do rõ ràng; cân nhắc dùng bộ nhớ ngoài hoặc Git LFS.
- Kiểm tra giấy phép và điều khoản của từng nguồn trước khi công bố dữ liệu.

## 5. Nguyên tắc xây dựng và đánh giá mô hình

- Sử dụng cách chia tập theo thời gian hoặc kiểm thử cuốn chiếu theo mốc thời gian (rolling-origin backtesting), không chỉ dựa vào cách chia train/test ngẫu nhiên.
- Chỉ sử dụng những thông tin có thể biết được trước thời điểm bóng lăn.
- Tính Elo, phong độ trượt, thứ hạng và các đặc trưng động chỉ dựa trên thông tin lịch sử.
- Tách biệt bàn thắng trong 90 phút, bàn thắng trong hiệp phụ và kết quả sút luân lưu.
- Không xem tỷ số của loạt sút luân lưu là bàn thắng trong trận đấu.
- Đánh giá chất lượng xác suất và khả năng hiệu chỉnh xác suất, không chỉ đánh giá độ chính xác (accuracy).

| Bài toán | Các chỉ số đánh giá có thể sử dụng |
|---|---|
| Phân loại thắng/hòa/thua | Accuracy, macro F1, Log Loss, Brier Score |
| Hiệu chỉnh xác suất | Reliability Diagram, calibration error, Brier Score |
| Dự đoán số bàn thắng | MAE, RMSE, Poisson deviance |
| Phân phối tỷ số | Negative log-likelihood và scoreline coverage |
| Mô phỏng giải đấu | Khả năng hiệu chỉnh xác suất đi tiếp trên dữ liệu lịch sử và các kiểm tra tính nhất quán của mô phỏng |

## 6. Cấu trúc project mục tiêu

Cấu trúc dưới đây là kiến trúc mục tiêu. Một số module mới chỉ là bộ khung hoặc đường dẫn dự kiến và có thể chưa được triển khai.

```text
DS_FINAL/
├── .github/
│   └── workflows/                # Các quy trình CI
├── backend/
│   └── app/
│       ├── api/                   # Các router của FastAPI
│       ├── core/                  # Settings, CORS và cấu hình dùng chung
│       ├── schemas/               # Schema request/response bằng Pydantic
│       ├── services/              # Các dịch vụ nghiệp vụ phục vụ API
│       └── main.py                # Điểm khởi chạy ứng dụng FastAPI
├── frontend/
│   ├── src/
│   │   ├── components/            # Các thành phần React có thể tái sử dụng
│   │   ├── pages/                 # Tổng quan, dự đoán trận đấu, mô phỏng, phân tích
│   │   ├── services/              # API client và các hàm gọi endpoint
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── config/                        # Cấu hình dữ liệu, mô hình và giải đấu
├── data/
│   ├── raw/                       # Dữ liệu thô
│   ├── interim/                   # Dữ liệu trung gian
│   ├── processed/                 # Dữ liệu đã xử lý
│   └── external/                  # Dữ liệu bổ sung từ nguồn bên ngoài
├── docs/                          # Data Dictionary và tài liệu phương pháp
├── models/                        # Tệp mô hình đã huấn luyện và metadata
├── notebooks/                     # Thu thập dữ liệu, làm sạch, EDA và thử nghiệm
├── src/
│   ├── data/                      # Thu thập, làm sạch và kiểm định dữ liệu
│   ├── features/                  # Elo, phong độ và Feature Engineering
│   ├── models/                    # Triển khai mô hình kết quả và tỷ số
│   ├── prediction/                # Logic dự đoán có thể tái sử dụng
│   ├── simulation/                # Vòng bảng, vòng loại trực tiếp, Monte Carlo
│   └── tournament/                # Điều lệ giải đấu và logic nhánh đấu
├── tests/                         # Các bài kiểm thử Python
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt               # Các dependencies Python/backend
```

Nếu thư mục `app/` ở root hiện tại được tạo cho Streamlit, hãy di chuyển những phần mã có thể tái sử dụng trước khi đổi tên hoặc xóa thư mục đó. Thư mục frontend mục tiêu là `frontend/`, còn `backend/` chứa ứng dụng FastAPI.

## 7. Bắt đầu sử dụng

### Yêu cầu môi trường

- Python 3.11 trở lên.
- Node.js 22.12 trở lên (Node.js 26 LTS là một lựa chọn phù hợp).
- npm.
- Git.
- PostgreSQL khi các chức năng tích hợp cơ sở dữ liệu được triển khai.

### 7.1. Clone repository

```bash
git clone https://github.com/TuVu5463/DS_FINAL.git
cd DS_FINAL
```

### 7.2. Thiết lập môi trường Python

**Windows PowerShell:**

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

**macOS / Linux:**

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 7.3. Khởi chạy FastAPI backend

Chạy lệnh sau từ thư mục gốc repository:

```bash
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Khi backend đã chạy, truy cập:

- Kiểm tra trạng thái API: <http://127.0.0.1:8000/api/health>
- Tài liệu API tương tác: <http://127.0.0.1:8000/docs>

### 7.4. Khởi chạy React frontend

Mở terminal thứ hai:

```bash
cd frontend
npm install
npm run dev
```

Vite sẽ hiển thị địa chỉ frontend trên máy local, thông thường là <http://localhost:5173>.

Frontend đọc địa chỉ API gốc từ biến môi trường `VITE_API_BASE_URL`. Ví dụ khi chạy local:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Tạo file `frontend/.env.local` để lưu cấu hình local; không commit file này lên Git.

### 7.5. Chạy kiểm thử backend

Chạy lệnh sau từ thư mục gốc repository:

```bash
python -m pytest -q
```

Bộ kiểm thử sẽ được mở rộng khi các module dữ liệu, mô hình, API và mô phỏng được triển khai.

## 8. Biến môi trường và thông tin bí mật

- Lưu thông tin xác thực local trong `.env` hoặc `frontend/.env.local` tùy trường hợp.
- Chỉ commit các tệp ví dụ đã loại bỏ thông tin nhạy cảm như `.env.example`.
- Tuyệt đối không commit API token, mật khẩu, thông tin đăng nhập cơ sở dữ liệu hoặc private key.
- Các biến frontend có tiền tố `VITE_` sẽ được cung cấp cho trình duyệt; không đặt thông tin bí mật trong những biến này.
- Lưu bảng đấu, lịch thi đấu và các tiêu chí phân định thứ hạng trong tệp cấu hình/tệp dữ liệu, đồng thời kiểm tra chúng theo điều lệ chính thức.

## 9. Lộ trình phát triển

- [ ] Hoàn tất rà soát nguồn dữ liệu và xây dựng Data Dictionary.
- [ ] Xây dựng pipeline thu thập và kiểm định dữ liệu có thể tái lập.
- [ ] Làm sạch và tích hợp dữ liệu lịch sử các trận đấu quốc tế.
- [ ] Hoàn thành phân tích dữ liệu khám phá (EDA).
- [ ] Triển khai đặc trưng Elo trước trận và phong độ gần đây.
- [ ] Huấn luyện và kiểm thử ngược các mô hình thắng/hòa/thua.
- [ ] Huấn luyện và đánh giá các mô hình dự đoán tỷ số.
