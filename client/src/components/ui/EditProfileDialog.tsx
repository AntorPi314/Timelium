import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Save, UserRoundPen, Upload, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
// Import Country and City from the package
import { Country, City } from "country-state-city";
import { type HireMeData } from "./ShowHireMeDialog";

export interface UserProfileData {
  avatar: string | null;
  name: string | null;
  title: string | null;
  location: string | null;
  about: string | null;
  linkedin: string | null;
  youtube: string | null;
  github: string | null;
  facebook: string | null;
  hireMe?: HireMeData;
}

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  profileData: UserProfileData;
  onSave: (data: UserProfileData) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onClose,
  profileData,
  onSave,
}) => {
  const [editForm, setEditForm] = useState<UserProfileData>(profileData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // --- LOCATION STATES ---
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // We store ISO Code for logic (e.g. 'BD'), but save Name in DB (e.g. 'Bangladesh')
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

  // 1. Initial Load: Setup Countries & Parse Existing Location
  useEffect(() => {
    if (open) {
      setEditForm(profileData);
      setPreviewUrl(profileData.avatar);
      setSelectedFile(null);

      // Get all countries from the package
      const allCountries = Country.getAllCountries();
      setCountries(allCountries);

      // Parse existing location string "City, Country"
      if (profileData.location && profileData.location.includes(",")) {
        const parts = profileData.location.split(",");
        // format assumption: "Dhaka, Bangladesh"
        const existingCity = parts[0].trim();
        const existingCountryName = parts[1].trim();

        // Find country object to get the ISO Code (needed for city list)
        const matchedCountry = allCountries.find(
          (c) => c.name === existingCountryName
        );

        if (matchedCountry) {
          setSelectedCountryCode(matchedCountry.isoCode);
          setSelectedCityName(existingCity);
        } else {
          // Reset if no match found
          setSelectedCountryCode("");
          setSelectedCityName("");
        }
      } else {
        setSelectedCountryCode("");
        setSelectedCityName("");
      }
    }
  }, [open, profileData]);

  // 2. Fetch Cities when Country Code changes
  useEffect(() => {
    if (selectedCountryCode) {
      const countryCities = City.getCitiesOfCountry(selectedCountryCode);
      setCities(countryCities || []);

      // If the currently selected city is not in the new list (e.g. changed country), reset city
      // Unless it's the initial load where we want to keep it.
      // Simple check: see if selectedCityName exists in the new list
      const cityExists = countryCities?.some(
        (c) => c.name === selectedCityName
      );
      if (!cityExists && selectedCityName) {
        // If we changed country manually, clear the city.
        // But logic needs to be careful not to clear on initial load.
        // For simplicity: We will rely on user selecting a new city if they change country.
        setSelectedCityName("");
      }
    } else {
      setCities([]);
    }
  }, [selectedCountryCode]);

  // 3. Update the main editForm location string whenever Country or City changes
  useEffect(() => {
    // Find Country Name from Code
    const countryObj = countries.find((c) => c.isoCode === selectedCountryCode);
    const countryName = countryObj ? countryObj.name : "";

    if (countryName && selectedCityName) {
      setEditForm((prev) => ({
        ...prev,
        location: `${selectedCityName}, ${countryName}`,
      }));
    } else if (countryName) {
      // Only country selected
      setEditForm((prev) => ({ ...prev, location: countryName }));
    }
  }, [selectedCountryCode, selectedCityName, countries]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountryCode(e.target.value);
    setSelectedCityName(""); // Reset city when country changes
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCityName(e.target.value);
  };

  const handleSaveClick = async () => {
    setUploading(true);
    let finalAvatarUrl = editForm.avatar;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to update profile");
        setUploading(false);
        return;
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await axios.post(
          `${API_URL}/users/upload-avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        finalAvatarUrl = uploadRes.data.url;
      }

      const updatedData = { ...editForm, avatar: finalAvatarUrl };
      onSave(updatedData);
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image or save profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-[#1F1D47] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#2A284D] shrink-0">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
              <UserRoundPen size={20} className="text-pink-500" /> Edit Profile
            </Dialog.Title>
            <Dialog.Description className="hidden">
              Update your profile information
            </Dialog.Description>
            <Dialog.Close className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </Dialog.Close>
          </div>

          {/* SCROLLABLE CONTENT AREA */}
          {/* FIX: pb-24 ensures the bottom content is not hidden behind the save button/modal edge */}
          <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-transparent flex-1 pb-24">
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group w-24 h-24">
                <img
                  src={previewUrl || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-pink-500"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
                >
                  <Upload className="text-white w-6 h-6" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <p className="text-xs text-gray-400">Click image to change</p>
            </div>

            {/* Image Upload Area এর ঠিক নিচে এই অংশটুকু দিন */}

            {/* Username (Read Only) */}
            <div className="space-y-2 opacity-70 cursor-not-allowed">
              <label className="text-sm font-medium text-gray-400">
                Username
              </label>
              <div className="w-full bg-[#0F0E24]/50 border border-white/5 rounded-lg px-4 py-2 text-gray-500 text-sm">
                @{window.location.pathname.split("/").pop()}{" "}
                {/* URL থেকে ইউজারনেম নিচ্ছে */}
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2 opacity-70 cursor-not-allowed">
              <label className="text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="w-full bg-[#0F0E24]/50 border border-white/5 rounded-lg px-4 py-2 text-gray-500 text-sm">
                {JSON.parse(localStorage.getItem("user") || "{}").email ||
                  "N/A"}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={editForm.name || ""}
                onChange={handleInputChange}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Title / Designation
              </label>
              <input
                type="text"
                name="title"
                value={editForm.title || ""}
                onChange={handleInputChange}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Location (Country + City using package) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MapPin size={14} className="text-pink-400" /> Location
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Country Dropdown */}
                <select
                  value={selectedCountryCode}
                  onChange={handleCountrySelect}
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 appearance-none scrollbar-thin scrollbar-thumb-gray-600"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>

                {/* City Dropdown */}
                <select
                  value={selectedCityName}
                  onChange={handleCitySelect}
                  disabled={!selectedCountryCode}
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 appearance-none disabled:opacity-50 scrollbar-thin scrollbar-thumb-gray-600"
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* About */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">About</label>
              <textarea
                name="about"
                value={editForm.about || ""}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h4 className="text-pink-400 font-semibold text-sm">
                Social Links
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  name="linkedin"
                  value={editForm.linkedin || ""}
                  onChange={handleInputChange}
                  placeholder="LinkedIn URL"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="github"
                  value={editForm.github || ""}
                  onChange={handleInputChange}
                  placeholder="GitHub URL"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="text"
                  name="youtube"
                  value={editForm.youtube || ""}
                  onChange={handleInputChange}
                  placeholder="YouTube URL"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                />
                <input
                  type="text"
                  name="facebook"
                  value={editForm.facebook || ""}
                  onChange={handleInputChange}
                  placeholder="Facebook URL"
                  className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-white/10 bg-[#2A284D] flex justify-end gap-3 shrink-0">
            <Dialog.Close className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleSaveClick}
              disabled={uploading}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              {uploading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditProfileDialog;
