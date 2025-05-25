import React from 'react';
import { useGetDashboardDataQuery } from '../../services/dashboardApi';
import { useSelector } from 'react-redux';
import PieChart from '../Charts/PieChart'; // Ensure this path is correct


const DebitBreakdown = ({ filter }) => {
    const { access_token } = useSelector((state) => state.auth);
    const { data: apiResponse, error, isLoading } = useGetDashboardDataQuery({ // Renamed 'data' to 'apiResponse' for clarity
        access_token,
        path: "debit-breakdown",
        type: filter,
    });

    const data = apiResponse?.data;

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!data) return <div>No data available.</div>;


    const calculateTotal = (items) => {
        if (!Array.isArray(items)) {
            console.warn("Expected an array for calculateTotal, but received:", items);
            return 0;
        }
        return items.reduce((sum, item) => sum + Number(item.transaction_amount), 0);
    };

    const billsTotal = data.bills ? calculateTotal(data.bills) : 0;
    const wantsTotal = data.wants ? calculateTotal(data.wants) : 0;
    const needsTotal = data.needs ? calculateTotal(data.needs) : 0;


    console.log("Bills Total:", billsTotal);
    console.log("Wants Total:", wantsTotal);
    console.log("Needs Total:", needsTotal);


    const chartOptions = {
        chart: {
            type: 'pie'
        },
        title: {
            text: `Debit Breakdown (${data.type})`
        },
        tooltip: {
            pointFormat: '{series.name}: <b>Rs. {point.y}</b>'
        },
        series: [{
            name: 'Amount',
            colorByPoint: true,
            data: [
                {
                    name: 'Bills',
                    y: billsTotal
                },
                {
                    name: 'Wants',
                    y: wantsTotal
                },
                {
                    name: 'Needs',
                    y: needsTotal
                }
            ]
        }]
    };

    return (
        <div>
            <PieChart options={chartOptions} />
        </div>
    );
};

export default DebitBreakdown;