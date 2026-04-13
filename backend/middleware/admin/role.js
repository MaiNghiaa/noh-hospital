// backend/middleware/role.js
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập chức năng này',
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
};

module.exports = { requireRole };
