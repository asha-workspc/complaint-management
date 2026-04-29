import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintAPI, userAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PriorityBadge, categoryLabels, formatDateTime, timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Edit2, Trash2, MessageSquare, Send,
  User, Calendar, Tag, AlertTriangle, CheckCircle2
} from 'lucide-react'

export default function ComplaintDetail() {
  const { id } = useParams()
  const { user, isAdmin, isAgent } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [comment, setComment] = useState('')
  const [updateForm, setUpdateForm] = useState({})

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintAPI.getById(id),
    onSuccess: (data) => setUpdateForm({
      status: data.status, priority: data.priority,
      assignedToId: data.assignedTo?.id, resolution: data.resolution || ''
    }),
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getAll,
    enabled: isAdmin(),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => complaintAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] })
      toast.success('Complaint updated')
      setEditing(false)
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: () => complaintAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      toast.success('Complaint deleted')
      navigate('/complaints')
    },
    onError: (err) => toast.error(err.message),
  })

  const commentMutation = useMutation({
    mutationFn: (data) => complaintAPI.addComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] })
      setComment('')
      toast.success('Comment added')
    },
    onError: (err) => toast.error(err.message),
  })

  const handleComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    commentMutation.mutate({ content: comment })
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!complaint) return (
    <div className="text-center py-16">
      <AlertTriangle className="mx-auto mb-3 text-slate-300" size={32} />
      <p className="text-slate-500">Complaint not found</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/complaints" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{complaint.title}</h1>
            <p className="text-sm mono text-slate-500">{complaint.complaintNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isAgent() && (
            <button onClick={() => setEditing(!editing)} className="btn-secondary text-sm">
              <Edit2 size={14} /> {editing ? 'Cancel' : 'Edit'}
            </button>
          )}
          {(isAdmin() || complaint.submittedBy?.id === user?.id) && (
            <button
              onClick={() => { if (confirm('Delete this complaint?')) deleteMutation.mutate() }}
              className="btn-danger text-sm"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 mb-3">Description</h3>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{complaint.description}</p>
          </div>

          {/* Admin update form */}
          {editing && isAgent() && (
            <div className="card p-5 border-blue-200 bg-blue-50">
              <h3 className="font-semibold text-slate-700 mb-4">Update Complaint</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Status</label>
                    <select className="input-field" value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}>
                      {['OPEN','IN_PROGRESS','RESOLVED','CLOSED','REJECTED'].map(s => (
                        <option key={s} value={s}>{s.replace('_',' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Priority</label>
                    <select className="input-field" value={updateForm.priority}
                      onChange={(e) => setUpdateForm({ ...updateForm, priority: e.target.value })}>
                      {['LOW','MEDIUM','HIGH','CRITICAL'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {isAdmin() && users && (
                  <div>
                    <label className="label">Assign To</label>
                    <select className="input-field" value={updateForm.assignedToId || ''}
                      onChange={(e) => setUpdateForm({ ...updateForm, assignedToId: e.target.value || null })}>
                      <option value="">Unassigned</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="label">Resolution Note</label>
                  <textarea className="input-field resize-none" rows={3}
                    placeholder="Add resolution details..."
                    value={updateForm.resolution}
                    onChange={(e) => setUpdateForm({ ...updateForm, resolution: e.target.value })} />
                </div>
                <button onClick={() => updateMutation.mutate(updateForm)}
                  disabled={updateMutation.isPending} className="btn-primary text-sm">
                  <CheckCircle2 size={14} />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Resolution */}
          {complaint.resolution && (
            <div className="card p-5 border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <h3 className="font-semibold text-green-800">Resolution</h3>
              </div>
              <p className="text-green-700 text-sm">{complaint.resolution}</p>
            </div>
          )}

          {/* Comments */}
          <div className="card">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-500" />
              <h3 className="font-semibold text-slate-700">
                Comments ({complaint.comments?.length ?? 0})
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {complaint.comments?.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">No comments yet</p>
              ) : (
                complaint.comments?.map((c) => (
                  <div key={c.id} className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">
                        {c.user?.name?.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{c.user?.name}</span>
                      {c.internal && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">Internal</span>
                      )}
                      <span className="text-xs text-slate-400 ml-auto">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-9">{c.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100">
              <form onSubmit={handleComment} className="flex gap-2">
                <input type="text" className="input-field flex-1 text-sm"
                  placeholder="Add a comment..."
                  value={comment} onChange={(e) => setComment(e.target.value)} />
                <button type="submit" disabled={!comment.trim() || commentMutation.isPending}
                  className="btn-primary text-sm px-3">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-slate-700">Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-1">Status</p>
                <StatusBadge status={complaint.status} />
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Priority</p>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Category</p>
                <span className="flex items-center gap-1 text-slate-600">
                  <Tag size={12} /> {categoryLabels[complaint.category] || complaint.category}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Submitted By</p>
                <span className="flex items-center gap-1 text-slate-600">
                  <User size={12} /> {complaint.submittedBy?.name}
                </span>
              </div>
              {complaint.assignedTo && (
                <div>
                  <p className="text-slate-400 text-xs mb-1">Assigned To</p>
                  <span className="flex items-center gap-1 text-slate-600">
                    <User size={12} /> {complaint.assignedTo.name}
                  </span>
                </div>
              )}
              <div>
                <p className="text-slate-400 text-xs mb-1">Created</p>
                <span className="flex items-center gap-1 text-slate-600">
                  <Calendar size={12} /> {formatDateTime(complaint.createdAt)}
                </span>
              </div>
              {complaint.resolvedAt && (
                <div>
                  <p className="text-slate-400 text-xs mb-1">Resolved</p>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Calendar size={12} /> {formatDateTime(complaint.resolvedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
