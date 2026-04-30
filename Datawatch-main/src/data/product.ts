import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  Bot,
  ChartNoAxesColumn,
  Eye,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Settings,
  WalletCards,
} from "lucide-react";

export type Severity = "Low" | "Medium" | "High";

export type ProductNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const appNav: ProductNavItem[] = [
  { href: "/dashboard", label: "Home", icon: Activity },
  { href: "/insights", label: "Insights", icon: ChartNoAxesColumn },
  { href: "/watcher", label: "Watcher", icon: Bot },
  { href: "/alerts", label: "Alerts", icon: ShieldAlert },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const networks = ["MTN", "Airtel", "Glo", "9mobile"];

export const valueCards = [
  {
    title: "Full Transparency",
    body: "See where your data goes",
    icon: Eye,
  },
  {
    title: "Instant Alerts",
    body: "Detect hidden charges instantly",
    icon: Bell,
  },
  {
    title: "Ask Watcher",
    body: "AI explains usage in English and Pidgin",
    icon: MessageCircle,
  },
  {
    title: "Smart Savings",
    body: "Reduce wasted data automatically",
    icon: WalletCards,
  },
];

export const insights = [
  "Users often notice data loss only after depletion",
  "Background apps consume significant data silently",
  "Billing disputes take time to resolve",
];

export const problemProof = [
  {
    title: "Data depletion and billing are top telecom complaints",
    insight:
      "NCC leadership publicly identified data depletion and billing issues as leading consumer concerns in Nigeria.",
    source: "Nairametrics / NCC, Nov 2024",
    href: "https://nairametrics.com/2024/11/08/why-data-depletion-billing-issues-still-top-telecom-consumer-complaints-in-nigeria-ncc/",
  },
  {
    title: "Regulator convened consumer parliament on data depletion",
    insight:
      "NCC convened a Telecom Consumer Parliament because abnormal data depletion had become a prevalent complaint.",
    source: "Independent Nigeria / NCC, Mar 2023",
    href: "https://independent.ng/ncc-convenes-telecom-parliament-to-address-abnormal-depletion-of-consumers-data/",
  },
  {
    title: "Background apps and device behavior are real causes",
    insight:
      "NCC has pointed to background apps, malware, GPS, auto-play, updates, and high-resolution content as depletion drivers.",
    source: "Nairametrics / NCC, Jun 2024",
    href: "https://nairametrics.com/2024/06/17/ncc-says-telcos-not-to-blames-for-data-depletion-blames-malwares-background-apps-gps-others/",
  },
  {
    title: "Billing transparency is a regulatory concern",
    insight:
      "NCC directed mobile operators to audit billing systems and simplify tariff plans to improve consumer transparency.",
    source: "Independent Nigeria / NCC, Jun 2024",
    href: "https://independent.ng/data-depletion-ncc-directs-telcos-to-audit-billings-to-address-complaints/",
  },
  {
    title: "Users need formal complaint support",
    insight:
      "NCC publishes a complaint escalation route for unresolved telecom service issues after contacting operators.",
    source: "NCC consumer complaints procedure",
    href: "https://www.ncc.gov.ng/media-centre/press-releases/procedure-lodging-consumer-complaints",
  },
  {
    title: "Hidden subscriptions and renewals confuse users",
    insight:
      "Consumer guides across Nigerian networks focus on stopping hidden data deductions, auto-renewals, and VAS services.",
    source: "BerraPay telecom guide",
    href: "https://berrapay.com.ng/how-to-stop-data-deduction-on-mtn-glo-airtel-and-9mobile/",
  },
];

export const targetSegments = [
  "Prepaid users buying small bundles frequently",
  "Students and freelancers relying on mobile data",
  "Small business owners using mobile hotspots",
  "Gig workers who need predictable data spend",
];

export const testimonials = [
  "Now I understand my data usage",
  "I stopped random deductions",
  "Watcher explains everything clearly",
];

export const demoUsage = [
  { day: "Mon", value: 34 },
  { day: "Tue", value: 46 },
  { day: "Wed", value: 28 },
  { day: "Thu", value: 64 },
  { day: "Fri", value: 51 },
  { day: "Sat", value: 73 },
  { day: "Sun", value: 42 },
];

export const demoApps = [
  { name: "Instagram", value: "1.8GB", percent: 42 },
  { name: "TikTok", value: "1.2GB", percent: 28 },
  { name: "WhatsApp", value: "620MB", percent: 15 },
  { name: "System apps", value: "410MB", percent: 10 },
];

export const demoAlerts = [
  {
    title: "Unknown VAS renewal",
    description:
      "A weekly service attempted to renew without clear app activity.",
    impact: "N150",
    time: "12 min ago",
    severity: "High" as Severity,
  },
  {
    title: "Midnight data spike",
    description: "Data rose while the device was likely idle.",
    impact: "840MB",
    time: "2:14 AM",
    severity: "Medium" as Severity,
  },
  {
    title: "Background sync detected",
    description: "Cloud backup traffic increased during mobile data use.",
    impact: "310MB",
    time: "Yesterday",
    severity: "Low" as Severity,
  },
];

export const demoSubscriptions = [
  {
    name: "Caller Tune Pack",
    charge: "N100 / week",
    status: "Suspicious",
    provider: "Network VAS",
  },
  {
    name: "Cloud Backup",
    charge: "N500 / month",
    status: "Active",
    provider: "App service",
  },
  {
    name: "Sports Updates",
    charge: "N50 / day",
    status: "Suspicious",
    provider: "Short code",
  },
];

export const setupSteps = [
  "Number verified",
  "Network detected",
  "Usage monitor warming up",
  "Alerts engine preparing",
];

export const includedCapabilities = [
  { title: "Basic tracking", tier: "Free", icon: Smartphone },
  { title: "Limited AI", tier: "Free", icon: Bot },
  { title: "Fraud detection", tier: "Pro", icon: ShieldCheck },
  { title: "WhatsApp premium", tier: "Pro", icon: MessageCircle },
];
