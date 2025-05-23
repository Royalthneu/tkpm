// Ung_dung.js - Khởi động hệ thống quản lý khách sạn
const express = require('express');
const path = require('path');
const fs = require("fs");
const XL_QUAN_LY_KHACH_SAN = require("./XL_QUAN_LY_KHACH_SAN");

const Ung_dung = express();

// Xử lý POST form
Ung_dung.use(express.urlencoded({ extended: true }));

// Dẫn tới thư mục public nếu có:
Ung_dung.use('/Media', express.static(path.join(__dirname, '../Media')));
Ung_dung.use('/Du_lieu', express.static(path.join(__dirname, '../Du_lieu')));

// Khởi động
const PORT = process.env.PORT || 3000;
Ung_dung.listen(PORT, () => {
    console.log(`Dịch vụ đang chạy tại cổng ${PORT}`);
});

// ==== Điều hướng trang chính
Ung_dung.get("/", XL_Khoi_dong);

Ung_dung.get("/login", (req, res) => {
    const html = `
    <div class="container mt-5" style="max-width:400px;">
        <h4>🔐 Đăng nhập quản lý</h4>
        <form method="post" action="/login" class="border p-4 rounded">
            <input type="hidden" name="role" value="admin" />
            <div class="mb-3">
                <label>Tài khoản:</label>
                <input name="username" class="form-control" required/>
            </div>
            <div class="mb-3">
                <label>Mật khẩu:</label>
                <input name="password" type="password" class="form-control" required/>
            </div>
            <button class="btn btn-primary w-100">Đăng nhập</button>
        </form>
    </div>`;
    res.send(Khung_HTML.replace("Chuoi_HTML", html));
});



Ung_dung.post("/login", (req, res) => {
    const { username, password, role } = req.body;

    const isAdmin = username === "admin" && password === "123";

    if (role === "admin" && isAdmin) {
        res.redirect("/QUAN_LY/PHONG_THUE?hello=true");
    } else {
        res.redirect("/?login=true");
    }
});


Ung_dung.get("/QUAN_LY", (req, res) => {
    const html = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML_Phan_he(
        () => XL_QUAN_LY_KHACH_SAN.Tao_Menu_Quan_ly("phong"),
        `<div class="container"><h3>Chào mừng quản lý</h3></div>`
    );
    res.send(Khung_HTML.replace("Chuoi_HTML", html));
});

Ung_dung.get("/QUAN_LY/PHIEU_THUE", (req, res) => {
    const { Tu_ngay = "", Den_ngay = "", So_phong = "", Sort_by = "" } = req.query;

    let ds = XL_QUAN_LY_KHACH_SAN.Tra_cuu_Phieu_thue({});

    if (Tu_ngay) ds = ds.filter(p => p.Ngay_nhan >= Tu_ngay);
    if (Den_ngay) ds = ds.filter(p => p.Ngay_nhan <= Den_ngay);
    if (So_phong) ds = ds.filter(p => p.So_phong.toLowerCase().includes(So_phong.toLowerCase()));

    if (Sort_by === "ngay") {
        ds.sort((a, b) => b.Ngay_nhan.localeCompare(a.Ngay_nhan));
    } else if (Sort_by === "tien") {
        ds.sort((a, b) => b.Tien_thue - a.Tien_thue);
    }

    const html = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML_Phan_he(
        () => XL_QUAN_LY_KHACH_SAN.Tao_Menu_Quan_ly("phieu"),
        XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Danh_sach_Phieu_thue_Loc(ds, Tu_ngay, Den_ngay, So_phong, Sort_by)
    );

    res.send(Khung_HTML.replace("Chuoi_HTML", html));
});

Ung_dung.get("/QUAN_LY/PHIEU_THUE/SUA", (req, res) => {
    try {
        const file = req.query.file;
        const fullPath = path.join(__dirname, "../Du_lieu/Phieu_thue", file);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).send(`<h3>❌ Không tìm thấy file: ${file}</h3>`);
        }

        const phieu = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
        phieu._file = file;

        const ds_loai = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Loai_phong();
        const ds_phong = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Phong_thue();

        const html = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML_Phan_he(
            () => XL_QUAN_LY_KHACH_SAN.Tao_Menu_Quan_ly("phieu"),
            XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Form_Them_Phieu_thue(...)
        );

        res.send(Khung_HTML.replace("Chuoi_HTML", html));
    } catch (err) {
        res.status(500).send(`<h3>Lỗi khi mở form sửa: ${err.message}</h3>`);
    }
});


Ung_dung.post("/QUAN_LY/PHIEU_THUE/SUA", (req, res) => {
    const {
        So_phong, Loai_phong, Ngay_nhan, Ngay_tra, Tien_thue,
        Ho_ten_1, CMND_1, Ho_ten_2, CMND_2, File_name
    } = req.body;

    const ds_khach = [];
    if (Ho_ten_1 && CMND_1) ds_khach.push({ Ho_ten: Ho_ten_1, CMND: CMND_1 });
    if (Ho_ten_2 && CMND_2) ds_khach.push({ Ho_ten: Ho_ten_2, CMND: CMND_2 });

    const phieu = {
        So_phong,
        Loai_phong,
        Ngay_nhan,
        Ngay_tra,
        Tien_thue: parseInt(Tien_thue),
        Danh_sach_khach: ds_khach
    };

    const fullPath = path.join(__dirname, "../Du_lieu/Phieu_thue", File_name);
    try {
        fs.writeFileSync(fullPath, JSON.stringify(phieu, null, 2), "utf-8");
        res.redirect("/QUAN_LY/PHIEU_THUE");
    } catch (err) {
        res.status(500).send(`<pre>Lỗi ghi file: ${err.message}</pre>`);
    }
});

Ung_dung.get("/QUAN_LY/PHIEU_THUE/XOA", (req, res) => {
    const file = req.query.file;
    const fullPath = path.join(__dirname, "../Du_lieu/Phieu_thue", file);
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    res.redirect("/QUAN_LY/PHIEU_THUE");
});

Ung_dung.get("/QUAN_LY/PHONG_THUE", (req, res) => {
    const { hello } = req.query;
    let loi_chao = hello === "true" ? `<div class="alert alert-info">👋 Xin chào quản lý</div>` : "";

    const { Loai_phong = "", Trang_thai = "", quick = "" } = req.query;
    let ds_phong = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Phong_thue();

    if (Loai_phong) {
        ds_phong = ds_phong.filter(p => p.Loai_phong === Loai_phong);
    }
    if (Trang_thai) {
        ds_phong = ds_phong.filter(p => p.Trang_thai === Trang_thai);
    }

    const ds_loai = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Loai_phong();

    const html = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML_Phan_he(
        () => XL_QUAN_LY_KHACH_SAN.Tao_Menu_Quan_ly("phong"),
        loi_chao + XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Danh_sach_Phong(ds_phong, ds_loai, Loai_phong, Trang_thai)
    );

    res.send(Khung_HTML.replace("Chuoi_HTML", html));
});


Ung_dung.get("/QUAN_LY/TRA_CUU", (req, res) => {
    const { So_phong = "", Ho_ten = "", Tu_ngay = "", Den_ngay = "", quick = "" } = req.query;

    const today = new Date();
    let tu = Tu_ngay, den = Den_ngay;

    // Bộ lọc nhanh
    if (quick === "today") {
        const d = today.toISOString().slice(0, 10);
        tu = den = d;
    } else if (quick === "week") {
        const first = new Date(today);
        first.setDate(today.getDate() - today.getDay()); // CN
        tu = first.toISOString().slice(0, 10);
        den = today.toISOString().slice(0, 10);
    } else if (quick === "month") {
        const d1 = new Date(today.getFullYear(), today.getMonth(), 1);
        tu = d1.toISOString().slice(0, 10);
        den = today.toISOString().slice(0, 10);
    }

    let ds = XL_QUAN_LY_KHACH_SAN.Tra_cuu_Phieu_thue({ So_phong, Ho_ten });
    if (tu) ds = ds.filter(p => p.Ngay_nhan >= tu);
    if (den) ds = ds.filter(p => p.Ngay_nhan <= den);

    const html = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML_Phan_he(
        () => XL_QUAN_LY_KHACH_SAN.Tao_Menu_Quan_ly("tra_cuu"),
        `
        ${XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Form_Tra_cuu_Quan_ly(So_phong, Ho_ten, tu, den)}

        <div class="mb-3">
            <strong>Lọc nhanh:</strong>
            <a href="/QUAN_LY/TRA_CUU?quick=today" class="btn btn-sm btn-outline-dark">Hôm nay</a>
            <a href="/QUAN_LY/TRA_CUU?quick=week" class="btn btn-sm btn-outline-dark">Tuần này</a>
            <a href="/QUAN_LY/TRA_CUU?quick=month" class="btn btn-sm btn-outline-dark">Tháng này</a>            
        </div>

        ${XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Ket_qua_Tra_cuu_Quan_ly(ds)}
        `
    );
        res.send(Khung_HTML.replace("Chuoi_HTML", html));
    });

Ung_dung.get("/QUAN_LY/BAO_CAO", (req, res) => {
    const { Tu_ngay = "", Den_ngay = "" } = req.query;

    let ds = XL_QUAN_LY_KHACH_SAN.Tra_cuu_Phieu_thue({});

    if (Tu_ngay) ds = ds.filter(p => p.Ngay_nhan >= Tu_ngay);
    if (Den_ngay) ds = ds.filter(p => p.Ngay_nhan <= Den_ngay);

    const html = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML_Phan_he(
        () => XL_QUAN_LY_KHACH_SAN.Tao_Menu_Quan_ly("bao_cao"),
        XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Bao_cao_Doanh_thu(ds, Tu_ngay, Den_ngay)
    );

    res.send(Khung_HTML.replace("Chuoi_HTML", html));
});

Ung_dung.get("/KHACH_HANG", (req, res) => {
    const html = XL_QUAN_LY_KHACH_SAN.Tao_Menu_Khach_hang() + `<div class="container"><h3>Chào mừng quý khách</h3></div>`;
    res.send(Khung_HTML.replace("Chuoi_HTML", html));
});

Ung_dung.get("/PHIEU_THUE/Them", XL_Hien_thi_Form_Them_Phieu);
Ung_dung.post("/PHIEU_THUE/Them", XL_Xu_ly_Them_Phieu);

// ==== Biến toàn cục
const Khung_HTML = XL_QUAN_LY_KHACH_SAN.Doc_Khung_HTML();

// ==== Hàm xử lý trang chủ
function XL_Khoi_dong(req, res) {
    const hien_dialog = req.query.login === "true";

    const dialogHTML = hien_dialog
        ? `<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#00000088;z-index:9999">
            <div style="background:white;padding:20px;border-radius:10px;max-width:400px;margin:100px auto;">
                <form method="post" action="/login">
                    <h5>Đăng nhập hệ thống</h5>
                    <div class="mb-2">
                        <label>Tài khoản:</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    <div class="mb-2">
                        <label>Mật khẩu:</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <div class="text-end mt-3">
                        <a href="/" class="btn btn-secondary">Hủy</a>
                        <button class="btn btn-primary">Xác nhận</button>
                    </div>
                </form>
            </div>
        </div>` : "";

    const html = `
    <div class="container text-center mt-5">
        <h2>Hệ thống Quản lý Khách sạn</h2>
        <p>Vui lòng chọn phân hệ để sử dụng:</p>
        <div class="d-flex justify-content-center gap-4 mt-4 px-4">
            <a href="/login?role=admin" class="btn btn-primary btn-lg">🔐 Phân hệ Quản lý</a>
            <a href="/KHACH_HANG/TRA_CUU_PHONG?hello=true" class="btn btn-outline-secondary btn-lg">🌐 Phân hệ Khách hàng</a>
        </div>
        <div class="d-flex justify-content-center mt-5">
            <a href="/">
                <img src="/Media/Logo.png" alt="Trang chủ" height="500">
            </a>
        </div>
        <div style="position:fixed;top:10px;right:10px;z-index:10000">
            <a href="/?login=true" class="btn btn-outline-primary">🔐 Đăng nhập</a>
        </div>
    </div>
    ${dialogHTML}`;

    res.send(Khung_HTML.replace("Chuoi_HTML", html));
}



// ==== Hàm xử lý tra cứu phiếu thuê
function XL_Tra_cuu_Phieu_thue(req, res) {
    const du_lieu = req.method === "POST" ? req.body : req.query;

    const co_du_lieu = du_lieu.So_phong || du_lieu.Ngay_nhan || du_lieu.Ho_ten;

    const Chuoi_HTML = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML(
        co_du_lieu
            ? XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Ket_qua_Tra_cuu(
                  XL_QUAN_LY_KHACH_SAN.Tra_cuu_Phieu_thue(du_lieu)
              )
            : XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Form_Tra_cuu()
    );

    res.send(Khung_HTML.replace("Chuoi_HTML", Chuoi_HTML));
}

function XL_Hien_thi_Form_Them_Phieu(req, res) {
    const ds_phong = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Phong_thue();
    const ds_loai = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Loai_phong();
    const Chuoi_HTML = XL_QUAN_LY_KHACH_SAN.Tao_Trang_HTML(
        XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Form_Them_Phieu_thue(ds_phong, ds_loai)
    );
    res.send(Khung_HTML.replace("Chuoi_HTML", Chuoi_HTML));
}

function XL_Xu_ly_Them_Phieu(req, res) {
    const { So_phong, Loai_phong, Ngay_nhan, Ngay_tra, Tien_thue, Ho_ten_1, CMND_1, Ho_ten_2, CMND_2 } = req.body;
    const danh_sach_khach = [];

    if (Ho_ten_1 && CMND_1) danh_sach_khach.push({ Ho_ten: Ho_ten_1, CMND: CMND_1 });
    if (Ho_ten_2 && CMND_2) danh_sach_khach.push({ Ho_ten: Ho_ten_2, CMND: CMND_2 });

    const phieu_moi = {
        So_phong,
        Loai_phong,
        Ngay_nhan,
        Ngay_tra,
        Tien_thue: parseInt(Tien_thue),
        Danh_sach_khach: danh_sach_khach
    };

    const thu_muc = PATH.join(__dirname, "../Du_lieu/Phieu_thue");
    const ds_file = fs.readdirSync(thu_muc).filter(f => f.startsWith("phieu_thue_"));
    const stt = ds_file.length + 1;
    const ten_file = `phieu_thue_${String(stt).padStart(3, "0")}.json`;
    const duong_dan = PATH.join(thu_muc, ten_file);

    fs.writeFileSync(duong_dan, JSON.stringify(phieu_moi, null, 2), "utf-8");

    res.redirect("/"); // hoặc hiển thị thông báo thành công
}

//PHÂN HỆ KHÁCH HÀNG
Ung_dung.get("/KHACH_HANG/TRA_CUU_PHONG", (req, res) => {
    const { hello } = req.query;
    let loi_chao = hello === "true" ? `<div class="alert alert-success">👋 Xin chào khách hàng</div>` : "";
    
    const ds_loai = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Loai_phong();
    const ds_phong = XL_QUAN_LY_KHACH_SAN.Doc_Danh_sach_Phong_thue();

    const { Loai_phong = "", Gia_toi_da = "", Tien_nghi = "", Ngay = "" } = req.query;

    let ds_kq = ds_phong.filter(p => p.Trang_thai === "Trống");

    // Nếu có ngày được chọn → loại bỏ những phòng đã được thuê vào ngày đó
    if (Ngay) {
        const ds_phieu = XL_QUAN_LY_KHACH_SAN.Tra_cuu_Phieu_thue({});
        const ds_phong_dang_thue = ds_phieu
            .filter(p => p.Ngay_nhan <= Ngay && Ngay <= p.Ngay_tra)
            .map(p => p.So_phong);
        ds_kq = ds_kq.filter(p => !ds_phong_dang_thue.includes(p.So_phong));
    }

    if (Loai_phong) ds_kq = ds_kq.filter(p => p.Loai_phong === Loai_phong);

    if (Gia_toi_da) {
        const max = parseInt(Gia_toi_da);
        ds_kq = ds_kq.filter(p => {
            const loai = ds_loai.find(l => l.Ten === p.Loai_phong);
            return loai && loai.Don_gia <= max;
        });
    }

    if (Tien_nghi) {
        const keyword = Tien_nghi.toLowerCase();
        ds_kq = ds_kq.filter(p => {
            const loai = ds_loai.find(l => l.Ten === p.Loai_phong);
            return loai && loai.Tien_nghi.some(tn => tn.toLowerCase().includes(keyword));
        });
    }

    const Chuoi_HTML = XL_QUAN_LY_KHACH_SAN.Tao_Menu_Khach_hang() +
        loi_chao +
        XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Form_Tra_cuu_Phong(ds_loai) +
        `<hr/>` +
        XL_QUAN_LY_KHACH_SAN.Tao_Chuoi_HTML_Danh_sach_Phong_Trong(ds_kq, ds_loai);

    res.send(Khung_HTML.replace("Chuoi_HTML", Chuoi_HTML));
});

//NỘI DUNG KHÁC

