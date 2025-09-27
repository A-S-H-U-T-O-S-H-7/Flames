"use client"
import { useState } from 'react';
import { Calendar, Clock, Code, BookOpen, Layout, ArrowRight } from 'lucide-react';

export default function DailyRoutineSchedule() {
  const [activeRoutine, setActiveRoutine] = useState(null);
  
  const routines = [
    {
      id: 1,
      time: "5:00 AM - 9:00 AM",
      activity: "JavaScript",
      description: "Core JavaScript concepts, advanced patterns, and practice exercises",
      icon: <Code className="text-amber-500" />,
      color: "bg-amber-100 border-amber-300"
    },
    {
      id: 2,
      time: "10:00 AM - 1:00 PM",
      activity: "Data Structures & Algorithms",
      description: "Algorithm practice, problem-solving, and computational thinking",
      icon: <BookOpen className="text-emerald-500" />,
      color: "bg-emerald-100 border-emerald-300"
    },
    {
      id: 3,
      time: "3:00 PM - 6:00 PM",
      activity: "React",
      description: "Component architecture, hooks, state management, and React patterns",
      icon: <Layout className="text-blue-500" />,
      color: "bg-blue-100 border-blue-300"
    },
    {
      id: 4,
      time: "8:00 PM - 12:00 AM",
      activity: "Next.js",
      description: "Server components, routing, data fetching, and full-stack applications",
      icon: <ArrowRight className="text-violet-500" />,
      color: "bg-violet-100 border-violet-300"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Coding Routine</h1>
        <p className="text-gray-600">Structured learning path for web development mastery</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {routines.map((routine) => (
            <div 
              key={routine.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${routine.color} ${activeRoutine === routine.id ? 'ring-2 ring-offset-2 ring-gray-800' : ''}`}
              onClick={() => setActiveRoutine(routine.id === activeRoutine ? null : routine.id)}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-white mr-4">
                  {routine.icon}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">{routine.time}</span>
                  </div>
                  <h3 className="font-bold text-gray-800">{routine.activity}</h3>
                </div>
              </div>
              
              {activeRoutine === routine.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-700">{routine.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <Calendar className="text-gray-700 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Daily Progress</h2>
          </div>
          
          <div className="space-y-4">
            {routines.map((routine) => (
              <div key={routine.id} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${activeRoutine === routine.id ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                <div className="text-sm text-gray-700 font-medium">{routine.activity}</div>
                <div className="ml-auto">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-1 h-1 rounded-full bg-gray-500 mt-2 mr-2"></div>
                <p className="text-sm text-gray-600">Take short breaks between sessions</p>
              </li>
              <li className="flex items-start">
                <div className="w-1 h-1 rounded-full bg-gray-500 mt-2 mr-2"></div>
                <p className="text-sm text-gray-600">Practice with real projects</p>
              </li>
              <li className="flex items-start">
                <div className="w-1 h-1 rounded-full bg-gray-500 mt-2 mr-2"></div>
                <p className="text-sm text-gray-600">Review your notes at the end of each day</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}