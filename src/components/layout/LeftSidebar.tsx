import React, { useState, useMemo } from 'react';
import { Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import {
  COMPONENT_REGISTRY,
  CATEGORIES,
  DynamicIcon,
  type ComponentDefinition,
  type ComponentCategory,
} from '../registry';

export const LeftSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredRegistry = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COMPONENT_REGISTRY;
    return COMPONENT_REGISTRY.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const itemsByCategory = useMemo(() => {
    const map = new Map<ComponentCategory, ComponentDefinition[]>();
    for (const cat of CATEGORIES) {
      map.set(cat, []);
    }
    for (const item of filteredRegistry) {
      map.get(item.category)?.push(item);
    }
    return map;
  }, [filteredRegistry]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ComponentDefinition) => {
    e.dataTransfer.setData('application/reactflow/type', item.type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTileClick = (item: ComponentDefinition) => {
    window.dispatchEvent(
      new CustomEvent('add-node-at-center', {
        detail: { type: item.type },
      })
    );
  };

  return (
    <aside className="left-sidebar" aria-label="Component palette">
      <div className="sidebar-header">Components</div>

      <div className="palette-search-container">
        <div className="palette-search-box">
          <Search size={14} className="palette-search-icon" />
          <input
            type="text"
            className="palette-search-input"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="palette-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-content palette-content">
        {CATEGORIES.map((category) => {
          const items = itemsByCategory.get(category) || [];
          if (items.length === 0 && searchQuery) {
            return null;
          }

          const isCollapsed = Boolean(collapsedCategories[category]) && !searchQuery;

          return (
            <div key={category} className="palette-category-group">
              <button
                type="button"
                className="palette-category-header"
                onClick={() => toggleCategory(category)}
                aria-expanded={!isCollapsed}
              >
                <div className="palette-category-title-group">
                  {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                  <span className="palette-category-title">{category}</span>
                </div>
                <span className="palette-category-count">{items.length}</span>
              </button>

              {!isCollapsed && (
                <div className="palette-grid">
                  {items.map((item) => (
                    <div
                      key={item.type}
                      className="palette-tile"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => handleTileClick(item)}
                      title={`${item.label} (Click or drag to add)`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTileClick(item);
                        }
                      }}
                    >
                      <div className="palette-tile-icon">
                        <DynamicIcon name={item.icon} size={22} strokeWidth={1.5} />
                      </div>
                      <span className="palette-tile-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredRegistry.length === 0 && (
          <div className="palette-empty-state">
            No components match &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </aside>
  );
};
