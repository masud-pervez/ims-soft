export const logAudit = async (
  conn,
  targetId,
  module,
  action,
  oldState,
  newState,
  changedBy
) => {
  try {
    const query =
      "INSERT INTO audit_logs (`targetId`, `module`, `action`, `oldState`, `newState`, `changedBy`) VALUES (?,?,?,?,?,?)";
    const params = [
      targetId,
      module,
      action,
      oldState ? JSON.stringify(oldState) : null,
      newState ? JSON.stringify(newState) : null,
      changedBy,
    ];

    // Check if conn is a connection or pool. If it's a connection, use it. If it's a pool, get a connection?
    // The original code passed 'conn' which was a transaction connection.
    // It is expected that 'conn' here is an active database connection (likely inside a transaction).
    await conn.query(query, params);
  } catch (error) {
    console.error("Audit Log Error:", error);
    // Silent fail to not disrupt the main transaction? Or throw?
    // Original code didn't have try/catch around the query itself but the caller did.
    // We'll let the error propagate if strictly needed, but here we'll log it.
    // Actually, forcing propagation is safer for data integrity if audit is required.
    throw error;
  }
};
