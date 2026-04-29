import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { complaintAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PriorityBadge, categoryLabels, formatDate } from '../utils/helpers'
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react'

const STATUSES = ['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']
const CATEGORIES = ['', 'TECHNICAL', 'BILLING', 'SERVICE', 'PRODUCT', 'DELIVERY', 'STAFF_BEHAVIOR', 'POLICY', 'OTHER']
const PRIORITIES = ['', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export default function Complaints() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', keyword: '' })
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['complaints', page, filters],
    queryFn: () => complaintAPI.getAll({
      page, size: 10,
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.keyword && { keyword: filters.keyword }),
    }),
  })

  const update = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value })
    setPage(0)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Complaints</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {data?.totalElements ?? 0} total complaints
          </p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          <Plus size={16} /> New Complaint
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description, or complaint number..."
              className="input-field pl-9"
              value={filters.keyword}
              onChange={update('keyword')}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={filters.status} onChange={update('status')}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s || 'All Statuses'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={filters.category} onChange={update('category')}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c ? categoryLabels[c] : 'All Categories'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input-field" value={filters.priority} onChange={update('priority')}>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p || 'All Priorities'}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Complaint</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                    {isAdmin() && <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted By</th>}
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.content?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        No complaints found
                      </td>
                    </tr>
                  ) : (
                    data?.content?.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800 truncate max-w-[200px]">{c.title}</p>
                          <p className="text-xs text-slate-400 mono mt-0.5">{c.complaintNumber}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-600">{categoryLabels[c.category] || c.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={c.priority} />
                        </td>
                        {isAdmin() && (
                          <td className="px-4 py-3 text-slate-600">{c.submittedBy?.name}</td>
                        )}
                        <td className="px-4 py-3 text-slate-500">{formatDate(c.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Link to={`/complaints/${c.id}`}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium">
                            <Eye size={14} /> View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing {page * 10 + 1}–{Math.min((page + 1) * 10, data.totalElements)} of {data.totalElements}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 0}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: data.totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        i === page ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={data.last}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
