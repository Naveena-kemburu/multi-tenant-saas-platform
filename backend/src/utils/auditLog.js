const { query } = require('../config/database');

const logAction = async (tenantId, userId, action, entityType, entityId, ipAddress) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    
    await query(
      `INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, ip_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [id, tenantId, userId, action, entityType, entityId, ipAddress]
    );
    
    return true;
  } catch (err) {
    console.error('Error logging audit:', err);
    return false;
  }
};

const getAuditLogs = async (tenantId, limit = 100, offset = 0) => {
  try {
    const result = await query(
      `SELECT * FROM audit_logs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [tenantId, limit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
};

module.exports = {
  logAction,
  getAuditLogs
};
