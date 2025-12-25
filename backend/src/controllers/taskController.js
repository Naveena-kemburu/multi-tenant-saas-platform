const { pool } = require('../config/database');
const { logAudit } = require('../utils/auditLog');

const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE tenant_id = $1 ORDER BY created_at DESC',
      [req.user.tenantId]
    );
    res.json({ success: true, message: 'Tasks retrieved', data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND tenant_id = $2',
      [req.params.id, req.user.tenantId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task retrieved', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, status, assignedTo } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, project_id, status, assigned_to, tenant_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, projectId, status || 'todo', assignedTo, req.user.tenantId, req.user.id]
    );
    await logAudit(req.user.tenantId, req.user.id, 'CREATE', 'tasks', result.rows[0].id, { title, projectId });
    res.status(201).json({ success: true, message: 'Task created', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, assigned_to = $4, updated_at = NOW() WHERE id = $5 AND tenant_id = $6 RETURNING *',
      [title, description, status, assignedTo, req.params.id, req.user.tenantId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });
    await logAudit(req.user.tenantId, req.user.id, 'UPDATE', 'tasks', req.params.id, { title, status });
    res.json({ success: true, message: 'Task updated', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [req.params.id, req.user.tenantId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });
    await logAudit(req.user.tenantId, req.user.id, 'DELETE', 'tasks', req.params.id, {});
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
