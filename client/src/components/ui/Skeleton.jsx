import React from "react";

// Base animated skeleton box with smooth shimmer/pulse effect
export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-800/50 ${className}`}
      {...props}
    />
  );
}

// Editorial Blog Card Skeleton - matches BlogCard.jsx vertical layout perfectly
export function BlogCardSkeleton({ count = 1 }) {
  const items = Array.from({ length: count });

  const renderSingle = (index) => (
    <div
      key={index}
      className="flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 overflow-hidden shadow-sm"
    >
      {/* Cover Image Skeleton */}
      <div className="relative h-48 sm:h-52 w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        {/* Category Badge Pill Skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </div>

      {/* Editorial Content Skeleton */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Read time and date row */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-3 w-16" />
            <span className="text-zinc-300 dark:text-zinc-700 text-xs">•</span>
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Title - 2 lines */}
          <div className="space-y-2 mb-3">
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-4/5" />
          </div>

          {/* Subtitle / Excerpt - 2 lines */}
          <div className="space-y-1.5 mb-4">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 mb-4">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-14 rounded" />
          </div>
        </div>

        {/* Author Footer */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );

  if (count === 1) return renderSingle(0);

  return (
    <>
      {items.map((_, i) => renderSingle(i))}
    </>
  );
}

// Blog Details Skeleton - matches BlogDetails.jsx layout precisely
export function BlogDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-24 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 md:pt-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>

        {/* Masthead Header */}
        <header className="mb-6 sm:mb-8">
          {/* Category Badge Pill */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Title Lines (Serif headline) */}
          <div className="space-y-3 mb-4">
            <Skeleton className="h-9 sm:h-12 w-full rounded-lg" />
            <Skeleton className="h-9 sm:h-12 w-4/5 rounded-lg" />
          </div>

          {/* Subtitle / Excerpt */}
          <div className="space-y-2 mb-6">
            <Skeleton className="h-5 w-11/12 rounded" />
            <Skeleton className="h-5 w-2/3 rounded" />
          </div>

          {/* Author Byline & Article Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800/80 my-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-20 rounded" />
                  <span className="text-zinc-300 dark:text-zinc-700 text-xs">•</span>
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </header>

        {/* Lead Media (Cover image 16/9 aspect ratio) */}
        <div className="mb-6 sm:mb-12 rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 aspect-[16/9] shadow-sm">
          <Skeleton className="w-full h-full rounded-none" />
        </div>

        {/* Editorial Body Prose Paragraphs */}
        <div className="space-y-6 pb-12 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="p-4 sm:p-6 rounded-xl border-l-4 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3 mb-4 rounded" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Skeleton - for UserDashboard & AdminDashboard
export function DashboardSkeleton({ isAdmin = false }) {
  return (
    <div className="min-h-screen pb-32 pt-28 px-4 sm:px-6 md:px-12 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-8 sm:h-10 w-64 rounded-lg" />
            <Skeleton className="h-4 w-80 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            {isAdmin && <Skeleton className="h-10 w-28 rounded-xl" />}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-16 rounded" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>

        {/* Content Section / List items */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48 sm:w-72" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Skeleton - for Profile.jsx
export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pt-28 pb-32 px-4 sm:px-6 md:px-12 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Skeleton className="w-24 h-24 rounded-full shrink-0" />
          <div className="flex-1 text-center sm:text-left space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-44 mx-auto sm:mx-0 rounded" />
                <Skeleton className="h-4 w-60 mx-auto sm:mx-0 rounded" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full mx-auto sm:mx-0" />
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>

        {/* Form Body Skeleton */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-11 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Lightweight top-level page suspense skeleton
export function PageSuspenseSkeleton() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-6 animate-pulse">
      <Skeleton className="h-6 w-36 rounded-full" />
      <Skeleton className="h-10 w-96 rounded-xl" />
      <Skeleton className="h-4 w-72 rounded" />
      <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCardSkeleton count={3} />
      </div>
    </div>
  );
}

export default Skeleton;
