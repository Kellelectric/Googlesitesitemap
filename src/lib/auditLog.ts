import { db } from '@/lib/db'

export async function writeAuditLog(params: {
  adminUserId?: string
  action: string
  entityType: string
  entityId: string
  previousValue?: unknown
  newValue?: unknown
}) {
  await db.auditLog.create({
    data: {
      adminUserId: params.adminUserId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      previousValue: params.previousValue as never,
      newValue: params.newValue as never,
    },
  })
}
