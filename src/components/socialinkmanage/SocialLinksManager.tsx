// src/components/socialinkmanage/SocialLinksManager.tsx
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

interface SocialLinksManagerProps {
  theaterId: string;
  onClose?: () => void;
}

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ theaterId, onClose }) => {
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

  // Fetch social links for this specific theater
  useEffect(() => {
    if (theaterId) {
      fetchSocialLinks();
    }
  }, [theaterId]);

  const fetchSocialLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('theaters')
        .select('social_links')
        .eq('id', theaterId)
        .single();

      if (error) {
        console.error('Error fetching social links:', error);
        setSocialLinks({
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          telegram: '',
          tiktok: ''
        });
      } else if (data && data.social_links) {
        setSocialLinks(data.social_links);
      } else {
        setSocialLinks({
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          telegram: '',
          tiktok: ''
        });
      }
    } catch (error) {
      console.error('Error in fetchSocialLinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!theaterId) {
      setMessage({ type: 'error', text: 'No theater selected' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const cleanedLinks: SocialLinks = {
      facebook: null,
      twitter: null,
      instagram: null,
      linkedin: null,
      youtube: null,
      telegram: null,
      tiktok: null
    };
    
    Object.keys(socialLinks).forEach(key => {
      const value = socialLinks[key as keyof SocialLinks];
      if (value && value.trim() !== '') {
        cleanedLinks[key as keyof SocialLinks] = value.trim();
      }
    });

    try {
      const { error } = await supabase
        .from('theaters')
        .update({ 
          social_links: cleanedLinks,
          updated_at: new Date().toISOString()
        })
        .eq('id', theaterId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Social links saved successfully!' });
      
      // Auto close after 2 seconds on success
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('Error saving social links:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save social links' });
    } finally {
      setSaving(false);
    }
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
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
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Social Media Links</h2>
            <p className="text-teal-100 text-sm mt-0.5">
              Manage your theater's social media presence
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FaGlobe className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Social Media Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add your social media links below. These will appear on your theater's contact page.
                Only platforms with valid URLs will be displayed to your customers.
              </p>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Social Links Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {socialFields.map((field) => {
            const Icon = field.icon;
            const value = socialLinks[field.key as keyof SocialLinks] || '';
            
            return (
              <div key={field.key} className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <div className={`p-1 rounded-lg bg-gray-100 ${field.color}`}>
                    <Icon className="h-3.5 w-3.5" />
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                    />
                  </div>
                  {value && (
                    <button
                      onClick={() => handleClear(field.key as keyof SocialLinks)}
                      className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200"
                      title="Clear"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button - Only save button, no close button */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-medium"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="h-4 w-4" />
                Save Social Links
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialLinksManager;