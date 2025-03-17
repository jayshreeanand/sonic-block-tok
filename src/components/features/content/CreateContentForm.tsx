import React, { useState } from 'react';

interface CreateContentFormProps {
  onSubmit: (data: ContentFormData) => void;
}

export interface ContentFormData {
  title: string;
  description: string;
  topic: string;
  style: string;
  platforms: string[];
  isNFT: boolean;
}

const CreateContentForm: React.FC<CreateContentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    topic: '',
    style: 'educational',
    platforms: [],
    isNFT: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
          Topic
        </label>
        <input
          type="text"
          id="topic"
          value={formData.topic}
          onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <select
          value={formData.style}
          onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="educational">Educational</option>
          <option value="entertainment">Entertainment</option>
          <option value="promotional">Promotional</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Platforms</label>
        <div className="mt-2 space-y-2">
          {['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Twitter'].map((platform) => (
            <label key={platform} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.platforms.includes(platform)}
                onChange={() => handlePlatformToggle(platform)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isNFT"
          checked={formData.isNFT}
          onChange={(e) => setFormData(prev => ({ ...prev, isNFT: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isNFT" className="ml-2 block text-sm text-gray-700">
          Mint as NFT
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Content
        </button>
      </div>
    </form>
  );
};

export default CreateContentForm; 