// Frontend/src/components/Theater/SocialLinksManager.tsx
import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTelegram, FaTiktok, FaSave, FaTrash } from 'react-icons/fa';
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

const SocialLinksManager: React.FC<{ theaterId: string }> = ({ theaterId }) => {
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null,
        youtube: null,
        telegram: null,
        tiktok: null
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSocialLinks();
    }, [theaterId]);

    const fetchSocialLinks = async () => {
        const { data, error } = await supabase
            .from('theaters')
            .select('social_links')
            .eq('id', theaterId)
            .single();

        if (!error && data?.social_links) {
            setSocialLinks(data.social_links);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        const { error } = await supabase
            .from('theaters')
            .update({ social_links: socialLinks })
            .eq('id', theaterId);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to save social links' });
        } else {
            setMessage({ type: 'success', text: 'Social links saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        }
        setSaving(false);
    };

    const handleChange = (platform: keyof SocialLinks, value: string) => {
        setSocialLinks(prev => ({ ...prev, [platform]: value || null }));
    };

    const handleClear = (platform: keyof SocialLinks) => {
        setSocialLinks(prev => ({ ...prev, [platform]: null }));
    };

    const socialFields = [
        { key: 'facebook', label: 'Facebook', icon: FaFacebook, placeholder: 'https://facebook.com/your-theater', color: 'text-[#1877F2]' },
        { key: 'twitter', label: 'Twitter', icon: FaTwitter, placeholder: 'https://twitter.com/your-theater', color: 'text-[#1DA1F2]' },
        { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/your-theater', color: 'text-[#E4405F]' },
        { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, placeholder: 'https://linkedin.com/company/your-theater', color: 'text-[#0A66C2]' },
        { key: 'youtube', label: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/c/your-theater', color: 'text-[#FF0000]' },
        { key: 'telegram', label: 'Telegram', icon: FaTelegram, placeholder: 'https://t.me/your-theater', color: 'text-[#0088cc]' },
        { key: 'tiktok', label: 'TikTok', icon: FaTiktok, placeholder: 'https://tiktok.com/@your-theater', color: 'text-[#000000]' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Social Media Links</h2>
            <p className="text-gray-600 mb-6">
                Add your theater's social media links. These will appear on your theater's contact page.
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
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={value}
                                        onChange={(e) => handleChange(field.key as keyof SocialLinks, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                    {value && (
                                        <button
                                            onClick={() => handleClear(field.key as keyof SocialLinks)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
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
                    {saving ? 'Saving...' : 'Save Social Links'}
                </button>
                
                {message && (
                    <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Preview:</h3>
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

export default SocialLinksManager;