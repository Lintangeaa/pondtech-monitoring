import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import { FaBalanceScale, FaThermometerHalf, FaWater } from "react-icons/fa";

const Monitoring = ({ auth, sensorDatas, sensorData }) => {
    const [refreshInterval, setRefreshInterval] = useState(null);

    // Fungsi untuk mengonversi suhu ke unit lain
    const convertTemperature = (temperature, targetUnit) => {
        if (targetUnit === "Reamur") {
            return ((temperature - 32) * 4) / 9;
        } else if (targetUnit === "Fahrenheit") {
            return (temperature * 9) / 5 + 32;
        } else if (targetUnit === "Kelvin") {
            return temperature + 273.15;
        }
        // Default: Celsius
        return temperature;
    };

    // Fungsi untuk mendapatkan waktu Indonesia
    const getTime = (time) => {
        const utc = new Date(time);
        const options = {
            timeZone: "Asia/Jakarta", // Mengatur zona waktu ke Indonesia
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false, // Format jam 24 jam
        };

        // Mendapatkan waktu dalam format Indonesia
        const waktuIndonesia = utc.toLocaleString("id-ID", options);

        return waktuIndonesia;
    };

    const [datas, setDatas] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/sensor-data");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData()
                .then((newData) => {
                    setDatas(newData);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    console.log(datas);

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Monitoring
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex justify-between p-6 px-40 text-gray-900">
                            <div className="flex flex-col items-center w-40 p-4 bg-green-200 rounded-lg shadow-lg">
                                <FaThermometerHalf className="text-4xl" />
                                <p>Suhu (Celsius)</p>
                                {datas?.sensorData.temperature ||
                                    sensorData.temperature}{" "}
                                °C
                            </div>
                            <div className="flex flex-col items-center w-40 p-4 bg-red-200 rounded-lg shadow-lg">
                                <FaBalanceScale className="text-4xl" />
                                <p>pH</p>
                                {datas?.sensorData.ph || sensorData.ph}
                            </div>
                            <div className="flex flex-col items-center w-40 p-4 rounded-lg shadow-lg bg-cyan-200">
                                <FaWater className="text-4xl" />
                                <p>Salinitas</p>
                                {datas?.sensorData.salinity ||
                                    sensorData.salinity}{" "}
                                ppt
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                                        Jam
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                                        Suhu (Celsius)
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                                        pH
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                                        Salinitas
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sensorDatas.map((data, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {
                                                getTime(data.created_at).split(
                                                    ","
                                                )[0]
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {
                                                getTime(data.created_at).split(
                                                    ","
                                                )[1]
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {convertTemperature(
                                                data.temperature,
                                                "Celsius"
                                            ).toFixed(2)}{" "}
                                            °C
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {data.ph}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {data.salinity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default Monitoring;
