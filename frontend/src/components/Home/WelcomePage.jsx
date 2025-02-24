import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { LuCircleFadingPlus } from 'react-icons/lu';
import { BsGraphUpArrow } from 'react-icons/bs';
import { MdOutlineDocumentScanner, MdOutlineEditLocation, MdSettingsInputAntenna } from 'react-icons/md';
import { SiMoneygram } from 'react-icons/si';
import { TbReportMoney } from 'react-icons/tb';
import { GoCommentDiscussion } from 'react-icons/go';
import { GrPieChart } from 'react-icons/gr';

import { useDispatch } from "react-redux";
import { setUserInfo } from "../../features/userSlice";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import { getToken } from "../../services/LocalStorage";

const buttons = [
    { to: '/add-expense', icon: LuCircleFadingPlus, label: 'Add Expense' },
    { to: '/dashboard', icon: GrPieChart, label: 'Dashboard' },
    { to: '/splitwise', icon: SiMoneygram, label: 'Splitwise' },
    { to: '/documents', icon: MdOutlineDocumentScanner, label: 'View Documents' },
    { to: '/income-tax', icon: TbReportMoney, label: 'Income Tax' },
    { to: '/locked-price', icon: MdOutlineEditLocation, label: 'Locked Price' },
    { to: '/investments', icon: BsGraphUpArrow, label: 'Investments' },
    { to: '/discussions', icon: GoCommentDiscussion, label: 'Discussions' },
];

const ButtonLink = ({ to, icon: Icon, label }) => (
    <div className="flex flex-col gap-2 items-center group">
        <Link to={to} className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg shadow text-[#c6252b] hover:bg-[#c6252b] hover:text-white transition-all">
            <Icon className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" />
        </Link>
        <span className="text-base sm:text-xl mt-2 text-center group-hover:text-[#c6252b]">{label}</span>
    </div>
);

const WelcomePage = () => {
    const { access_token } = getToken();

    // const [data, { isSuccess }] = useGetLoggedUserQuery(access_token);
    const { data, isSuccess } = useGetLoggedUserQuery(access_token);

    const [name, setName] = useState("");
    const dispatch = useDispatch();
    console.log("data",data,isSuccess)
    useEffect(() => {
        if (data && isSuccess) {
            setName(data.name)
            dispatch(
                setUserInfo({
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    //   contact_number: data.contact_number,
                    //   game_ids: data.game_ids,
                    //   role_type: data.role_type,
                })
            );
        } else {
            dispatch(
                setUserInfo({
                    id: "",
                    name: "",
                    email: "",
                    //   contact_number: "",
                    //   game_ids: {},
                    //   role_type: "BASIC",
                })
            );
        }
    }, [isSuccess, data, dispatch]);


    {return (
        <>
            <div className="min-h-screen px-4 sm:px-10 md:px-20 flex flex-col items-center">
                <div className="w-full max-w-4xl flex justify-between items-center py-8">
                    <p className="text-2xl sm:text-3xl font-medium text-center">Welcome {name}</p>
                </div>
                <div className="w-full max-w-5xl flex flex-col items-center bg-neutral-200 rounded-2xl p-6 sm:p-10 mt-6 shadow-md">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 sm:gap-14">
                        {buttons.map((btn) => (
                            <ButtonLink key={btn.to} {...btn} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )}
};

export default WelcomePage;