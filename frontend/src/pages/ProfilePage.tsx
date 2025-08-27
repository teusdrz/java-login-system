import React, { useState } from 'react';
import { User, Mail, Shield, Edit, Lock, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingButton } from '../components/Loading';

/**
 * ProfilePage Component - Página "Meu Perfil" conforme especificação
 * Apresenta nome e e-mail em card elegante
 * Inclui botões para "Editar Perfil" e "Alterar Senha"
 * Formulário de edição em seção expansível
 */
const ProfilePage: React.FC = () => {
    const { state } = useAuth();
    const { showToast } = useToast();

    // State para controlar modo de edição
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // State do perfil
    const [profileData, setProfileData] = useState({
        name: state.user?.username || '',
        email: state.user?.email || '',
        username: state.user?.username || ''
    });

    // State para mudança de senha
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    /**
     * Handle profile update
     */
    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            // Simular atualização do perfil
            await new Promise(resolve => setTimeout(resolve, 1000));

            showToast({
                type: 'success',
                title: 'Profile Updated',
                message: 'Your profile has been updated successfully'
            });

            setIsEditingProfile(false);
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update profile. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle password change
     */
    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast({
                type: 'error',
                title: 'Password Mismatch',
                message: 'New passwords do not match'
            });
            return;
        }

        setLoading(true);
        try {
            // Simular mudança de senha
            await new Promise(resolve => setTimeout(resolve, 1000));

            showToast({
                type: 'success',
                title: 'Password Changed',
                message: 'Your password has been changed successfully'
            });

            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Password Change Failed',
                message: 'Failed to change password. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <p className="mt-2 text-gray-400">Manage your account settings and preferences</p>
                </div>

                {/* Profile Card elegante conforme especificação */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">

                    {/* Profile Header */}
                    <div className="px-6 py-8 bg-gradient-to-r from-primary-600 to-primary-700">
                        <div className="flex items-center">
                            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="h-10 w-10 text-white" />
                            </div>
                            <div className="ml-6">
                                <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
                                <p className="text-primary-100">{profileData.email}</p>
                                <div className="flex items-center mt-2 text-primary-200">
                                    <Shield className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{state.user?.role || 'User'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6">

                        {/* Profile Information */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                                {!isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {!isEditingProfile ? (
                                // Profile Display
                                <div className="space-y-4">
                                    <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
                                        <User className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-400">Full Name</p>
                                            <p className="text-white">{profileData.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
                                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-400">Email Address</p>
                                            <p className="text-white">{profileData.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Profile Edit Form - Seção expansível conforme especificação
                                <div className="space-y-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <LoadingButton
                                            onClick={handleUpdateProfile}
                                            loading={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-all duration-200"
                                        >
                                            <Save className="h-4 w-4 mr-1" />
                                            Save Changes
                                        </LoadingButton>
                                        <button
                                            onClick={() => setIsEditingProfile(false)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-all duration-200"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Password Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Password & Security</h3>
                                {!isChangingPassword && (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        <Lock className="h-4 w-4 mr-1" />
                                        Change Password
                                    </button>
                                )}
                            </div>

                            {!isChangingPassword ? (
                                <div className="p-4 bg-gray-700/50 rounded-lg">
                                    <p className="text-gray-400">Password last changed: Never</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Keep your account secure by using a strong password
                                    </p>
                                </div>
                            ) : (
                                // Password Change Form - Seção expansível conforme especificação
                                <div className="space-y-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <LoadingButton
                                            onClick={handleChangePassword}
                                            loading={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-all duration-200"
                                        >
                                            <Lock className="h-4 w-4 mr-1" />
                                            Change Password
                                        </LoadingButton>
                                        <button
                                            onClick={() => setIsChangingPassword(false)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-all duration-200"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
