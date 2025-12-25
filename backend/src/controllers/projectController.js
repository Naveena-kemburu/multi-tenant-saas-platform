const { pool } = require('../config/database');
const { logAudit } = require('../utils/auditLog');

const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC',
      [req.user.tenantId]
    );
    res.json({ success: true, message: 'Projects retrieved', data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND tenant_id = $2',
      [req.params.id, req.user.tenantId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project retrieved', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const result = await pool.query(
      'INSERT INTO projects (name, description, status, tenant_id, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, status || 'active', req.user.tenantId, req.user.id]
    );
    await logAudit(req.user.tenantId, req.user.id, 'CREATE', 'projects', result.rows[0].id, { name, description });
    res.status(201).json({ success: true, message: 'Project created', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const result = await pool.query(
      'UPDATE projects SET name = $1, description = $2, status = $3, updated_at = NOW() WHERE id = $4 AND tenant_id = $5 RETURNING *',
      [name, description, status, req.params.id, req.user.tenantId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    await logAudit(req.user.tenantId, req.user.id, 'UPDATE', 'projects', req.params.id, { name, description, status });
    res.json({ success: true, message: 'Project updated', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [req.params.id, req.user.tenantId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    await logAudit(req.user.tenantId, req.user.id, 'DELETE', 'projects', req.params.id, {});
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
