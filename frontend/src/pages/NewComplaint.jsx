import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintAPI } from '../services/api'
import { categoryLabels } from '../utils/helpers'
import toast from 'react-hot-toast'
import { ArrowLeft, Send } from 'lucide-react'

export default function NewComplaint() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: complaintAPI.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      toast.success(`Complaint ${data.complaintNumber} submitted!`)
      navigate(`/complaints/${data.id}`)
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.category) return toast.error('Please select a category')
    mutation.mutate(form)
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/complaints" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">New Complaint</h1>
          <p className="text-sm text-slate-500 mt-0.5">Fill in the details below</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Title <span className="text-red-500">*</span></label>
            <input type="text" className="input-field"
              placeholder="Brief summary of your complaint"
              value={form.title} onChange={update('title')} required maxLength={200} />
          </div>

          <div>
            <label className="label">Description <span className="text-red-500">*</span></label>
            <textarea className="input-field resize-none" rows={5}
              placeholder="Provide detailed information about your complaint..."
              value={form.description} onChange={update('description')} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category <span className="text-red-500">*</span></label>
              <select className="input-field" value={form.category} onChange={update('category')} required>
                <option value="">Select category</option>
                {Object.entries(categoryLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input-field" value={form.priority} onChange={update('priority')}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Priority helper */}
          <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Priority Guide</p>
            <ul className="space-y-0.5 text-xs">
              <li><span className="font-medium text-slate-500">Low</span> — Minor inconvenience, can wait</li>
              <li><span className="font-medium text-blue-600">Medium</span> — Affects work but has workarounds</li>
              <li><span className="font-medium text-orange-600">High</span> — Significant impact on operations</li>
              <li><span className="font-medium text-red-600">Critical</span> — System down, business blocked</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link to="/complaints" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              <Send size={16} />
              {mutation.isPending ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
