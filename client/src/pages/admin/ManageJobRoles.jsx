import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Save, Layers } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ManageJobRoles = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skillsString, setSkillsString] = useState('');

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/job-roles');
      if (res.data.success) {
        setJobRoles(res.data.data.jobRoles || []);
      }
    } catch (err) {
      toast.error('Failed to load job roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setName(role.name);
      setDescription(role.description || '');
      setSkillsString((role.skills || []).join(', '));
    } else {
      setEditingRole(null);
      setName('');
      setDescription('');
      setSkillsString('');
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const skills = skillsString.split(',').map((s) => s.trim()).filter(Boolean);
      if (editingRole) {
        await api.put(`/admin/job-roles/${editingRole._id}`, { name, description, skills });
        toast.success('Job role updated');
      } else {
        await api.post('/admin/job-roles', { name, description, skills });
        toast.success('Job role created');
      }
      setModalOpen(false);
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job role?')) return;
    try {
      await api.delete(`/admin/job-roles/${id}`);
      toast.success('Job role deleted');
      fetchRoles();
    } catch (err) {
      toast.error('Failed to delete job role');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Roles Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define roles, required skills, and core engineering tracks.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" icon={Plus}>
          Add Job Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobRoles.map((role) => (
          <Card key={role._id} className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{role.name}</h3>
                <Badge variant={role.isActive ? 'primary' : 'default'} size="sm">
                  {role.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                {role.description || 'Core engineering role track.'}
              </p>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Associated Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role.skills?.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleOpenModal(role)}
                className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit Role"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(role._id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Delete Role"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRole ? 'Edit Job Role' : 'Create Job Role'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cloud Security Architect"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsibilities and domain expectations..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Key Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              placeholder="AWS, Docker, Terraform, Kubernetes"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Save}>
              Save Job Role
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
