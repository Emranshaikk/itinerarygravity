"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, PieChart, TrendingUp, DollarSign } from "@/components/Icons";

interface Expense {
    id: string;
    day_number: number;
    amount: number;
    category: string;
    description: string;
}

interface BudgetTrackerProps {
    itineraryId: string;
    dailyBudgetEstimate: string;
    totalDays: number;
}

export default function BudgetTracker({ itineraryId, dailyBudgetEstimate, totalDays }: BudgetTrackerProps) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [dayNumber, setDayNumber] = useState(1);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("food");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [itineraryId]);

    async function fetchExpenses() {
        try {
            const response = await fetch(`/api/expenses?itinerary_id=${itineraryId}`);
            if (response.ok) {
                const data = await response.json();
                setExpenses(data);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddExpense(e: React.FormEvent) {
        e.preventDefault();
        if (!amount) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itinerary_id: itineraryId,
                    day_number: dayNumber,
                    amount: parseFloat(amount),
                    category,
                    description
                })
            });

            if (response.ok) {
                const newExpense = await response.json();
                setExpenses([...expenses, newExpense]);
                setAmount("");
                setDescription("");
                setShowAddForm(false);
            }
        } catch (error) {
            console.error("Error adding expense:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteExpense(id: string) {
        if (!confirm("Are you sure you want to delete this expense?")) return;

        try {
            const response = await fetch(`/api/expenses?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setExpenses(expenses.filter(e => e.id !== id));
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    }

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Try to parse estimate (very basic)
    const estimateNumeric = parseFloat(dailyBudgetEstimate.replace(/[^0-9.]/g, '')) || 0;
    const totalEstimate = estimateNumeric * totalDays;

    return (
        <section style={{ marginBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DollarSign size={32} color="var(--primary)" />
                        Expense Tracker
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Track your actual trip spending against the creator's recommendation of <strong>{dailyBudgetEstimate}</strong> per day.
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            {/* Stats Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--gray-400)', marginBottom: '12px' }}>
                        <DollarSign size={20} /> Total Spent
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--foreground)' }}>
                        ${totalSpent.toFixed(2)}
                    </div>
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--gray-400)', marginBottom: '12px' }}>
                        <TrendingUp size={20} /> Budget Performance
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: totalSpent > totalEstimate ? '#ef4444' : '#10b981' }}>
                        {totalEstimate > 0
                            ? `${((totalSpent / totalEstimate) * 100).toFixed(0)}% of recommended budget`
                            : "Recommended budget unknown"}
                    </div>
                    <div style={{ height: '8px', background: 'var(--surface)', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.min((totalSpent / (totalEstimate || 1)) * 100, 100)}%`,
                            background: totalSpent > totalEstimate ? '#ef4444' : 'var(--primary)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>
            </div>

            {showAddForm && (
                <div className="glass card" style={{ padding: '32px', marginBottom: '40px', border: '1px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Add New Expense</h3>
                    <form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label className="label">Day Number</label>
                            <input
                                type="number"
                                className="form-input"
                                value={dayNumber}
                                min={1}
                                max={totalDays}
                                onChange={(e) => setDayNumber(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="label">Amount ($)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={amount}
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Category</label>
                            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="food">🍔 Food & Drink</option>
                                <option value="transport">🚕 Transport</option>
                                <option value="hotel">🏨 Accommodation</option>
                                <option value="activities">🎟️ Activities</option>
                                <option value="shopping">🛍️ Shopping</option>
                                <option value="other">✨ Other</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Description</label>
                            <input
                                type="text"
                                className="form-input"
                                value={description}
                                placeholder="e.g. Lunch at Fish Market"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Expense'}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Expense List */}
            {isLoading ? (
                <div style={{ textAlign: 'center', color: 'var(--gray-400)' }}>Loading expenses...</div>
            ) : expenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--gray-400)' }}>
                    No expenses logged yet. Start tracking your spend!
                </div>
            ) : (
                <div className="glass card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Day</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Category</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Description</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Amount</th>
                                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>Day {expense.day_number}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span className="badge" style={{ textTransform: 'capitalize' }}>{expense.category}</span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--gray-400)' }}>{expense.description || "-"}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>${expense.amount.toFixed(2)}</td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6 }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
