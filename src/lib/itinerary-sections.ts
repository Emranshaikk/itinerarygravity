import {
    Book, Plane, CreditCard, MapPin, Calendar, Utensils,
    Bus, Star, Shield, Sliders, AlertTriangle, ShoppingBag,
    LogOut, Image as ImageIcon, Gift, CheckCircle2, ChevronRight, Circle, Camera, Link, ShoppingCart
} from "lucide-react";

export interface ItinerarySection {
    id: number;
    label: string;
    icon: any; // Lucide icon
    desc: string;
}

export interface ItineraryPhase {
    title: string;
    description: string;
    sections: ItinerarySection[];
}

export const ITINERARY_PHASES: ItineraryPhase[] = [
    {
        title: "Basics & Vibe",
        description: "The core details and proof of your trip.",
        sections: [
            { id: 1, label: "Cover & Basic Info", icon: Book, desc: "Title, Price & Look" },
            { id: 16, label: "Proof of Visit", icon: Camera, desc: "Authenticity & Photos" },
        ]
    },
    {
        title: "The Core Journey",
        description: "What to do, eat, and see.",
        sections: [
            { id: 5, label: "Day-by-Day Itinerary", icon: Calendar, desc: "The main schedule" },
            { id: 6, label: "Local Food Guide", icon: Utensils, desc: "Restaurants & dishes" },
            { id: 8, label: "Hidden Gems", icon: Star, desc: "Secret spots to visit" },
            { id: 12, label: "Shopping Guide", icon: ShoppingBag, desc: "Souvenirs & markets" },
        ]
    },
    {
        title: "Logistics & Travel",
        description: "Getting there and getting around.",
        sections: [
            { id: 2, label: "Before You Travel", icon: Plane, desc: "Flights & packing" },
            { id: 4, label: "Arrival Experience", icon: MapPin, desc: "First impressions" },
            { id: 7, label: "Transport Playbook", icon: Bus, desc: "Getting around daily" },
            { id: 13, label: "Departure Plan", icon: LogOut, desc: "Leaving smoothly" },
        ]
    },
    {
        title: "Extras & Safety",
        description: "Tips, safety, and money matters.",
        sections: [
            { id: 9, label: "Safety & Culture", icon: Shield, desc: "Scams & respect" },
            { id: 11, label: "Emergency Info", icon: AlertTriangle, desc: "Important contacts" },
            { id: 3, label: "Money & Connectivity", icon: CreditCard, desc: "Sims, cash, budget" },
            { id: 10, label: "Customization", icon: Sliders, desc: "Couples, Families, Solos" },
            { id: 14, label: "Post-Trip", icon: ImageIcon, desc: "Memories & sharing" },
        ]
    },
    {
        title: "Monetization & Bonus",
        description: "Add value and earn more.",
        sections: [
            { id: 17, label: "Affiliate Links", icon: Link, desc: "Products to buy" },
            { id: 18, label: "Creator Store", icon: ShoppingCart, desc: "Your own products" },
            { id: 15, label: "Bonus & Extras", icon: Gift, desc: "Freebies & external links" },
        ]
    }
];

export const ALL_SECTIONS: ItinerarySection[] = ITINERARY_PHASES.flatMap(phase => phase.sections);

// Ensure we have exactly 18 sections
if (ALL_SECTIONS.length !== 18) {
    console.warn(`ITINERARY_PHASES configured with ${ALL_SECTIONS.length} sections instead of 18.`);
}
