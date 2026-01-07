import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, MessageCircle, Send, Mail, Phone, Save, Loader2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export interface HireMeData {
  whatsapp: string | null;
  messenger: string | null;
  telegram: string | null;
  contactEmail: string | null;
}

interface ShowHireMeDialogProps {
  open: boolean;
  onClose: () => void;
  isOwnProfile: boolean;
  initialData: HireMeData;
  onSave: (data: HireMeData) => Promise<void>;
  ownerName: string;
}

const ShowHireMeDialog: React.FC<ShowHireMeDialogProps> = ({
  open,
  onClose,
  isOwnProfile,
  initialData,
  onSave,
  ownerName,
}) => {
  const [formData, setFormData] = useState<HireMeData>(initialData);
  const [loading, setLoading] = useState(false);

  // Sync state when dialog opens
  useEffect(() => {
    if (open) {
      setFormData(initialData || { whatsapp: "", messenger: "", telegram: "", contactEmail: "" });
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = (type: string, value: string | null) => {
    if (!value) return toast.error(`${type} info not added by user.`);
    
    let url = "";
    switch (type) {
      case "WhatsApp":
        // Remove special chars for WA link
        url = `https://wa.me/${value.replace(/[^0-9]/g, "")}`; 
        break;
      case "Messenger":
        // Assuming username or ID
        url = `https://m.me/${value}`;
        break;
      case "Telegram":
        url = `https://t.me/${value.replace("@", "")}`;
        break;
      case "Email":
        url = `mailto:${value}`;
        break;
    }
    window.open(url, "_blank");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#1F1D47] rounded-2xl border border-white/10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
          
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="text-pink-500" /> 
              {isOwnProfile ? "Edit Contact Info" : `Hire ${ownerName}`}
            </h2>
            <Dialog.Close className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </Dialog.Close>
          </div>

          {isOwnProfile ? (
            /* --- EDIT MODE (For Owner) --- */
            <div className="space-y-4">
              <p className="text-gray-400 text-sm mb-2">
                Add your direct contact details so people can hire you easily.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase flex items-center gap-2">
                  <Phone size={14} className="text-green-400"/> WhatsApp Number (with Country Code)
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp || ""}
                  onChange={handleChange}
                  placeholder="e.g. 8801711223344"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase flex items-center gap-2">
                  <MessageCircle size={14} className="text-blue-500"/> Messenger Username
                </label>
                <input
                  type="text"
                  name="messenger"
                  value={formData.messenger || ""}
                  onChange={handleChange}
                  placeholder="e.g. antor.hawlader"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase flex items-center gap-2">
                  <Send size={14} className="text-cyan-400"/> Telegram Username
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram || ""}
                  onChange={handleChange}
                  placeholder="e.g. antor_dev"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase flex items-center gap-2">
                  <Mail size={14} className="text-red-400"/> Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail || ""}
                  onChange={handleChange}
                  placeholder="e.g. business@example.com"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
                />
              </div>

              <button
                onClick={handleSaveClick}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Details
              </button>
            </div>
          ) : (
            /* --- VIEW MODE (For Visitors) --- */
            <div className="grid gap-3">
              {(!initialData.whatsapp && !initialData.messenger && !initialData.telegram && !initialData.contactEmail) && (
                <p className="text-center text-gray-400 py-4">
                  This user hasn't added any direct contact info yet.
                </p>
              )}

              {initialData.whatsapp && (
                <button
                  onClick={() => handleContactClick("WhatsApp", initialData.whatsapp)}
                  className="flex items-center justify-between w-full bg-[#2A284D] hover:bg-[#25D366] hover:text-white group border border-white/5 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#25D366] group-hover:bg-white/20 p-2 rounded-full text-white">
                      <Phone size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">WhatsApp</h3>
                      <p className="text-xs text-gray-400 group-hover:text-white/80">Chat instantly</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-gray-500 group-hover:text-white" />
                </button>
              )}

              {initialData.messenger && (
                <button
                  onClick={() => handleContactClick("Messenger", initialData.messenger)}
                  className="flex items-center justify-between w-full bg-[#2A284D] hover:bg-[#0084FF] hover:text-white group border border-white/5 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0084FF] group-hover:bg-white/20 p-2 rounded-full text-white">
                      <MessageCircle size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Messenger</h3>
                      <p className="text-xs text-gray-400 group-hover:text-white/80">Connect on Facebook</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-gray-500 group-hover:text-white" />
                </button>
              )}

              {initialData.telegram && (
                <button
                  onClick={() => handleContactClick("Telegram", initialData.telegram)}
                  className="flex items-center justify-between w-full bg-[#2A284D] hover:bg-[#0088cc] hover:text-white group border border-white/5 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0088cc] group-hover:bg-white/20 p-2 rounded-full text-white">
                      <Send size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Telegram</h3>
                      <p className="text-xs text-gray-400 group-hover:text-white/80">Send a message</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-gray-500 group-hover:text-white" />
                </button>
              )}

              {initialData.contactEmail && (
                <button
                  onClick={() => handleContactClick("Email", initialData.contactEmail)}
                  className="flex items-center justify-between w-full bg-[#2A284D] hover:bg-[#EA4335] hover:text-white group border border-white/5 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EA4335] group-hover:bg-white/20 p-2 rounded-full text-white">
                      <Mail size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-xs text-gray-400 group-hover:text-white/80">Send an email</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-gray-500 group-hover:text-white" />
                </button>
              )}
            </div>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShowHireMeDialog;