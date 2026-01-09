
import React from 'react';
import { Users, Shield, Clock, ShieldCheck, Mail, MoreVertical, HardDriveDownload } from 'lucide-react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  onBackup?: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onBackup }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Team Control</h2>
          <p className="text-slate-500 text-sm">Manage employee access and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onBackup}
            className="bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center space-x-2 border border-emerald-100"
          >
            <HardDriveDownload size={18} />
            <span>Full SQL Backup</span>
          </button>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center space-x-2">
            <ShieldCheck size={18} />
            <span>Define New Role</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{user.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                      user.role === UserRole.ADMIN ? 'bg-red-100 text-red-600' : 
                      user.role === UserRole.ORDER_RECEIVER ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">ID: {user.id}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-900">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-slate-500">
                <Shield size={16} />
                <span className="text-xs font-medium">Full System Access</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Clock size={16} />
                <span className="text-xs font-medium">Last active 2h ago</span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold transition-all">
                Edit Permissions
              </button>
              <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold transition-all">
                Activity Log
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mt-8">
        <div className="flex items-start space-x-4">
          <Shield className="text-amber-600 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-amber-900">Security Recommendation</h4>
            <p className="text-sm text-amber-700 mt-1">
              Ensure all users have unique login credentials. Multi-role access should be audited monthly to prevent unauthorized financial adjustments. Admin users have permission to delete order history—exercise caution. Always download a backup before performing mass inventory updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
