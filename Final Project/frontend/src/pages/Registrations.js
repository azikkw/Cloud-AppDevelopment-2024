import React, {useEffect, useState} from "react";
import {deleteRegistration, fetchRegistrations} from "../utils/eventRegistrationUtils";

const Registrations = () => {

    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        getRegistration();
    }, []);

    const getRegistration = async () => {
        const data = await fetchRegistrations();
        setRegistrations(data);
    };

    const handleDelete = async (id, eventId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this registration?");
        if(confirmDelete) {
            try {
                await deleteRegistration(id, eventId);
                await getRegistration();
            } catch (err) {
                console.log("Ошибка при удалении события: ", err);
            }
        }
    };

    return <div>
        <h2 className="text-3xl font-bold mb-6">Registrations</h2>
        <ul className="space-y-2">
            {
                registrations && registrations.length > 0 ? (
                    registrations.map((registrationItem) => (
                        <li key={registrationItem.id}
                            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                        >
                            <h3 className="font-semibold text-gray-700">{registrationItem.id}</h3>
                            <p className="text-gray-600 mt-1">Registration date is {registrationItem.registration_date}</p>
                            <p className="text-gray-600 font-semibold mt-5">{registrationItem.event.title}</p>
                            <p className="text-gray-600 mt-1">{registrationItem.event.description}</p>
                            <p className="text-gray-600 mt-1">In {registrationItem.event.location} | {registrationItem.event.date_time}</p>
                            <p className="text-gray-600 mt-1">Price is <span className="font-semibold">{registrationItem.event.price} tg</span></p>
                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    onClick={() => handleDelete(registrationItem.id, registrationItem.event.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500">No registrations available</li>
                )
            }
        </ul>
    </div>
}
export default Registrations;