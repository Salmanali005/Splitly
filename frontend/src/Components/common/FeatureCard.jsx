import React from 'react';

const FeatureCard = ({ icon, title, description, iconBg = 'bg-gray-100 dark:bg-gray-700' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto ${iconBg}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-5">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;