import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';



const PieChart = ({ options }) => {
    return (
        <div className="w-full">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};


export default PieChart
