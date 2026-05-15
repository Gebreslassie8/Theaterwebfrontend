// src/pages/Admin/settings/AdminSocialLinksManager.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, 
  FaYoutube, FaTelegram, FaTiktok, FaSave, FaGlobe 
} from 'react-icons/fa';
import { Save, Globe, CheckCircle, AlertCircle, X } from 'lucide-react';
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
    const cleanedLinks: SocialLinks = {} as SocialLinks;
    Object.keys(socialLinks).forEach(key => {
      const value = socialLinks[key as keyof SocialLinks];
      if (value && value.trim() !== '') {
        cleanedLinks[key as keyof SocialLinks] = value;
      } else {
        cleanedLinks[key as keyof SocialLinks] = null;
      }
    });

    const { error } = await supabase
      .from('system_settings')
      .upsert({
        setting_key: 'admin_social_links',
        setting_value: cleanedLinks,
        description: 'Admin/Global social media links shown on contact page',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'setting_key'
      });

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
    if (message) setMessage(null);
  };

  const handleClear = (platform: keyof SocialLinks) => {
    setSocialLinks(prev => ({ ...prev, [platform]: '' }));
  };

  const socialFields = [
    { key: 'facebook', label: 'Facebook', icon: FaFacebook, placeholder: 'https://facebook.com/your-page', color: 'text-[#1877F2]', bgClass: 'bg-[#1877F2]' },
    { key: 'twitter', label: 'Twitter', icon: FaTwitter, placeholder: 'https://twitter.com/your-handle', color: 'text-[#1DA1F2]', bgClass: 'bg-[#1DA1F2]' },
    { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/your-profile', color: 'text-[#E4405F]', bgClass: 'bg-[#E4405F]' },
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, placeholder: 'https://linkedin.com/company/your-company', color: 'text-[#0A66C2]', bgClass: 'bg-[#0A66C2]' },
    { key: 'youtube', label: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/c/your-channel', color: 'text-[#FF0000]', bgClass: 'bg-[#FF0000]' },
    { key: 'telegram', label: 'Telegram', icon: FaTelegram, placeholder: 'https://t.me/your-channel', color: 'text-[#0088cc]', bgClass: 'bg-[#0088cc]' },
    { key: 'tiktok', label: 'TikTok', icon: FaTiktok, placeholder: 'https://tiktok.com/@your-handle', color: 'text-[#000000]', bgClass: 'bg-[#000000]' }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading social links...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-white to-teal-100/40 rounded-2xl shadow-xl border border-teal-200 overflow-hidden"   >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Globe className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Global Social Media Links</h2>
              <p className="text-purple-100 text-sm mt-1">
                Manage your official social media presence across all platforms
              </p>
            </div>
          </div>
          {message && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                : 'bg-red-500/20 text-red-100 border border-red-400/30'
            }`}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Info Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaGlobe className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Social Media Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add your social media links below. These will appear on the contact page when users select "Admin" as recipient.
                Only platforms with valid URLs will be displayed to your customers.
              </p>
            </div>
          </div>
        </div>

        {/* Social Links Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {socialFields.map((field) => {
            const Icon = field.icon;
            const value = socialLinks[field.key as keyof SocialLinks] || '';
            
            return (
              <div key={field.key} className="group">
                <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 mb-2">
                  <div className={`p-1.5 rounded-lg bg-gray-100 ${field.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {field.label}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={value}
                      onChange={(e) => handleChange(field.key as keyof SocialLinks, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                    />
                  </div>
                  {value && (
                    <button
                      onClick={() => handleClear(field.key as keyof SocialLinks)}
                      className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center gap-2 group"
                      title="Clear"
                    >
                      <X className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                      <span className="text-sm hidden sm:inline">Clear</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Changes take effect immediately
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <FaSave className="h-4 w-4" />
                Save All Social Links
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSocialLinksManager;