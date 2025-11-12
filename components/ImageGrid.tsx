import React from 'react';
import type { ColoringPage } from '../App';

interface ImageGridProps {
  cover: ColoringPage | null;
  pages: ColoringPage[];
  onDownload: () => void;
  childName: string;
  theme: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({ cover, pages, onDownload, childName, theme }) => {
  const { Lucide } = (window as any);
  const Download = Lucide?.Download;

  return (
    <div className="mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-rose-500">Your Coloring Book is Ready!</h2>
        <p className="text-gray-600 mt-2">Here's a preview of "{theme}" for {childName}.</p>
        <button
          onClick={onDownload}
          className="mt-4 inline-flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
        >
          {Download && <Download className="h-5 w-5 mr-2" />}
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cover && (
          <div className="border rounded-lg p-4 shadow-md bg-white">
            <h3 className="font-bold text-center mb-2 text-lg">Cover Page</h3>
            <img 
              src={`data:image/png;base64,${cover.image}`} 
              alt="Cover Page" 
              className="w-full h-auto rounded-md object-cover aspect-[4/3]"
            />
          </div>
        )}
        {pages.map((page, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md bg-white">
            <h3 className="font-bold text-center mb-2 text-lg">Page {index + 1}</h3>
            <img 
              src={`data:image/png;base64,${page.image}`} 
              alt={`Coloring Page ${index + 1}`} 
              className="w-full h-auto rounded-md object-cover aspect-[4/3]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
