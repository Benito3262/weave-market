import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs));
}
export function formatAddress(address: string): string {
return ${address.slice(0, 6)}...${address.slice(-4)};
}
export function formatEth(wei: bigint): string {
const eth = Number(wei) / 1e18;
return eth.toFixed(4);
}
export function formatPercentage(value: number, total: number): string {
if (total === 0) return "50.00";
return ((value / total) * 100).toFixed(2);
}
export function formatTimestamp(timestamp: number): string {
return new Date(timestamp * 1000).toLocaleString();
}
export function formatTimeRemaining(endTime: number): string {
const now = Math.floor(https://t.co/lwqm0w71CV() / 1000);
const remaining = endTime - now;
if (remaining <= 0) return "Ended";
const days = Math.floor(remaining / 86400);
const hours = Math.floor((remaining % 86400) / 3600);
const minutes = Math.floor((remaining % 3600) / 60);
if (days > 0) return ${days}d ${hours}h;
if (hours > 0) return ${hours}h ${minutes}m;
return ${minutes}m;
}
export function getReputationColor(reputation: number): string {
if (reputation >= 5000) return "text-purple-500";
if (reputation >= 3000) return "text-blue-500";
if (reputation >= 2000) return "text-green-500";
if (reputation >= 1500) return "text-yellow-500";
if (reputation >= 1000) return "text-gray-500";
return "text-red-500";
}
export function getReputationLevel(reputation: number): string {
if (reputation >= 5000) return "Elite";
if (reputation >= 3000) return "Expert";
if (reputation >= 2000) return "Advanced";
if (reputation >= 1500) return "Intermediate";
if (reputation >= 1000) return "Novice";
return "Beginner";
}