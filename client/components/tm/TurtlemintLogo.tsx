import React from 'react'

export function TurtlemintLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">T</span>
      </div>
      <span className="font-semibold text-lg">Turtlemint</span>
    </div>
  )
}
