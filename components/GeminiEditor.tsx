import React, { useState } from 'react';
import { Sparkles, Upload, ArrowRight, Loader2, Download } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';

const GeminiEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setGeneratedImage(null); // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt || !previewUrl) return;

    setLoading(true);
    setError(null);

    try {
      const base64Data = previewUrl; // Contains the full data URI
      const mimeType = selectedFile.type;

      // Ensure mimeType is valid for the API (roughly)
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) {
         throw new Error("Unsupported file type. Please use PNG, JPEG, or WebP.");
      }

      const resultBase64 = await editImageWithGemini(base64Data, mimeType, prompt);

      if (resultBase64) {
        setGeneratedImage(`data:image/png;base64,${resultBase64}`);
      } else {
        setError("The model did not return an image. It might have refused the request due to safety filters.");
      }
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-npi-red/20 border border-npi-gold/30 rounded-xl p-6 md:p-8 my-12 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles size={120} className="text-npi-gold" />
      </div>
      
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-npi-gold mb-2 flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          NPI Visual Lab <span className="text-xs font-sans border border-npi-gold/50 px-2 py-0.5 rounded text-npi-gold/70">BETA</span>
        </h2>
        <p className="text-npi-text/80 max-w-2xl">
          Use our AI-powered tool to visualize changes in Somalia. Upload a photo of a street, building, or public space and describe how it could be improved (e.g., "Add solar street lights", "Repair the road", "Add a park").
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="border-2 border-dashed border-npi-gold/30 rounded-lg p-6 flex flex-col items-center justify-center bg-npi-dark/50 hover:bg-npi-dark/80 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
              id="image-upload"
            />
            
            {!previewUrl ? (
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center text-center">
                <Upload className="w-10 h-10 text-npi-gold mb-3" />
                <span className="text-npi-gold font-medium">Click to Upload Image</span>
                <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</span>
              </label>
            ) : (
              <div className="relative w-full h-64 group">
                 <img 
                  src={previewUrl} 
                  alt="Original" 
                  className="w-full h-full object-contain rounded-md" 
                />
                <label htmlFor="image-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  Change Image
                </label>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-npi-gold text-sm font-medium">Edit Prompt</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Add modern street lamps and pave the sidewalk"
                className="flex-1 bg-npi-dark/50 border border-npi-gold/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-npi-gold"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !selectedFile || !prompt}
                className="bg-npi-gold hover:bg-npi-goldDark text-npi-dark font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500">Powered by Gemini 2.5 Flash Image</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="border border-npi-gold/20 rounded-lg bg-npi-dark/30 p-4 flex flex-col min-h-[300px]">
          <h3 className="text-npi-gold/80 text-sm font-medium mb-3">Generated Visualization</h3>
          
          <div className="flex-1 flex items-center justify-center bg-black/20 rounded border border-white/5 relative overflow-hidden">
            {loading ? (
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-npi-gold animate-spin mx-auto mb-2" />
                <p className="text-gray-400 animate-pulse">Analyzing pixel data...</p>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-contain rounded"
                />
                <a 
                  href={generatedImage} 
                  download="npi-generated-insight.png"
                  className="absolute bottom-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-npi-gold hover:text-black transition-colors"
                >
                  <Download size={20} />
                </a>
              </div>
            ) : (
              <div className="text-gray-600 flex flex-col items-center">
                <ArrowRight className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Result will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiEditor;