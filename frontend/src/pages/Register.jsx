import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Shield, Mail, Lock, User, Phone, Building } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', department: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">CMS Portal</h1>
          <p className="text-slate-400 mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className="input-field pl-9" placeholder="John Doe"
                  value={form.name} onChange={update('name')} required />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" className="input-field pl-9" placeholder="you@example.com"
                  value={form.email} onChange={update('email')} required />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" className="input-field pl-9" placeholder="Min 6 characters"
                  value={form.password} onChange={update('password')} required minLength={6} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" className="input-field pl-9" placeholder="Phone no."
                    value={form.phone} onChange={update('phone')} />
                </div>
              </div>
              <div>
                <label className="label">Department</label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" className="input-field pl-9" placeholder="Dept."
                    value={form.department} onChange={update('department')} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary justify-center py-2.5 text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
