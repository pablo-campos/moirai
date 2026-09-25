import React from 'react';
import {
  MoveRight,
  Monitor,
  Smartphone,
  ShieldCheck,
  Globe,
  Signpost,
  Share2,
  BrickWall,
  Split,
  Webhook,
  Server,
  Zap,
  Database,
  ListOrdered,
  ScrollText,
  Hammer,
  GitBranch,
  Package,
  SlidersHorizontal,
  Cloud,
  Sparkles,
  Hexagon,
  type LucideProps,
} from 'lucide-react';

export type NodeKind = 'tool' | 'box' | 'icon';

export type ComponentCategory =
  | 'Basics'
  | 'Clients'
  | 'Compute & Data'
  | 'Network'
  | 'DevOps'
  | 'Other';

export interface ComponentDefinition {
  type: string;
  label: string;
  icon: string;
  category: ComponentCategory;
  nodeKind: NodeKind;
}

export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  // Basics
  { type: 'box', label: 'Box', icon: 'Hexagon', category: 'Basics', nodeKind: 'box' },

  // Clients
  { type: 'browser', label: 'Browser', icon: 'Monitor', category: 'Clients', nodeKind: 'icon' },
  { type: 'mobile', label: 'Mobile device', icon: 'Smartphone', category: 'Clients', nodeKind: 'icon' },

  // Compute & Data
  { type: 'server', label: 'Server', icon: 'Server', category: 'Compute & Data', nodeKind: 'icon' },
  { type: 'cache', label: 'Cache', icon: 'Zap', category: 'Compute & Data', nodeKind: 'icon' },
  { type: 'database', label: 'Database', icon: 'Database', category: 'Compute & Data', nodeKind: 'icon' },
  { type: 'queue', label: 'Queue', icon: 'ListOrdered', category: 'Compute & Data', nodeKind: 'icon' },

  // Network
  { type: 'vpn', label: 'VPN', icon: 'ShieldCheck', category: 'Network', nodeKind: 'icon' },
  { type: 'web', label: 'Web', icon: 'Globe', category: 'Network', nodeKind: 'icon' },
  { type: 'dns', label: 'DNS', icon: 'Signpost', category: 'Network', nodeKind: 'icon' },
  { type: 'cdn', label: 'CDN', icon: 'Share2', category: 'Network', nodeKind: 'icon' },
  { type: 'firewall', label: 'Firewall', icon: 'BrickWall', category: 'Network', nodeKind: 'icon' },
  { type: 'load-balancer', label: 'Load balancer', icon: 'Split', category: 'Network', nodeKind: 'icon' },
  { type: 'api-gateway', label: 'API Gateway', icon: 'Webhook', category: 'Network', nodeKind: 'icon' },

  // DevOps
  { type: 'logging', label: 'Logging', icon: 'ScrollText', category: 'DevOps', nodeKind: 'icon' },
  { type: 'build', label: 'Build', icon: 'Hammer', category: 'DevOps', nodeKind: 'icon' },
  { type: 'repository', label: 'Repository', icon: 'GitBranch', category: 'DevOps', nodeKind: 'icon' },
  { type: 'artifacts', label: 'Artifacts', icon: 'Package', category: 'DevOps', nodeKind: 'icon' },
  { type: 'configuration', label: 'Configuration', icon: 'SlidersHorizontal', category: 'DevOps', nodeKind: 'icon' },

  // Other
  { type: 'cloud', label: 'Cloud', icon: 'Cloud', category: 'Other', nodeKind: 'icon' },
  { type: 'ai', label: 'AI', icon: 'Sparkles', category: 'Other', nodeKind: 'icon' },
];

export const CATEGORIES: ComponentCategory[] = [
  'Basics',
  'Clients',
  'Compute & Data',
  'Network',
  'DevOps',
  'Other',
];

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  MoveRight,
  Hexagon,
  Monitor,
  Smartphone,
  ShieldCheck,
  Globe,
  Signpost,
  Share2,
  BrickWall,
  Split,
  Webhook,
  Server,
  Zap,
  Database,
  ListOrdered,
  ScrollText,
  Hammer,
  GitBranch,
  Package,
  SlidersHorizontal,
  Cloud,
  Sparkles,
};

export const DynamicIcon: React.FC<{
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}> = ({ name, size = 24, className, strokeWidth = 1.75 }) => {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) {
    return null;
  }
  return React.createElement(IconComponent, { size, className, strokeWidth });
};

export function getComponentByType(type: string): ComponentDefinition | undefined {
  return COMPONENT_REGISTRY.find((item) => item.type === type);
}
