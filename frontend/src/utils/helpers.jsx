import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const timeAgo = (date) => {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const statusConfig = {
  OPEN: { label: 'Open', color: 'badge-open', dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'badge-in_progress', dot: 'bg-yellow-500' },
  RESOLVED: { label: 'Resolved', color: 'badge-resolved', dot: 'bg-green-500' },
  CLOSED: { label: 'Closed', color: 'badge-closed', dot: 'bg-slate-400' },
  REJECTED: { label: 'Rejected', color: 'badge-rejected', dot: 'bg-red-500' },
}

export const priorityConfig = {
  LOW: { label: 'Low', color: 'priority-low' },
  MEDIUM: { label: 'Medium', color: 'priority-medium' },
  HIGH: { label: 'High', color: 'priority-high' },
  CRITICAL: { label: 'Critical', color: 'priority-critical' },
}

export const categoryLabels = {
  TECHNICAL: 'Technical',
  BILLING: 'Billing',
  SERVICE: 'Service',
  PRODUCT: 'Product',
  DELIVERY: 'Delivery',
  STAFF_BEHAVIOR: 'Staff Behavior',
  POLICY: 'Policy',
  OTHER: 'Other',
}

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, color: 'badge-closed' }
  return <span className={config.color}>{config.label}</span>
}

export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || { label: priority, color: 'priority-low' }
  return <span className={config.color}>{config.label}</span>
}
