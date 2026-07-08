'use client';

import { Users, Plus } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">User Management</h1>
          <p className="text-slate-400">Manage administrator accounts and team access.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all cursor-not-allowed opacity-75">
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-12 backdrop-blur-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
          <Users className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">User Management Pending</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          The user management dashboard is part of the next development phase. You will be able to manage admin credentials and roles here.
        </p>
      </div>
    </div>
  );
}
