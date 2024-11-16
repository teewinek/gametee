import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface PlayerProfileProps {
  name: string;
  onNameChange: (name: string) => void;
  imageUrl: string;
  isComputer?: boolean;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({
  name,
  onNameChange,
  imageUrl,
  isComputer = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== name) {
      onNameChange(trimmedName);
    } else {
      setEditedName(name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(name);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <img
          src={imageUrl}
          alt={`${name}'s avatar`}
          className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg
            transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100
          transition-opacity duration-300" />
      </div>

      <div className="relative flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-24 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600
                dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={15}
            />
            <button
              onClick={handleSubmit}
              className="p-1 text-green-500 hover:text-green-600 transition-colors"
              aria-label="Save name"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditedName(name);
                setIsEditing(false);
              }}
              className="p-1 text-red-500 hover:text-red-600 transition-colors"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="font-medium">{name}</span>
            {!isComputer && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                  transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Edit name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};