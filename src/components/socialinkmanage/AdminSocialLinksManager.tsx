// Frontend/src/components/Admin/AdminSocialLinksManager.tsx
import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTelegram, FaTiktok, FaSave } from 'react-icons/fa';
import supabase from "@/config/supabaseClient";

interface SocialLinks {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    telegram: string | null;
    tiktok: string | null;
}

const AdminSocialLinksManager: React.FC = () => {
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        telegram: '',
        tiktok: ''
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            const { data, error } = await supabase
                .from('system_settings')
                .select('setting_value')
                .eq('setting_key', 'admin_social_links')
                .single();

            if (error) throw error;
            
            if (data && data.setting_value) {
                setSocialLinks(data.setting_value);
            }
        } catch (error) {
            console.error('Error fetching admin social links:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        // Filter out empty values
        const cleanedLinks = Object.fromEntries(
            Object.entries(socialLinks).filter(([_, value]) => value && value.trim() !== '')
        );

        const { error } = await supabase
            .from('system_settings')
            .update({ 
                setting_value: cleanedLinks,
                updated_at: new Date().toISOString()
            })
            .eq('setting_key', 'admin_social_links');

        if (error) {
            setMessage({ type: 'error', text: 'Failed to save social links' });
        } else {
            setMessage({ type: 'success', text: 'Social links saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        }
        setSaving(false);
    };

    const handleChange = (platform: keyof SocialLinks, value: string) => {
        setSocialLinks(prev => ({ ...prev, [platform]: value }));
    };

    const socialFields = [
        { key: 'facebook', label: 'Facebook', icon: FaFacebook, placeholder: 'https://facebook.com/theaterhub', color: 'text-[#1877F2]' },
        { key: 'twitter', label: 'Twitter', icon: FaTwitter, placeholder: 'https://twitter.com/theaterhub', color: 'text-[#1DA1F2]' },
        { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/theaterhub', color: 'text-[#E4405F]' },
        { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, placeholder: 'https://linkedin.com/company/theaterhub', color: 'text-[#0A66C2]' },
        { key: 'youtube', label: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/theaterhub', color: 'text-[#FF0000]' },
        { key: 'telegram', label: 'Telegram', icon: FaTelegram, placeholder: 'https://t.me/theaterhub', color: 'text-[#0088cc]' },
        { key: 'tiktok', label: 'TikTok', icon: FaTiktok, placeholder: 'https://tiktok.com/@theaterhub', color: 'text-[#000000]' }
    ];

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-2">Global Social Media Links</h2>
            <p className="text-gray-600 mb-6">
                These social links will appear on the contact page when users select "Admin" as recipient.
            </p>

            <div className="space-y-4">
                {socialFields.map((field) => {
                    const Icon = field.icon;
                    const value = socialLinks[field.key as keyof SocialLinks] || '';
                    
                    return (
                        <div key={field.key} className="flex items-center gap-3">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 ${field.color}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                                <input
                                    type="url"
                                    value={value}
                                    onChange={(e) => handleChange(field.key as keyof SocialLinks, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                    <FaSave className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Global Social Links'}
                </button>
                
                {message && (
                    <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Preview (Admin Section):</h3>
                <div className="flex gap-3">
                    {socialFields.map((field) => {
                        const Icon = field.icon;
                        const hasLink = socialLinks[field.key as keyof SocialLinks];
                        if (!hasLink) return null;
                        return (
                            <a
                                key={field.key}
                                href={hasLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-10 h-10 flex items-center justify-center rounded-lg ${field.color} bg-gray-100 hover:scale-110 transition`}
                            >
                                <Icon className="h-5 w-5" />
                            </a>
                        );
                    })}
                </div>
                {socialFields.every(f => !socialLinks[f.key as keyof SocialLinks]) && (
                    <p className="text-gray-500 text-sm">No social links added yet</p>
                )}
            </div>
        </div>
    );
};

export default AdminSocialLinksManager;