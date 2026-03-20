export interface ItineraryContent {
    // 1. Cover & First Impression
    cover: {
        title: string;
        destination: string;
        tripType: 'Luxury' | 'Budget' | 'Adventure' | 'Honeymoon' | 'Family' | 'Solo' | 'Cultural' | string;
        duration: string; // e.g. "7 Days / 6 Nights"
        bestTimeToVisit: string;
        visitDate?: string; // Month + Year of visit
        targetAudience: string;
        avoidReason?: string; // Who should AVOID this trip
        brandName?: string;
        brandLogo?: string; // URL
        coverImage?: string; // URL
        version?: string;
        lastUpdated?: string;
        tagline?: string;
        tags?: string[]; // Vibe tags e.g. "Chill", "Foodie", "Nightlife"
        // Listing Details (Used for platform)
        price?: number;
        currency?: string;
        seoTitle?: string;
        seoDescription?: string;
    };

    // 2. Before You Travel
    preTrip: {
        flightGuide: {
            bestAirports: string[];
            arrivalDepartureStats: string; // Ideal times
            routeInsight?: string; // NEW: Personal route experience
            timingInsight?: string; // NEW: Personal timing experience
            seatTips?: string;
            baggageTips?: string;
            jetLagTips?: string;
        };
        packingList: {
            category: string; // Clothes, Electronics, Documents
            items: string[]; // List of items
            tips?: string;
            mistakesToAvoid?: string; // NEW
        }[];
        essentials: {
            documents: string[];
            insurance: string;
            health: string[]; // Vaccines, medicines
        };
        luxuryAddons?: string[];
    };

    // 3. Accommodation & Neighborhoods
    accommodation?: {
        bestNeighborhoods: { name: string; vibe: string; whyStayHere: string; locationCoordinates?: [number, number] }[];
        hotelRecommendations: { 
            name: string; 
            priceRange: string; 
            neighborhood: string; 
            whyWeLoveIt: string; 
            liked?: string; // NEW
            disliked?: string; // NEW
            recommend?: boolean; // NEW
            bookingLink?: string; 
            locationCoordinates?: [number, number] 
        }[];
        bookingTips: string;
    };

    // 4. Money, Connectivity & Local Setup
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

    costBreakdown?: { // NEW SECTION
        totalSpent: number;
        flights: number;
        stay: number;
        food: number;
        transport: number;
        activities: number;
        overspentComment?: string;
        savedMoneyComment?: string;
        optimizationTips?: string;
    };

    // 4. Arrival Day Experience
    arrival: {
        airportToCity: string;
        checkInProcess: string;
        firstMealSuggestion: string;
        orientationTips: string;
        simCardPickUp: string;
        mistakesToAvoid?: string; // NEW
    };

    // 5. Day-by-Day Itinerary (Core)
    dailyItinerary: {
        dayNumber: number;
        title: string;
        description: string;
        wakeUpTime?: string;
        crowdTips?: string;
        morning: {
            time: string;
            activity: string;
            location?: string;
            locationCoordinates?: [number, number];
            travelTime?: string;
            duration?: string; // NEW: How long spent
            cost?: string; // NEW: Activity cost
            food?: string; // Breakfast spot
            tips?: string;
            whyVisit?: string;
            worthIt?: string; // NEW: Personal insight
            bestTime?: string; // NEW
            avoid?: string; // NEW
            transitToNext?: string;
            localSecret?: string;
        };
        afternoon: {
            time: string;
            activity: string; // Main attraction or secondary
            location?: string;
            locationCoordinates?: [number, number];
            travelTime?: string;
            duration?: string; // NEW
            cost?: string; // NEW
            food?: string; // Lunch spot
            foodType?: string; // Cuisine
            tips?: string;
            whyVisit?: string;
            worthIt?: string; // NEW
            bestTime?: string; // NEW
            avoid?: string; // NEW
            transitToNext?: string;
            localSecret?: string;
        };
        evening: {
            time: string;
            activity: string;
            location?: string;
            locationCoordinates?: [number, number];
            travelTime?: string;
            duration?: string; // NEW
            cost?: string; // NEW
            food?: string; // Dinner
            foodBudget?: string;
            foodPremium?: string;
            tips?: string; // Nightlife or chill
            whyVisit?: string;
            worthIt?: string; // NEW
            bestTime?: string; // NEW
            avoid?: string; // NEW
            transitToNext?: string;
            localSecret?: string;
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
        restaurantRecommendations: { 
            name: string; 
            priceRange: string; 
            cuisine: string; 
            bestDish?: string; // NEW
            avoidDish?: string; // NEW
            notes?: string 
        }[];
        placesToRegret?: string[]; // NEW
        touristTrapsToAvoid?: string[]; // NEW
        dietaryOptions?: string; // Veg/Vegan
        foodSafety: string; // What not to eat
    };

    // 7. Transport Playbook
    transport: {
        cityLayout: string;
        modes: { type: string; tips: string; cost?: string; bestFor?: string }[]; // Metro, Cab, Walking
        passes: string; // Day passes etc
        walkingAdvice: string;
        apps: string[];
        scams: string;
        airportTransfer: string;
        dailyStrategy: string;
        recommendedTransport?: string; // NEW
        notRecommendedTransport?: string; // NEW
    };

    // 8. Hidden Gems (Secrets)
    secrets: {
        places: {
            name: string;
            description: string;
            type: string;
            bestTime?: string;
            idealFor?: string;
            lessCrowdedAlternative?: string; // NEW
            isPhotoSpot?: boolean; // NEW
            tips?: string;
            locationUrl?: string;
        }[];
    };

    mistakes?: { // NEW SECTION
        biggestMistake: string;
        timeWasters: string;
        moneyWasters: string;
        neverAgain: string;
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
        wishIKnew?: string; // NEW
    };

    // 13. Bonus & Value Adds
    bonus: {
        googleMapsLink?: string;
        reservationTips?: string;
        commonMistakes?: string;
        tripUpgrades?: string;
        includePackingChecklist?: boolean;
        includeBudgetPlanner?: boolean;
        externalLinks: { label: string; url: string }[];
    };
    
    review?: { // NEW SECTION
        exceededExpectations: string;
        disappointments: string;
        recommendOverall: string;
    };

    finalNote?: string; // NEW SECTION

    proofOfVisit: {
        images: { url: string; caption: string }[];
        notes?: string;
    };
    affiliateProducts?: {
        id?: string;
        title: string;
        productUrl: string;
        imageUrl?: string;
        priceDisplay?: string;
        category?: string;
        isPublic?: boolean; // If true, visible even before purchase
    }[];
    creatorProducts?: {
        title: string;
        url: string;
        imageUrl?: string;
        description?: string;
        price?: string;
    }[];
    days?: any[]; // Legacy/Migration support for content.days
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
        tags: [],
        coverImage: "",
    },
    preTrip: {
        flightGuide: { bestAirports: [], arrivalDepartureStats: "" },
        packingList: [],
        essentials: { documents: [], insurance: "", health: [] },
    },
    accommodation: {
        bestNeighborhoods: [],
        hotelRecommendations: [],
        bookingTips: ""
    },
    logistics: {
        currency: { code: "USD", exchangeTips: "", cashVsCard: "", dailyBudgetEstimate: "" },
        connectivity: { simOptions: [], wifiTips: "", powerAdapters: "" },
        apps: [],
    },
    arrival: { airportToCity: "", checkInProcess: "", firstMealSuggestion: "", orientationTips: "", simCardPickUp: "" },
    dailyItinerary: [
        {
            dayNumber: 1,
            title: "",
            description: "",
            morning: { time: "09:00", activity: "", travelTime: "15m", whyVisit: "", tips: "", transitToNext: "", localSecret: "" },
            afternoon: { time: "13:00", activity: "", travelTime: "20m", whyVisit: "", tips: "", transitToNext: "", localSecret: "" },
            evening: { time: "18:00", activity: "", travelTime: "10m", whyVisit: "", tips: "", transitToNext: "", localSecret: "" },
            logistics: { transport: "", travelTime: "" }
        }
    ],
    food: { mustTryDishes: [], restaurantRecommendations: [], foodSafety: "" },
    transport: { cityLayout: "", modes: [], passes: "", walkingAdvice: "", apps: [], scams: "", airportTransfer: "", dailyStrategy: "" },
    secrets: { places: [] },
    safety: { commonScams: [], safetyTips: [], culturalDosAndDonts: [], emergencyNumbers: [] },
    customization: {},
    shopping: { whatToBuy: [], bestMarkets: [] },
    departure: { checkoutTips: "", airportBuffer: "" },
    postTrip: {},
    bonus: {
        googleMapsLink: "",
        reservationTips: "",
        commonMistakes: "",
        tripUpgrades: "",
        includePackingChecklist: true,
        includeBudgetPlanner: true,
        externalLinks: []
    },
    proofOfVisit: {
        images: [],
        notes: ""
    },
    affiliateProducts: [],
    creatorProducts: []
};
