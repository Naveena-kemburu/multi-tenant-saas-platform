const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../config/jwt');
const { pool } = require('../config/database');
const { logAudit } = require('../utils/auditLog');

const register = async (req, res) => {
  try {
    const { email, password, tenantId, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, tenant_id, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name',
      [email, hashedPassword, tenantId, name, 'member']
    );
    await logAudit(tenantId, req.user?.id, 'CREATE', 'users', result.rows[0].id, { email, name });
    res.status(201).json({ success: true, message: 'User registered', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, tenantId } = req.body;
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user.id, tenantId, user.role);
    await logAudit(tenantId, user.id, 'LOGIN', 'auth', user.id, {});
    res.json({ success: true, message: 'Login successful', data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = verifyToken(token);
    const newToken = generateToken(decoded.userId, decoded.tenantId, decoded.role);
    res.json({ success: true, message: 'Token refreshed', data: { token: newToken } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { register, login, refresh };
