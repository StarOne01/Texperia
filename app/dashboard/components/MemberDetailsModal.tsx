import { useState, useEffect } from 'react';

// Updated TeamMember type to match the one in page.tsx
export type TeamMember = {
  id: string;
  email: string;
  name?: string;
  role: 'leader' | 'member';
  department?: string;
  skills?: string[];
  phone?: string;
  position?: string;
  bio?: string;
  status?: 'active' | 'invited' | 'pending';
  joinedAt?: string;
};

interface MemberDetailsModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: TeamMember) => Promise<void>;
}

export default function MemberDetailsModal({ 
  member, 
  isOpen, 
  onClose, 
  onSave 
}: MemberDetailsModalProps) {
  const [editedMember, setEditedMember] = useState<TeamMember | null>(null);
  const [skillInput, setSkillInput] = useState('');
  
  useEffect(() => {
    if (member) {
      setEditedMember({ ...member });
    }
  }, [member]);

  if (!isOpen || !editedMember) return null;

  const handleSkillAdd = () => {
    if (skillInput.trim()) {
      setEditedMember({
        ...editedMember,
        skills: [...(editedMember.skills || []), skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setEditedMember({
      ...editedMember,
      skills: editedMember.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 rounded-xl p-6 w-full max-w-lg border border-blue-500/30 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-blue-300 mb-4">
          {member?.name ? `Edit ${member.name}'s Details` : 'Edit Member Details'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-blue-300 text-sm mb-1">Name</label>
            <input
              type="text"
              value={editedMember.name || ''}
              onChange={(e) => setEditedMember({...editedMember, name: e.target.value})}
              className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:border-blue-400"
              placeholder="Full name"
            />
          </div>
          
          <div>
            <label className="block text-blue-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={editedMember.email}
              readOnly
              className="w-full bg-blue-900/40 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 opacity-70"
            />
          </div>
          
          <div>
            <label className="block text-blue-300 text-sm mb-1">Department</label>
            <input
              type="text"
              value={editedMember.department || ''}
              onChange={(e) => setEditedMember({...editedMember, department: e.target.value})}
              className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:border-blue-400"
              placeholder="e.g. Engineering"
            />
          </div>
          
          <div>
            <label className="block text-blue-300 text-sm mb-1">Position</label>
            <input
              type="text"
              value={editedMember.position || ''}
              onChange={(e) => setEditedMember({...editedMember, position: e.target.value})}
              className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:border-blue-400"
              placeholder="e.g. Frontend Developer"
            />
          </div>
          
          <div>
            <label className="block text-blue-300 text-sm mb-1">Phone</label>
            <input
              type="tel"
              value={editedMember.phone || ''}
              onChange={(e) => setEditedMember({...editedMember, phone: e.target.value})}
              className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:border-blue-400"
              placeholder="Contact number"
            />
          </div>
          
          <div>
            <label className="block text-blue-300 text-sm mb-1">Bio</label>
            <textarea
              value={editedMember.bio || ''}
              onChange={(e) => setEditedMember({...editedMember, bio: e.target.value})}
              className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:border-blue-400 min-h-[80px]"
              placeholder="Brief introduction"
            />
          </div>
          
          <div>
            <label className="block text-blue-300 text-sm mb-1">Skills</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {editedMember.skills?.map((skill) => (
                <div key={skill} className="bg-blue-800/50 text-blue-200 px-2 py-1 text-xs rounded-lg flex items-center gap-2">
                  {skill}
                  <button 
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="text-blue-300 hover:text-blue-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-grow bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-sm text-blue-200 focus:outline-none focus:border-blue-400"
                placeholder="Add a skill"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSkillAdd();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-blue-500/30 text-blue-300 hover:bg-blue-900/20 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}