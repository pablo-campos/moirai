export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  icon?: string;
  defaultColor?: string;
}

export const COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {};
