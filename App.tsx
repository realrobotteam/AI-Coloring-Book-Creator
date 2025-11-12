
import React, { useState, useCallback } from 'react';
import { generateColoringPages, generateImage, PagePrompts } from './services/geminiService';
import { createColoringBookPdf } from './services/pdfService';
import Header from './components/Header';
import ColoringBookForm from './components/ColoringBookForm';
import ImageGrid from './components/ImageGrid';
import LoadingSpinner from './components/LoadingSpinner';
import Chatbot from './components/Chatbot';

export interface ColoringPage {
  prompt: string;
  image: string;
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('Magical Forest Animals');
  const [childName, setChildName] = useState<string>('Alex');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [cover, setCover] = useState<ColoringPage | null>(null);

  const handleGenerate = useCallback(async (formTheme: string, formChildName: string) => {
    setIsLoading(true);
    setError(null);
    setPages([]);
    setCover(null);
    setTheme(formTheme);
    setChildName(formChildName);

    try {
      const prompts: PagePrompts = await generateColoringPages(formTheme);
      
      const imageStyle = ', simple black and white coloring book page for a young child, with thick, clean outlines, no shading, and a white background.';

      const coverPromise = generateImage(prompts.coverPrompt + imageStyle).then(image => ({ prompt: prompts.coverPrompt, image }));
      const pagePromises = prompts.pagePrompts.map(prompt => 
        generateImage(prompt + imageStyle).then(image => ({ prompt, image }))
      );

      const [generatedCover, ...generatedPages] = await Promise.all([coverPromise, ...pagePromises]);
      
      setCover(generatedCover);
      setPages(generatedPages);

    } catch (e) {
      console.error(e);
      setError('Something went wrong while creating your coloring book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!cover || pages.length === 0 || !childName || !theme) {
      setError('Cannot download PDF. Please generate the book first.');
      return;
    }
    createColoringBookPdf(cover, pages, childName, theme);
  }, [cover, pages, childName, theme]);

  return (
    <div className="min-h-screen bg-rose-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-rose-500 mb-2 text-center">Create a Magical Coloring Book</h2>
          <p className="text-center text-gray-600 mb-6">Enter a theme and a name to generate a personalized coloring book with AI!</p>
          <ColoringBookForm onGenerate={handleGenerate} isLoading={isLoading} initialTheme={theme} initialName={childName} />
        </div>
        
        {isLoading && <LoadingSpinner />}
        
        {error && <p className="text-center text-red-500 mt-6">{error}</p>}
        
        {!isLoading && (cover || pages.length > 0) && (
          <ImageGrid 
            cover={cover} 
            pages={pages} 
            onDownload={handleDownload} 
            childName={childName} 
            theme={theme} 
          />
        )}
      </main>
      <Chatbot />
    </div>
  );
};

export default App;
