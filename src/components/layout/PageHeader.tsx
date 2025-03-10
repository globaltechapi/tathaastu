import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`relative bg-slate-200 ${className}`}>
      <div className="container mx-auto py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
