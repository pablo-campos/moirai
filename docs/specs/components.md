# Components spec

All components are defined in src/components/registry.ts as:
{ type, label, icon, category, nodeKind }
nodeKind is one of: "tool" | "box" | "rectangle" | "icon"

| Component      | Icon (lucide-react) | Category       | nodeKind  |
|----------------|---------------------|----------------|-----------|
| Rectangle      | Square              | Basics         | rectangle |
| Text Box       | Hexagon             | Basics         | box       |
| Browser        | Monitor             | Clients        | icon      |
| Mobile device  | Smartphone          | Clients        | icon      |
| Server         | Server              | Compute & Data | icon      |
| Cache          | Zap                 | Compute & Data | icon      |
| Database       | Database            | Compute & Data | icon      |
| Queue          | ListOrdered         | Compute & Data | icon      |
| VPN            | ShieldCheck         | Network        | icon      |
| Web            | Globe               | Network        | icon      |
| DNS            | Signpost            | Network        | icon      |
| CDN            | Share2              | Network        | icon      |
| Firewall       | BrickWall           | Network        | icon      |
| Load balancer  | Split               | Network        | icon      |
| API Gateway    | Webhook             | Network        | icon      |
| Logging        | ScrollText          | DevOps         | icon      |
| Build          | Hammer              | DevOps         | icon      |
| Repository     | GitBranch           | DevOps         | icon      |
| Artifacts      | Package             | DevOps         | icon      |
| Configuration  | SlidersHorizontal   | DevOps         | icon      |
| Cloud          | Cloud               | Other          | icon      |
| AI             | Sparkles            | Other          | icon      |

If a lucide icon name doesn't exist in the installed version, pick the closest
match and note it in docs/PROGRESS.md.

## Shared rule
Every component can show a text label below it, with no border.