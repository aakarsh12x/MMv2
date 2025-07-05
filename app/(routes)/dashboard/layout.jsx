"use client";
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import SideNav from './_components/SideNav'

export default function DashboardLayout({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-white border-r">
        <SideNav />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {children}
      </div>
    </div>
  )
}
