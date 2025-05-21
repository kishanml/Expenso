import React, { useEffect, useState } from 'react';
import { useLazyGetDashboardDataQuery } from '../../services/dashboardApi';
import { useSelector } from 'react-redux';
import Card from "../Charts/Card"

const Overview = () => {
    const { access_token } = useSelector((state) => state.auth);

    const [fetchDashboardData] = useLazyGetDashboardDataQuery();

    const [spending, setSpending] = useState({
        weekly: { current: 0, previous: 0, difference: 0 },
        monthly: { current: 0, previous: 0, difference: 0 },
        yearly: { current: 0, previous: 0, difference: 0 },
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [weekRes, monthRes, yearRes] = await Promise.all([
                    fetchDashboardData({ access_token, type: 'weekly', path: 'overview' }).unwrap(),
                    fetchDashboardData({ access_token, type: 'monthly', path: 'overview' }).unwrap(),
                    fetchDashboardData({ access_token, type: 'yearly', path: 'overview' }).unwrap(),
                ]);

                setSpending({
                    weekly: {
                        current: weekRes.data.current_total,
                        previous: weekRes.data.prev_total,
                        difference: weekRes.data.difference,
                    },
                    monthly: {
                        current: monthRes.data.current_total,
                        previous: monthRes.data.prev_total,
                        difference: monthRes.data.difference,
                    },
                    yearly: {
                        current: yearRes.data.current_total,
                        previous: yearRes.data.prev_total,
                        difference: yearRes.data.difference,
                    },
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [access_token, fetchDashboardData]);

    if (loading) {
        return <div className="text-center text-gray-500 mt-8">Loading overview...</div>;
    }

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Weekly Spend" data={spending.weekly} />
            <Card title="Monthly Spend" data={spending.monthly} />
            <Card title="Yearly Spend" data={spending.yearly} />
        </div>
    );
};



export default Overview;
