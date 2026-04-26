const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../authMiddleware');

const JWT_SECRET = "ADiOS_SECRET_KEY_2026";

/* ============================================================
   🔹 1) تسجيل مستخدم جديد
============================================================ */
router.post('/register', (req, res) => {



  const {
    username,
    name,
    email,
    password,
    gender,
    birthdate,
    student_type,
    major,
    skill_title,
    whatsapp,
    work_links
  } = req.body;

  if (!username || !name || !email || !password) {
    return res.json({ status: 'error', message: 'يرجى تعبئة جميع الحقول المطلوبة' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO users 
    (username, name, email, password, gender, birthdate, student_type, major, skill_title, whatsapp, work_links)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    username, name, email, hashedPassword,
    gender, birthdate, student_type, major,
    skill_title, whatsapp, work_links
  ], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.json({ status: 'error', message: 'اسم المستخدم أو البريد مستخدم من قبل' });
      }
      return res.json({ status: 'error', message: err.message });
    }
    res.json({ status: 'success', message: 'تم إنشاء الحساب بنجاح' });
  });
});

/* ============================================================
   🔹 2) تسجيل الدخول
============================================================ */
router.post('/login', (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ status: 'error', message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) return res.json({ status: 'error', message: err.message });

    if (result.length === 0) {
      return res.json({ status: 'error', message: 'اسم المستخدم غير موجود' });
    }

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.json({ status: 'error', message: 'كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      status: 'success',
      message: 'تم تسجيل الدخول بنجاح',
      token: token
    });
  });
});

/* ============================================================
   🔹 3) جلب بيانات المستخدم
============================================================ */
router.get('/profile', authMiddleware, (req, res) => {
  const sql = `
    SELECT id, username, name, email, gender, birthdate,
           student_type, major, skill_title, whatsapp,
           work_links, created_at
    FROM users WHERE id = ?
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.json({ status: 'error', message: err.message });

    if (result.length === 0) {
      return res.json({ status: 'error', message: 'المستخدم غير موجود' });
    }

    const user = result[0];

    // حساب العمر
    if (user.birthdate) {
      const birth = new Date(user.birthdate);
      const ageDifMs = Date.now() - birth.getTime();
      const ageDate = new Date(ageDifMs);
      user.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    } else {
      user.age = null;
    }

    res.json({
      status: "success",
      message: "تم جلب بيانات المستخدم بنجاح",
      user: user
    });
  });
});

/* ============================================================
   🔹 4) تحديث بيانات البروفايل
============================================================ */
router.post('/update', authMiddleware, (req, res) => {

  const {
    name,
    email,
    gender,
    birthdate,
    student_type,
    major,
    skill_title,
    whatsapp,
    work_links
  } = req.body;

  // حساب العمر
  let age = null;
  if (birthdate) {
    const birth = new Date(birthdate);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

const safeBirthdate = birthdate && birthdate.trim() !== '' ? birthdate : null;

  const sql = `
    UPDATE users SET
      name = ?, email = ?, gender = ?, birthdate = ?, age = ?,
      student_type = ?, major = ?, skill_title = ?, whatsapp = ?,
      work_links = ?
    WHERE id = ?
  `;

  db.query(sql, [
    name, email, gender, safeBirthdate, age,
    student_type, major, skill_title, whatsapp,
    work_links, req.user.id
  ], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });

    res.json({
      status: 'success',
      message: 'تم تحديث البيانات بنجاح'
    });
  });
});

/* ============================================================
   🔹 5) البحث عن المستخدمين
============================================================ */
router.get('/search', (req, res) => {
  const { student_type, major, skill } = req.query;

  let sql = `
    SELECT id, name, gender, major, skill_title, student_type
    FROM users
    WHERE 1=1
  `;

  const params = [];

  if (student_type) {
    sql += " AND student_type = ?";
    params.push(student_type);
  }

  if (major) {
    sql += " AND major = ?";
    params.push(major);
  }

  if (skill) {
    sql += " AND skill_title LIKE ?";
    params.push(`%${skill}%`);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.json({ status: "error", message: err.message });
    }

    res.json({
      status: "success",
      users: result
    });
  });
});

/* ============================================================
   🔹 6) جلب بروفايل مستخدم عبر ID (صفحة الخريجين)
============================================================ */
router.get('/user/:id', (req, res) => {
  const sql = `
    SELECT id, username, name, email, gender, birthdate, age,
           student_type, major, skill_title, whatsapp, work_links
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.json({ status: 'error', message: err.message });
    }

    if (result.length === 0) {
      return res.json({ status: 'error', message: 'المستخدم غير موجود' });
    }

    res.json({
      status: "success",
      user: result[0]
    });
  });
});

module.exports = router;
