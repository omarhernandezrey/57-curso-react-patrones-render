import React, { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { useTodoStore } from '../store';
import '../styles/tags.css';

export function Tags({ todoId, tags = [] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { addTag, removeTag } = useTodoStore();

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(todoId, newTag.trim());
      setNewTag('');
      setIsAdding(false);
    }
  };

  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
  ];

  return (
    <div className="tags-container">
      <div className="tags-list">
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="tag"
            style={{
              backgroundColor: colors[index % colors.length],
            }}
          >
            {tag}
            <button
              className="tag-remove"
              onClick={() => removeTag(todoId, tag)}
            >
              <FiX size={12} />
            </button>
          </span>
        ))}
      </div>

      {isAdding ? (
        <div className="tag-input-group">
          <input
            type="text"
            placeholder="Nueva etiqueta..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            autoFocus
            className="tag-input"
          />
          <button className="btn-add-tag" onClick={handleAddTag}>
            Añadir
          </button>
        </div>
      ) : (
        <button
          className="btn-add-tag-trigger"
          onClick={() => setIsAdding(true)}
        >
          <FiPlus size={12} /> Etiqueta
        </button>
      )}
    </div>
  );
}
