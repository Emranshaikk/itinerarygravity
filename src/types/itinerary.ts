export interface ItineraryContent {
    // 1. Cover & First Impression
    cover: {
        title: string;
        destination: string;
        tripType: 'Luxury' | 'Budget' | 'Adventure' | 'Honeymoon' | 'Family' | 'Solo' | 'Cultural' | string;
        duration: string; // e.g. "7 Days / 6 Nights"
        bestTimeToVisit: string;
        targetAudience: string;
        brandName?: string;
        brandLogo?: string; // URL
        version?: string;
        lastUpdated?: string;
        tagline?: string;
        // Listing Details (Used for platform)
        price?: number;
        currency?: string;
    };

    // 2. Before You Travel
    preTrip: {
        flightGuide: {
            bestAirports: string[];
            arrivalDepartureStats: string; // Ideal times
            seatTips?: string;
            baggageTips?: string;
            jetLagTips?: string;
        };
        packingList: {
            category: string; // Clothes, Electronics, Documents
            items: string[]; // List of items
            tips?: string;
        }[];
        essentials: {
            documents: string[];
            insurance: string;
            health: string[]; // Vaccines, medicines
        };
        luxuryAddons?: string[];
    };

    // 3. Money, Connectivity & Local Setup
    logistics: {
        currency: {
            code: string;
            exchangeTips: string;
            cashVsCard: string;
            dailyBudgetEstimate: string;
        };
        connectivity: {
            simOptions: string[];
            wifiTips: string;
            powerAdapters: string;
        };
        apps: {
            name: string;
            purpose: string; // Maps, Cab, Food
            link?: string;
        }[];
    };

    // 4. Arrival Day Experience
    arrival: {
        airportTransfer: {
            options: { mode: string; cost: string; time: string }[];
            scamsToAvoid: string;
        };
        hotelCheckIn: {
            tips: string;
            earlyCheckInHack?: string;
        };
        firstDayExploration: {
            activity: string;
            foodSuggestion: string; // First dinner
        };
    };

    // 5. Day-by-Day Itinerary (Core)
    dailyItinerary: {
        dayNumber: number;
        title: string;
        description: string;
        morning: {
            time: string;
            activity: string;
            location?: string;
            food?: string; // Breakfast spot
            tips?: string;
        };
        afternoon: {
            time: string;
            activity: string; // Main attraction or secondary
            location?: string;
            food?: string; // Lunch spot
            tips?: string;
        };
        evening: {
            time: string;
            activity: string;
            location?: string;
            food?: string; // Dinner
            tips?: string; // Nightlife or chill
        };
        logistics: {
            transport: string;
            travelTime: string;
        };
        images?: string[];
    }[];

    // 6. Local Food Guide
    food: {
        mustTryDishes: { name: string; description: string; bestPlace?: string }[];
        restaurantRecommendations: { name: string; priceRange: string; cuisine: string; notes?: string }[];
        dietaryOptions?: string; // Veg/Vegan
        foodSafety: string; // What not to eat
    };

    // 7. Transport Playbook
    transport: {
        modes: { type: string; tips: string; cost?: string }[]; // Metro, Cab, Walking
        passes: string; // Day passes etc
        walkingAdvice: string;
    };

    // 8. Hidden Gems (Secrets)
    secrets: {
        places: { name: string; description: string; type: 'Viewpoint' | 'Cafe' | 'Experience' | string }[];
    };

    // 9. Safety, Scams & Culture
    safety: {
        commonScams: string[];
        safetyTips: string[];
        culturalDosAndDonts: string[]; // Dress code, tipping
        emergencyNumbers: { name: string; number: string }[];
    };

    // 10. Customization Options
    customization: {
        coupleTips?: string;
        familyTips?: string;
        soloTips?: string;
        luxuryUpgrade?: string;
        budgetSaver?: string;
    };

    // 11. Shopping & Souvenirs
    shopping: {
        whatToBuy: string[];
        bestMarkets: string[];
        taxFreeTips?: string;
    };

    // 12. Departure & Post-Trip
    departure: {
        checkoutTips: string;
        airportBuffer: string;
    };
    postTrip: {
        jetLagRecovery?: string;
        photoTips?: string;
        nextDestinationIdeas?: string[];
    };

    // 13. Bonus
    bonus: {
        links: { label: string; url: string }[]; // Google Maps, PDF downloads
        checklist?: string[]; // Quick summary
    };
}

export const initialItineraryContent: ItineraryContent = {
    cover: {
        title: "",
        destination: "",
        tripType: "Adventure",
        duration: "",
        bestTimeToVisit: "",
        targetAudience: "",
        price: 0,
        currency: "USD",
    },
    preTrip: {
        flightGuide: { bestAirports: [], arrivalDepartureStats: "" },
        packingList: [],
        essentials: { documents: [], insurance: "", health: [] },
    },
    logistics: {
        currency: { code: "USD", exchangeTips: "", cashVsCard: "", dailyBudgetEstimate: "" },
        connectivity: { simOptions: [], wifiTips: "", powerAdapters: "" },
        apps: [],
    },
    arrival: {
        airportTransfer: { options: [], scamsToAvoid: "" },
        hotelCheckIn: { tips: "" },
        firstDayExploration: { activity: "", foodSuggestion: "" },
    },
    dailyItinerary: [
        {
            dayNumber: 1,
            title: "",
            description: "",
            morning: { time: "09:00", activity: "" },
            afternoon: { time: "13:00", activity: "" },
            evening: { time: "18:00", activity: "" },
            logistics: { transport: "", travelTime: "" }
        }
    ],
    food: { mustTryDishes: [], restaurantRecommendations: [], foodSafety: "" },
    transport: { modes: [], passes: "", walkingAdvice: "" },
    secrets: { places: [] },
    safety: { commonScams: [], safetyTips: [], culturalDosAndDonts: [], emergencyNumbers: [] },
    customization: {},
    shopping: { whatToBuy: [], bestMarkets: [] },
    departure: { checkoutTips: "", airportBuffer: "" },
    postTrip: {},
    bonus: { links: [] },
};
