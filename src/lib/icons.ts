import { createElement } from 'react'
import type { CSSProperties } from 'react'
import {
  Folder,
  Briefcase,
  Home,
  ShoppingCart,
  Heart,
  Star,
  Book,
  Code,
  Coffee,
  Music,
  Camera,
  Plane,
  Rocket,
  Target,
  Gift,
  Palette,
  Dumbbell,
  Utensils,
  GraduationCap,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react'

/** Curated set of icons projects can pick from. Keep 'Folder' as it's the default used by addProject/seeded projects. */
export const PROJECT_ICONS: Record<string, LucideIcon> = {
  Folder,
  Briefcase,
  Home,
  ShoppingCart,
  Heart,
  Star,
  Book,
  Code,
  Coffee,
  Music,
  Camera,
  Plane,
  Rocket,
  Target,
  Gift,
  Palette,
  Dumbbell,
  Utensils,
  GraduationCap,
  PiggyBank,
}

export const PROJECT_ICON_NAMES: string[] = Object.keys(PROJECT_ICONS)

const DEFAULT_ICON = 'Folder'

/**
 * Renders a project's icon by name, falling back to the default icon when the
 * stored name isn't in our curated set (e.g. old/foreign data).
 */
export function ProjectIconGlyph({
  icon,
  className,
  style,
}: {
  icon: string
  className?: string
  style?: CSSProperties
}) {
  const Icon = PROJECT_ICONS[icon] ?? PROJECT_ICONS[DEFAULT_ICON]
  return createElement(Icon, { className, style })
}
