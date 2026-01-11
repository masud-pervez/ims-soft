import React, { useState } from "react";
import {
  Users,
  Shield,
  Clock,
  ShieldCheck,
  Mail,
  MoreVertical,
  HardDriveDownload,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { User, UserRole } from "../types";
import {
  useBackup,
  useUsers,
  useDeleteUser,
  useUpdateUserPermissions,
} from "../hooks/useQueries";

const PERMISSIONS_LIST = [
  "view_dashboard",
  "manage_orders",
  "manage_products",
  "view_reports",
  "manage_users",
  "manage_settings",
];

const UserManagement: React.FC = () => {
  const { data: users = [], isLoading } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const updatePermissionsMutation = useUpdateUserPermissions();
  const backup = useBackup();
  const onBackup = () => backup.mutate();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissionsToEdit, setPermissionsToEdit] = useState<string[]>([]);

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setPermissionsToEdit(user.permissions || []);
    setIsPermissionModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const savePermissions = () => {
    if (selectedUser) {
      updatePermissionsMutation.mutate({
        id: selectedUser.id,
        permissions: permissionsToEdit,
      });
      setIsPermissionModalOpen(false);
      setSelectedUser(null);
    }
  };

  const togglePermission = (permission: string) => {
    if (permissionsToEdit.includes(permission)) {
      setPermissionsToEdit(permissionsToEdit.filter((p) => p !== permission));
    } else {
      setPermissionsToEdit([...permissionsToEdit, permission]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Team Control</h2>
          <p className="text-slate-500 text-sm">
            Manage employee access and permissions
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onBackup}
            disabled={backup.isPending}
            className="bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center space-x-2 border border-emerald-100 disabled:opacity-50"
          >
            <HardDriveDownload size={18} />
            <span>
              {backup.isPending ? "Backing up..." : "Full SQL Backup"}
            </span>
          </button>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center space-x-2">
            <ShieldCheck size={18} />
            <span>Define New Role</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{user.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                        user.role === UserRole.ADMIN
                          ? "bg-red-100 text-red-600"
                          : user.role === UserRole.ORDER_RECEIVER
                          ? "bg-blue-100 text-blue-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ID: {user.id}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete User"
                >
                  <Trash2 size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-900">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-slate-500">
                <Shield size={16} />
                <span className="text-xs font-medium">
                  {user.permissions?.length
                    ? `${user.permissions.length} Permissions`
                    : "No specific permissions"}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Clock size={16} />
                <span className="text-xs font-medium">
                  Last active {user.lastLogin || "Never"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEditPermissions(user)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold transition-all"
              >
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
            <h4 className="font-bold text-amber-900">
              Security Recommendation
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              Ensure all users have unique login credentials. Multi-role access
              should be audited monthly to prevent unauthorized financial
              adjustments. Admin users have permission to delete order
              history—exercise caution. Always download a backup before
              performing mass inventory updates.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Modal */}
      {isPermissionModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Permissions
                </h3>
                <p className="text-sm text-slate-500">
                  For {selectedUser.name}
                </p>
              </div>
              <button
                onClick={() => setIsPermissionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {PERMISSIONS_LIST.map((permission) => (
                <label
                  key={permission}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        permissionsToEdit.includes(permission)
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-slate-300 bg-white group-hover:border-indigo-400"
                      }`}
                    >
                      {permissionsToEdit.includes(permission) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {permission.replace(/_/g, " ")}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex space-x-3">
              <button
                onClick={() => setIsPermissionModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={savePermissions}
                disabled={updatePermissionsMutation.isPending}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {updatePermissionsMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Delete User?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-700">
                  {selectedUser.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-70"
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
