const FS = require("fs");
const PATH = require("path");

// ✅ Đường dẫn tuyệt đối dựa theo vị trí file JS này
const Thu_muc_Du_lieu = PATH.join(__dirname, "../Du_lieu");
const Thu_muc_HTML = PATH.join(Thu_muc_Du_lieu, "HTML");
const Thu_muc_Phieu_thue = PATH.join(Thu_muc_Du_lieu, "Phieu_thue");
const Thu_muc_Loai_phong = PATH.join(Thu_muc_Du_lieu, "Loai_phong");
const Thu_muc_Phong_thue = PATH.join(Thu_muc_Du_lieu, "Phong_thue");

class XL_QUAN_LY_KHACH_SAN {
    static Doc_Khung_HTML() {
        const duong_dan = PATH.join(Thu_muc_HTML, "Khung.html");
        return FS.readFileSync(duong_dan, "utf-8");
    }

    static Tao_Chuoi_HTML_Header() {
    return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">🏨 Khách Sạn Mini</a>

        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="/PHIEU_THUE/Quan_ly">Quản lý Phiếu thuê</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/PHONG/Trang_thai">Trạng thái phòng</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/PHIEU_THUE/Tra_cuu">Tra cứu</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/BAO_CAO">Báo cáo</a>
            </li>
          </ul>
          <form class="d-flex" method="get" action="/Tra_cuu">
            <input class="form-control me-2" type="search" name="Tu_khoa" placeholder="Tìm kiếm..." />
            <button class="btn btn-outline-success" type="submit">🔍</button>
          </form>
        </div>
      </div>
    </nav>
    `;
    }

    static Tao_Menu_Quan_ly(menu_active = "") {
        return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center gap-2" href="/">
              <img src="/Media/logo.png" height="32" alt="logo">
              <span>Phân hệ Quản lý</span>
            </a>
        
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuQL" aria-controls="menuQL" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
        
            <div class="collapse navbar-collapse" id="menuQL">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link ${menu_active === "phieu" ? "active" : ""}" href="/QUAN_LY/PHIEU_THUE">Quản lý Phiếu thuê</a></li>
                <li class="nav-item"><a class="nav-link ${menu_active === "phong" ? "active" : ""}" href="/QUAN_LY/PHONG_THUE">Trạng thái Phòng</a></li>
                <li class="nav-item"><a class="nav-link ${menu_active === "tra_cuu" ? "active" : ""}" href="/QUAN_LY/TRA_CUU">Tra cứu</a></li>
                <li class="nav-item"><a class="nav-link ${menu_active === "bao_cao" ? "active" : ""}" href="/QUAN_LY/BAO_CAO">Báo cáo</a></li>
              </ul>
            </div>
          </div>
        </nav>
            `;
    }


    static Tao_Menu_Khach_hang() {
    return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="/">
          <img src="/Media/logo.png" height="32" alt="logo">
          <span>Khách hàng</span>
        </a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="/KHACH_HANG/TRA_CUU_PHONG">Tra cứu phòng</a></li>            
          </ul>
        </div>
      </div>
    </nav>`;
    }

    static Tao_Trang_HTML_Phan_he(func_menu, noi_dung) {
        return func_menu() + `<div class="container">${noi_dung}</div>`;
    }

   //_____________________________________________________________________
   //PHÂN HỆ QUẢN LÝ

    static Tao_Chuoi_HTML_Danh_sach_Phieu_thue(danh_sach) {
    if (!danh_sach || danh_sach.length === 0) return `<p>Không có phiếu thuê nào.</p>`;

    const rows = danh_sach.map(phieu => `
        <tr>
            <td>${phieu.So_phong}</td>
            <td>${phieu.Loai_phong}</td>
            <td>${phieu.Ngay_nhan}</td>
            <td>${phieu.Ngay_tra}</td>
            <td>${phieu.Tien_thue.toLocaleString("vi-VN")}₫</td>
            <td>${(phieu.Danh_sach_khach || []).length}</td>
        </tr>
    `).join("");

    return `
        <div class="mb-3 d-flex justify-content-between">
            <h4>Danh sách phiếu thuê</h4>
            <a class="btn btn-success" href="/PHIEU_THUE/Them">➕ Thêm phiếu thuê</a>
        </div>
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>Số phòng</th>
                    <th>Loại phòng</th>
                    <th>Ngày nhận</th>
                    <th>Ngày trả</th>
                    <th>Tiền thuê</th>
                    <th>Số khách</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
    }

    static Tao_Chuoi_HTML_Danh_sach_Phieu_thue_Loc(ds, tu_ngay = "", den_ngay = "", so_phong = "", sort_by = "") {
        const rows = ds.map(phieu => `
            <tr>
                <td>${phieu.So_phong}</td>
                <td>${phieu.Loai_phong}</td>
                <td>${phieu.Ngay_nhan}</td>
                <td>${phieu.Ngay_tra}</td>
                <td>${phieu.Tien_thue.toLocaleString("vi-VN")}₫</td>
                <td>${(phieu.Danh_sach_khach || []).length}</td>
                <td>
                    <a class="btn btn-sm btn-warning" 
                    href="/QUAN_LY/PHIEU_THUE/SUA?file=${phieu._file}">Sửa</a>
                    <a class="btn btn-sm btn-danger" 
                    href="/QUAN_LY/PHIEU_THUE/XOA?file=${phieu._file}" 
                    onclick="return confirm('Bạn có chắc muốn xoá phiếu này?')">Xoá</a>
                </td>
            </tr>
        `).join("");

        return `
            <form method="get" action="/QUAN_LY/PHIEU_THUE" class="row g-3 mb-3">
                <div class="col-md-2">
                    <label class="form-label">Từ ngày:</label>
                    <input type="date" class="form-control" name="Tu_ngay" value="${tu_ngay}" />
                </div>
                <div class="col-md-2">
                    <label class="form-label">Đến ngày:</label>
                    <input type="date" class="form-control" name="Den_ngay" value="${den_ngay}" />
                </div>
                <div class="col-md-2">
                    <label class="form-label">Số phòng:</label>
                    <input type="text" class="form-control" name="So_phong" value="${so_phong}" />
                </div>
                <div class="col-md-2">
                    <label class="form-label">Sắp xếp:</label>
                    <select class="form-control" name="Sort_by">
                        <option value="">-- Không --</option>
                        <option value="ngay" ${sort_by === "ngay" ? "selected" : ""}>Ngày nhận mới nhất</option>
                        <option value="tien" ${sort_by === "tien" ? "selected" : ""}>Tiền thuê cao nhất</option>
                    </select>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-primary w-100">Lọc</button>
                </div>
                <div class="col-md-2 d-flex align-items-end justify-content-end">
                    <a class="btn btn-success w-100" href="/PHIEU_THUE/Them">➕ Thêm phiếu thuê</a>
                </div>
            </form>

            <table class="table table-bordered table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Số phòng</th>
                        <th>Loại phòng</th>
                        <th>Ngày nhận</th>
                        <th>Ngày trả</th>
                        <th>Tiền thuê</th>
                        <th>Số khách</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }

    static Tao_Chuoi_HTML_Danh_sach_Phong(ds_phong, ds_loai, loai_phong = "", trang_thai = "") {
    const loai_dict = Object.fromEntries(ds_loai.map(l => [l.Ten, l]));

    const rows = ds_phong.map(p => {
        const loai = loai_dict[p.Loai_phong];
        const don_gia = loai?.Don_gia?.toLocaleString("vi-VN") || "N/A";
        const tien_nghi = (loai?.Tien_nghi || []).join(", ");

        return `
            <tr>
                <td>${p.So_phong}</td>
                <td>${p.Loai_phong}</td>
                <td>${p.Trang_thai}</td>
                <td>${don_gia}₫</td>
                <td>${tien_nghi}</td>
            </tr>
        `;
    }).join("");

    const options_loai = ["", ...new Set(ds_loai.map(l => l.Ten))]
        .map(l => `<option value="${l}" ${l === loai_phong ? "selected" : ""}>${l || "-- Tất cả --"}</option>`)
        .join("");

    const options_trang_thai = ["", "Phòng Trống", "Đã thuê"]
        .map(t => `<option value="${t}" ${t === trang_thai ? "selected" : ""}>${t || "-- Tất cả --"}</option>`)
        .join("");

    return `
        <form method="get" action="/QUAN_LY/PHONG_THUE" class="row g-3 mb-3">
            <div class="col-md-4">
                <label>Loại phòng:</label>
                <select name="Loai_phong" class="form-control">
                    ${options_loai}
                </select>
            </div>
            <div class="col-md-4">
                <label>Trạng thái:</label>
                <select name="Trang_thai" class="form-control">
                    ${options_trang_thai}
                </select>
            </div>
            <div class="col-md-4 d-flex align-items-end">
                <button class="btn btn-primary w-100">Lọc</button>
            </div>
        </form>

        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>Số phòng</th>
                    <th>Loại phòng</th>
                    <th>Trạng thái</th>
                    <th>Đơn giá</th>
                    <th>Tiện nghi</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
    }

    static Doc_Danh_sach_Loai_phong() {
        const danh_sach = [];
        const files = FS.readdirSync(Thu_muc_Loai_phong).filter(name => name.startsWith("LP_"));
        for (const file of files) {
            const duong_dan = PATH.join(Thu_muc_Loai_phong, file);
            const du_lieu = JSON.parse(FS.readFileSync(duong_dan, "utf-8"));
            // Nếu file chứa 1 object thì thêm trực tiếp, nếu chứa mảng thì lấy phần tử đầu tiên
            danh_sach.push(Array.isArray(du_lieu) ? du_lieu[0] : du_lieu);
        }
        return danh_sach;
    }

    static Doc_Danh_sach_Phong_thue() {
        const danh_sach = [];
        const files = FS.readdirSync(Thu_muc_Phong_thue).filter(name => name.startsWith("PT_"));
        for (const file of files) {
            const duong_dan = PATH.join(Thu_muc_Phong_thue, file);
            const phong = JSON.parse(FS.readFileSync(duong_dan, "utf-8"));
            danh_sach.push(phong);
        }
        return danh_sach;
    }

    static Tra_cuu_Phieu_thue({ So_phong = "", Ngay_nhan = "", Ho_ten = "" }) {
        const danh_sach = [];
        const files = FS.readdirSync(Thu_muc_Phieu_thue).filter(name => name.startsWith("phieu_thue_"));
        for (const file of files) {
            const duong_dan = PATH.join(Thu_muc_Phieu_thue, file);
            const phieu = JSON.parse(FS.readFileSync(duong_dan, "utf-8"));
            phieu._file = file; // <-- Gắn tên file để sử dụng cho sửa/xoá

            const matchPhong = !So_phong || phieu.So_phong.toLowerCase().includes(So_phong.toLowerCase());
            const matchNgay = !Ngay_nhan || phieu.Ngay_nhan === Ngay_nhan;
            const matchTen = !Ho_ten || (phieu.Danh_sach_khach || []).some(k =>
                k.Ho_ten.toLowerCase().includes(Ho_ten.toLowerCase())
            );

            if (matchPhong && matchNgay && matchTen) {
                danh_sach.push(phieu);
            }
        }
        return danh_sach;
    }

    static Tao_Chuoi_HTML_Form_Tra_cuu() {
        return `
            <form method="get" action="/PHIEU_THUE/Tra_cuu" class="p-3 border rounded">
                <h4>Tra cứu phiếu thuê</h4>
                <div class="form-group">
                    <label>Số phòng:</label>
                    <input name="So_phong" class="form-control" />
                </div>
                <div class="form-group">
                    <label>Ngày nhận:</label>
                    <input name="Ngay_nhan" type="date" class="form-control" />
                </div>
                <div class="form-group">
                    <label>Họ tên khách:</label>
                    <input name="Ho_ten" class="form-control" />
                </div>
                <button class="btn btn-primary mt-2">Tra cứu</button>
            </form>
        `;
    }

    static Tao_Chuoi_HTML_Ket_qua_Tra_cuu(ds) {
        if (ds.length === 0) return "<p>Không tìm thấy kết quả phù hợp.</p>";

        return ds.map(phieu => `
            <div class="border p-3 mb-2">
                <h5>Phòng: ${phieu.So_phong} - ${phieu.Loai_phong}</h5>
                <p>Thời gian: ${phieu.Ngay_nhan} đến ${phieu.Ngay_tra}</p>
                <p>Tiền thuê: ${phieu.Tien_thue.toLocaleString("vi-VN")}₫</p>
                <ul>
                    ${(phieu.Danh_sach_khach || []).map(k => `<li>${k.Ho_ten} - ${k.CMND}</li>`).join("")}
                </ul>
            </div>
        `).join("");
    }

    static Tao_Chuoi_HTML_Form_Them_Phieu_thue(ds_phong, ds_loai, phieu = null, isEdit = false) {
        const so_phong = phieu?.So_phong || "";
        const loai_phong = phieu?.Loai_phong || "";
        const ngay_nhan = phieu?.Ngay_nhan || "";
        const ngay_tra = phieu?.Ngay_tra || "";
        const tien_thue = phieu?.Tien_thue || "";
        const khach1 = phieu?.Danh_sach_khach?.[0] || {};
        const khach2 = phieu?.Danh_sach_khach?.[1] || {};
        const file_name = phieu?._file || "";
    
        const optionsPhong = ds_phong.map(p => 
            `<option value="${p.So_phong}" data-loai="${p.Loai_phong}" ${p.So_phong === so_phong ? "selected" : ""}>
                ${p.So_phong} (${p.Trang_thai})
            </option>`).join("");
    
        const optionsLoai = ds_loai.map(l => {
            const gia = l.Don_gia || 0;
            const selected = l.Ten === loai_phong ? "selected" : "";
            return `<option value="${l.Ten}" ${selected}>${l.Ten} - ${gia.toLocaleString("vi-VN")}₫</option>`;
        }).join("");
    
        const action_url = isEdit ? "/QUAN_LY/PHIEU_THUE/SUA" : "/PHIEU_THUE/Them";
    
        return `
            <form method="post" action="${action_url}" class="p-3 border rounded">
                <h4>${isEdit ? "Cập nhật" : "Thêm"} phiếu thuê phòng</h4>
    
                ${isEdit ? `<input type="hidden" name="File_name" value="${file_name}" />` : ""}
    
                <div class="form-group mb-2">
                    <label>Số phòng:</label>
                    <select name="So_phong" id="soPhong" class="form-control" required>
                        ${optionsPhong}
                    </select>
                </div>
    
                <div class="form-group mb-2">
                    <label>Loại phòng:</label>
                    <select name="Loai_phong" id="loaiPhong" class="form-control" required>
                        ${optionsLoai}
                    </select>
                </div>
    
                <div class="form-group mb-2">
                    <label>Ngày nhận:</label>
                    <input name="Ngay_nhan" type="date" class="form-control" value="${ngay_nhan}" required />
                </div>
    
                <div class="form-group mb-2">
                    <label>Ngày trả:</label>
                    <input name="Ngay_tra" type="date" class="form-control" value="${ngay_tra}" required />
                </div>
    
                <div class="form-group mb-2">
                    <label>Tiền thuê:</label>
                    <input name="Tien_thue" type="number" class="form-control" value="${tien_thue}" required />
                </div>
    
                <hr/>
                <div class="form-group mb-2">
                    <label>Khách 1 - Họ tên:</label>
                    <input name="Ho_ten_1" class="form-control" value="${khach1.Ho_ten || ""}" />
                    <label>Số CMND:</label>
                    <input name="CMND_1" class="form-control" value="${khach1.CMND || ""}" />
                </div>
    
                <div class="form-group mb-2">
                    <label>Khách 2 - Họ tên:</label>
                    <input name="Ho_ten_2" class="form-control" value="${khach2.Ho_ten || ""}" />
                    <label>Số CMND:</label>
                    <input name="CMND_2" class="form-control" value="${khach2.CMND || ""}" />
                </div>
    
                <button class="btn btn-${isEdit ? "warning" : "success"} mt-3">
                    ${isEdit ? "Cập nhật" : "Thêm"} phiếu thuê
                </button>
            </form>
    
            <script>
                document.getElementById("soPhong")?.addEventListener("change", function () {
                    const selected = this.options[this.selectedIndex];
                    const loai = selected.getAttribute("data-loai");
                    const selectLoai = document.getElementById("loaiPhong");
                    if (loai) {
                        for (let opt of selectLoai.options) {
                            opt.selected = (opt.value === loai);
                        }
                    }
                });
            </script>
        `;
    }


    static Tao_Chuoi_HTML_Bao_cao_Doanh_thu(ds, tu_ngay = "", den_ngay = "") {
        const tong_tien = ds.reduce((acc, p) => acc + (p.Tien_thue || 0), 0);

        const rows = ds.map(p => `
            <tr>
                <td>${p.So_phong}</td>
                <td>${p.Ngay_nhan}</td>
                <td>${p.Ngay_tra}</td>
                <td>${p.Tien_thue.toLocaleString("vi-VN")}₫</td>
            </tr>
        `).join("");

        // Gom doanh thu theo số phòng
        const tong_theo_phong = {};
        ds.forEach(p => {
            if (!tong_theo_phong[p.So_phong]) tong_theo_phong[p.So_phong] = 0;
            tong_theo_phong[p.So_phong] += p.Tien_thue || 0;
        });

        const table_gom = Object.entries(tong_theo_phong)
            .sort((a, b) => b[1] - a[1]) // Sắp theo tổng tiền giảm dần
            .map(([so, tong]) => `
                <tr><td>${so}</td><td>${tong.toLocaleString("vi-VN")}₫</td></tr>
            `).join("");

        return `
            <form method="get" action="/QUAN_LY/BAO_CAO" class="row g-3 mb-4">
                <div class="col-md-4">
                    <label>Từ ngày:</label>
                    <input type="date" name="Tu_ngay" value="${tu_ngay}" class="form-control" />
                </div>
                <div class="col-md-4">
                    <label>Đến ngày:</label>
                    <input type="date" name="Den_ngay" value="${den_ngay}" class="form-control" />
                </div>
                <div class="col-md-4 d-flex align-items-end">
                    <button class="btn btn-primary w-100">Lọc</button>
                </div>
            </form>

            <div class="mb-4">
                <h5>Biểu đồ doanh thu theo ngày nhận</h5>
                ${this.Tao_SVG_Bieu_do_Doanh_thu(ds)}
            </div>

            <div class="alert alert-info">
                <p><strong>Tổng số phiếu thuê:</strong> ${ds.length}</p>
                <p><strong>Tổng doanh thu:</strong> ${tong_tien.toLocaleString("vi-VN")}₫</p>
            </div>

            <div class="mb-4">
                <h5>📊 Doanh thu theo từng số phòng</h5>
                <table class="table table-bordered table-striped">
                    <thead class="table-light">
                        <tr><th>Số phòng</th><th>Tổng doanh thu</th></tr>
                    </thead>
                    <tbody>${table_gom}</tbody>
                </table>
            </div>

            <div class="mb-4">
                <h5>📋 Chi tiết phiếu thuê</h5>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>Số phòng</th>
                            <th>Ngày nhận</th>
                            <th>Ngày trả</th>
                            <th>Tiền thuê</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }


    static Tao_SVG_Bieu_do_Doanh_thu(ds) {
    // Gom doanh thu theo ngày nhận
    const doanh_thu = {};
    for (const p of ds) {
        if (!doanh_thu[p.Ngay_nhan]) doanh_thu[p.Ngay_nhan] = 0;
        doanh_thu[p.Ngay_nhan] += p.Tien_thue || 0;
    }

    const entries = Object.entries(doanh_thu).sort((a, b) => a[0].localeCompare(b[0]));
    const max = Math.max(...entries.map(e => e[1])) || 1;

    const bars = entries.map(([ngay, tien], i) => {
        const x = i * 40 + 10;
        const height = (tien / max) * 100;
        const y = 120 - height;
        return `<rect x="${x}" y="${y}" width="30" height="${height}" fill="steelblue">
            <title>${ngay}: ${tien.toLocaleString("vi-VN")}₫</title>
        </rect>`;
    });

    const labels = entries.map(([ngay], i) => {
        const x = i * 40 + 10;
        return `<text x="${x}" y="135" font-size="10">${ngay.slice(5)}</text>`;
    });

    return `
    <svg width="100%" height="150" viewBox="0 0 ${entries.length * 40 + 20} 150">
        ${bars.join("")}
        ${labels.join("")}
    </svg>
    `;
    }

    static Tao_Chuoi_HTML_Form_Tra_cuu_Quan_ly(so_phong = "", ho_ten = "", tu_ngay = "", den_ngay = "") {
    return `
    <form method="get" action="/QUAN_LY/TRA_CUU" class="row g-3 mb-3">
        <div class="col-md-3">
            <label>Số phòng:</label>
            <input name="So_phong" value="${so_phong}" class="form-control" />
        </div>
        <div class="col-md-3">
            <label>Tên khách:</label>
            <input name="Ho_ten" value="${ho_ten}" class="form-control" />
        </div>
        <div class="col-md-3">
            <label>Từ ngày:</label>
            <input type="date" name="Tu_ngay" value="${tu_ngay}" class="form-control" />
        </div>
        <div class="col-md-3">
            <label>Đến ngày:</label>
            <input type="date" name="Den_ngay" value="${den_ngay}" class="form-control" />
        </div>
        <div class="col-12">
            <button class="btn btn-primary">🔍 Tra cứu</button>
        </div>
    </form>
    `;
    }

    static Tao_Chuoi_HTML_Ket_qua_Tra_cuu_Quan_ly(ds) {
        if (!ds.length) return `<p class="text-muted">Không tìm thấy kết quả.</p>`;

        const danh_sach_html = ds.map((p, i) => {
            const collapseId = `collapse_khach_${i}`;
            const danh_sach = (p.Danh_sach_khach || []).map(k =>
                `<li>${k.Ho_ten} – CMND: ${k.CMND}</li>`
            ).join("") || "<li><em>Không có khách</em></li>";

            return `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm" style="cursor:pointer;" onclick="document.getElementById('${collapseId}').classList.toggle('d-none')">
                    <div class="card-body">
                        <h5 class="card-title">Phòng ${p.So_phong} – ${p.Loai_phong}</h5>
                        <p class="card-text"><strong>Thời gian:</strong> ${p.Ngay_nhan} → ${p.Ngay_tra}</p>
                        <p class="card-text"><strong>Tiền thuê:</strong> ${p.Tien_thue.toLocaleString("vi-VN")}₫</p>

                        <div id="${collapseId}" class="collapse-khach border rounded p-2 mt-2 d-none bg-light">
                            <strong>Thông tin khách:</strong>
                            <ul class="mb-0">${danh_sach}</ul>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join("");

        return `
        <div class="mb-3">
            <button class="btn btn-outline-primary" onclick="toggleAllKhach()" id="btnToggleAll">👁️ Hiện tất cả khách</button>
        </div>

        <div class="row">
            ${danh_sach_html}
        </div>

        <script>
            function toggleAllKhach() {
                const btn = document.getElementById("btnToggleAll");
                const elements = document.querySelectorAll('.collapse-khach');
                const isAnyHidden = Array.from(elements).some(el => el.classList.contains("d-none"));

                elements.forEach(el => {
                    el.classList.toggle("d-none", !isAnyHidden); // Nếu đang hiện, thì ẩn; đang ẩn thì hiện
                });

                btn.innerText = isAnyHidden ? "🙈 Ẩn tất cả khách" : "👁️ Hiện tất cả khách";
            }
        </script>
        `;
    }


    
    static Tao_Trang_HTML(noi_dung) {
      return this.Tao_Chuoi_HTML_Header() + noi_dung;
    }
    //_____________________________________________________________________
    //PHÂN HỆ KHACH HÀNG
    static Tao_Chuoi_HTML_Form_Tra_cuu_Phong(ds_loai_phong) {
    const loai_options = ds_loai_phong.map(l => `<option value="${l.Ten}">${l.Ten}</option>`).join("");

    return `
        <form method="get" action="/KHACH_HANG/TRA_CUU_PHONG" class="p-3 border rounded">
            <h4>Tra cứu phòng còn trống</h4>

            <div class="form-group mb-2">
                <label>Loại phòng:</label>
                <select name="Loai_phong" class="form-control">
                    <option value="">-- Tất cả --</option>
                    ${loai_options}
                </select>
            </div>

            <div class="form-group mb-2">
                <label>Đơn giá tối đa:</label>
                <input name="Gia_toi_da" type="number" class="form-control" placeholder="VD: 500000" />
            </div>

            <div class="form-group mb-2">
                <label>Tiện nghi (chứa từ khoá):</label>
                <input name="Tien_nghi" type="text" class="form-control" placeholder="VD: Wifi, TV" />
            </div>

            <div class="form-group mb-2">
                <label>Ngày muốn nhận phòng:</label>
                <input name="Ngay" type="date" class="form-control" />
            </div>

            <button class="btn btn-primary mt-2">Tìm phòng</button>
        </form>
    `;
    }

    static Tao_Chuoi_HTML_Danh_sach_Phong_Trong(ds_phong, ds_loai) {
        if (!ds_phong || ds_phong.length === 0) {
            return `<p class="text-muted">Không có phòng nào phù hợp với điều kiện tra cứu.</p>`;
        }

        

        const loai_dict = Object.fromEntries(ds_loai.map(l => [l.Ten, l]));

        return `
            <div class="row">
                ${ds_phong.map(p => {
                    const loai = loai_dict[p.Loai_phong];
                    const gia = loai?.Don_gia?.toLocaleString("vi-VN") || "N/A";
                    const tien_nghi_icon = (loai?.Tien_nghi || []).map(tn => {
                        if (/wifi/i.test(tn)) return "📶 Wifi";
                        if (/tv/i.test(tn)) return "📺 TV";
                        if (/điều hòa|may lanh/i.test(tn)) return "❄️ Điều hòa";
                        return `🔹 ${tn}`;
                    }).join(", ");

                    return `
                    <div class="col-md-4 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">Phòng ${p.So_phong}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${p.Loai_phong}</h6>
                                <p class="card-text mb-1"><strong>Giá:</strong> ${gia}₫ / đêm</p>
                                <p class="card-text mb-1"><strong>Tiện nghi:</strong> ${tien_nghi_icon}</p>
                                <p class="card-text"><strong>Trạng thái:</strong> 
                                    <span class="badge bg-${p.Trang_thai === "Trống" ? "success" : "secondary"}">${p.Trang_thai}</span>
                                </p>
                            </div>
                        </div>
                    </div>`;
                }).join("")}
            </div>
        `;
    }
    
}

module.exports = XL_QUAN_LY_KHACH_SAN;
