import { useState } from 'react';

interface ContentFormProps {
  onSubmit: (data: {
    topic: string;
    tone: string;
    duration: number;
    isNFT: boolean;
  }) => Promise<void>;
  isGenerating: boolean;
  walletAddress: string | null;
}

export function ContentForm({ onSubmit, isGenerating, walletAddress }: ContentFormProps) {
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional',
    duration: 60,
    isNFT: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
          Topic
        </label>
        <textarea
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          placeholder="Enter your content topic..."
        />
      </div>

      <div>
        <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
          Tone
        </label>
        <select
          id="tone"
          name="tone"
          value={formData.tone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="humorous">Humorous</option>
          <option value="educational">Educational</option>
        </select>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (seconds)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="15"
          max="180"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {walletAddress && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isNFT"
            name="isNFT"
            checked={formData.isNFT}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isNFT" className="ml-2 block text-sm text-gray-900">
            Mint as NFT
          </label>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isGenerating}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>
      </div>
    </form>
  );
} 