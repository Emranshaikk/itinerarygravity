"use client";

import React from "react";
import { CheckCircle } from "./Icons";

interface VerifiedBadgeProps {
    size?: number;
    showLabel?: boolean;
}

export default function VerifiedBadge({ size = 16, showLabel = false }: VerifiedBadgeProps) {
    return (
        <span
            title="Verified Creator"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#10b981',
                marginLeft: '4px',
                verticalAlign: 'middle'
            }}
        >
            <CheckCircle
                size={size}
                fill="#10b981"
                style={{ color: 'white' }}
            />
            {showLabel && (
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Verified</span>
            )}
        </span>
    );
}
