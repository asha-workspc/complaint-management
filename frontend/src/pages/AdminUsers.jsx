import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userAPI } from '../services/api'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'
import { Users, Shield, UserCheck, UserX } from 'lucide-react'

const RoleBadge = ({ role }) => {
  const colors = {
    ADMIN: 'bg-purple-100 text-purple-700',
    AGENT: 'bg-blue-100 text-blue-700',
    USER: 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[role] || colors.USER}`}>
      {role}
    </span>
  )
}

export default function AdminUsers() {
  const queryClient = useQueryClient()
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getAll,
  })

  const toggleMutation = useMutation({
    mutationFn: userAPI.toggleActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated')
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const total = users?.length ?? 0
  const admins = users?.filter(u => u.role === 'ADMIN').length ?? 0
  const active = users?.filter(u => u.active).length ?? 0

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage all registered users</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Users', value: active, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Admins', value: admins, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3 text-slate-600">{u.department || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleMutation.mutate(u.id)}
                      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                        u.active
                          ? 'text-red-500 hover:text-red-700'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {u.active
                        ? <><UserX size={13} /> Deactivate</>
                        : <><UserCheck size={13} /> Activate</>
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
