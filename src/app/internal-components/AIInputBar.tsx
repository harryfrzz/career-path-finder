"use client";
import { useState, useCallback } from 'react';
import CareerPathVisualization from './CareerPathVisualization';
import { ChevronUp } from "lucide-react";


export default function AIInputBar(){
  const [inputValue, setInputValue] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [careerData, setCareerData] = useState<any>(null);

  const callGeminiAPI = async (userSkills: string[]) => {
    try {
      setIsLoading(true);
      
      const prompt = `Based on these skills: ${userSkills.join(', ')}, 
      please provide career path recommendations including:
      1. Potential job roles
      2. Skills to develop further
      3. Career progression paths
      4. Industry insights
      
      Please format the response as a structured JSON object with these fields:
      {
        "careerRoles": ["role1", "role2", ...],
        "skillsToLearn": ["skill1", "skill2", ...],
        "careerPaths": [{"title": "path name", "description": "path description", "steps": ["step1", "step2", ...]}],
        "industryInsights": "insights text"
      }`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          skills: userSkills
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCareerData(data);
      return data;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Handle error appropriately
      setCareerData({ error: 'Failed to get career recommendations. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (inputValue.trim()) {
      const newSkills = inputValue
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
      setSkills(newSkills);
      setShowVisualization(true);
      
      // Call Gemini API with the skills
      await callGeminiAPI(newSkills);
    }
  }, [inputValue]);

  const handleReset = useCallback(() => {
    setInputValue('');
    setSkills([]);
    setShowVisualization(false);
    setCareerData(null);
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
          <CareerPathVisualization skills={skills} careerData={careerData} isLoading={isLoading} />
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
            disabled={isLoading}
            className="w-[50px] h-full bg-white rounded-full flex justify-center items-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
            ) : (
              <ChevronUp/>
            )}
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