import React from 'react';
import { Calendar } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative">
      <div className="absolute left-4 h-full w-0.5 bg-romance-300"></div>
      {events.map((event, index) => (
        <div
          key={index}
          className="relative pl-12 pb-8 group hover:transform hover:translate-x-2 transition-transform duration-300"
        >
          <div className="absolute left-2 w-4 h-4 bg-romance-500 rounded-full -translate-x-2 group-hover:scale-125 transition-transform">
            <div className="absolute w-8 h-8 bg-romance-200 rounded-full -translate-x-2 -translate-y-2 opacity-50 animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 text-romance-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{event.date}</span>
            </div>
            <h3 className="text-lg font-semibold text-romance-800 mb-1">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};