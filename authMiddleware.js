const jwt = require('jsonwebtoken');

const JWT_SECRET = "ADiOS_SECRET_KEY_2026";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({ status: "error", message: "يجب تسجيل الدخول للوصول لهذه البيانات" });
    }

    // ✅ دعم Bearer token والتوكن الخام معاً
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.json({ status: "error", message: "التوكن غير صالح أو منتهي" });
    }
}

module.exports = authMiddleware;
