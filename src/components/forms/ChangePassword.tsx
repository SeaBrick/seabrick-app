import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (inputId: string) => {
    switch (inputId) {
      case 'current-password':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new-password':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm-password':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const getPasswordVisibilityIcon = (inputId: string) => {
    switch (inputId) {
      case 'current-password':
        return showCurrentPassword ? <EyeIcon className="h-6 w-6 text-gray-400" /> : <EyeSlashIcon className="h-6 w-6 text-gray-400" />;
      case 'new-password':
        return showNewPassword ? <EyeIcon className="h-6 w-6 text-gray-400" /> : <EyeSlashIcon className="h-6 w-6 text-gray-400" />;
      case 'confirm-password':
        return showConfirmPassword ? <EyeIcon className="h-6 w-6 text-gray-400" /> : <EyeSlashIcon className="h-6 w-6 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    
    <form className=" pb-6 max-w-[978px] w-full mx-auto flex flex-col gap-y-4">
      <h3 className="text-xl font-bold leading-6">Change Password</h3>
      <div className="mb-4">
        <label className="block text-[#333333] text-xs font-normal  mb-2" htmlFor="current-password">
          Current Password
        </label>
        <div className="relative">
          <input
            className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="current-password"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => togglePasswordVisibility('current-password')}
          >
            {getPasswordVisibilityIcon('current-password')}
          </div>
        </div>
      </div>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className="mb-4 md:w-1/2">
          <label className="block text-[#333333] text-xs font-normal  mb-2" htmlFor="new-password">
            New Password
          </label>
          <div className="relative">
            <input
              className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('new-password')}
            >
              {getPasswordVisibilityIcon('new-password')}
            </div>
          </div>
        </div>

        <div className="mb-4 md:w-1/2">
          <label className="block text-[#333333] text-xs font-normal  mb-2" htmlFor="confirm-password">
            Repeat New Password
          </label>
          <div className="relative">
            <input
              className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('confirm-password')}
            >
              {getPasswordVisibilityIcon('confirm-password')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          className="inline-flex items-center gap-2 rounded-md bg-[#2069a0] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
          type="button"
        >
          Change Password
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
