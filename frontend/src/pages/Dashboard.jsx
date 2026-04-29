import { useQuery } from '@tanstack/react-query'
import { complaintAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Plus, AlertTriangle } from 'lucide-react'

const STATUS_COLORS = {
  OPEN: '#3b82f6', IN_PROGRESS: '#f59e0b',
  RESOLVED: '#22c55e', CLOSED: '#94a3b8', REJECTED: '#ef4444'
}

const PIE_COLORS = ['#3b82f6','#f59e0b','#22c55e','#94a3b8','#ef4444','#8b5cf6','#ec4899','#06b6d4']

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: complaintAPI.getStats,
    enabled: isAdmin(),
  })

  const { data: myComplaints } = useQuery({
    queryKey: ['complaints', 'mine'],
    queryFn: () => complaintAPI.getAll({ page: 0, size: 5 }),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const statCards = isAdmin() ? [
    { label: 'Total Complaints', value: stats?.totalComplaints ?? 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Open', value: stats?.openComplaints ?? 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'In Progress', value: stats?.inProgressComplaints ?? 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Resolved', value: stats?.resolvedComplaints ?? 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ] : [
    { label: 'My Complaints', value: myComplaints?.totalElements ?? 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'This Month', value: stats?.monthComplaints ?? 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const categoryData = stats?.categoryStats
    ? Object.entries(stats.categoryStats).map(([k, v]) => ({ name: k.replace('_', ' '), value: v }))
    : []

  const statusData = stats?.statusStats
    ? Object.entries(stats.statusStats).map(([k, v]) => ({ name: k.replace('_', ' '), value: v, fill: STATUS_COLORS[k] || '#94a3b8' }))
    : []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome back, <span className="font-medium text-slate-700">{user?.name}</span>
          </p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          <Plus size={16} /> New Complaint
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {isAdmin() && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Complaints by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70}
                  dataKey="value" nameKey="name" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={false} fontSize={10}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent complaints */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Complaints</h3>
          <Link to="/complaints" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        {myComplaints?.content?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle size={32} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No complaints yet</p>
            <p className="text-slate-400 text-sm mt-1">Submit your first complaint to get started</p>
            <Link to="/complaints/new" className="btn-primary mt-4 text-sm">
              <Plus size={14} /> Submit Complaint
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myComplaints?.content?.map((c) => (
              <Link key={c.id} to={`/complaints/${c.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 mono">{c.complaintNumber}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`badge-${c.status.toLowerCase()}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
