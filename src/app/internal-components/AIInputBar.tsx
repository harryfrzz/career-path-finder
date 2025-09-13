"use client";
import { useState, useCallback } from 'react';
import CareerPathVisualization from './CareerPathVisualization';
import { ChevronUp } from "lucide-react";


export default function AIInputBar(){
  const [inputValue, setInputValue] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      const newSkills = inputValue
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
      setSkills(newSkills);
      setShowVisualization(true);
    }
  }, [inputValue]);

  const handleReset = useCallback(() => {
    setInputValue('');
    setSkills([]);
    setShowVisualization(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="fixed inset-0 flex flex-col">
      {showVisualization && skills.length > 0 ? (
        <div className="flex-1 overflow-hidden">
          <CareerPathVisualization skills={skills} />
        </div>
      ) : (
        <div className="flex-1"></div>
      )}
      
      <div className="w-full p-6 absolute bottom-0 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center gap-2 h-[50px] max-w-4xl mx-auto">
          <div className="w-[650px] h-full bg-white rounded-3xl border border-gray-200">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter skills separated by commas (e.g., JavaScript, Python, Design)"
              className="w-full h-full px-5 outline-0 rounded-3xl"
            />
          </div>  
          <button
            onClick={handleSubmit}
            className="w-[50px] h-full bg-white rounded-full flex justify-center items-center"
          >
            <ChevronUp/>
          </button>
          {showVisualization && (
            <button
              onClick={handleReset}
              className="px-6 h-full bg-gray-200 text-gray-700 rounded-3xl font-medium hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}