import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEvent } from "../../utils/eventUtils";
import Review from "../../components/Review";
import {registrationToEvent} from "../../utils/eventRegistrationUtils";

const EventPage = () => {

    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        getEvent().then()
    }, []);

    const getEvent = async () => {
        try {
            const data = await fetchEvent(id);
            if(data) {
                setEvent(data);
                await getEventCreator(data.created_by);
                await checkIfRegistered()
            } else {
                setError("Event not found");
            }
        } catch (err) {
            setError("Ошибка загрузки события.");
        } finally {
            setLoading(false);
        }
    };

    const getEventCreator = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://cloud-app-dev-amen.uc.r.appspot.com/profile/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setCreator(data);
        } catch (err) {
            setError("Ошибка при загрузке данных.");
        }
    };

    const registerUserToEvent = async () => {
        const confirmRegistration = window.confirm("Are you sure you want to register to this event?");
        if(confirmRegistration) {
            const result = await registrationToEvent(id, creator.id)
            if(result) {
                alert(result)
                await checkIfRegistered()
            }
        }
    }

    const checkIfRegistered = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("uid");

        try {
            const response = await fetch(`https://cloud-app-dev-amen.uc.r.appspot.com/registrations/${id}/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(response.ok) {
                const data = await response.json();
                if(data.message === "Registration exists") {
                    setRegistered(true);
                }
            } else {
                setRegistered(false);
            }
        } catch (err) {
            setError("Ошибка при проверке отзыва.");
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">{event?.title}</h1>
            <p className="text-gray-700 mb-2">
                <span className="font-semibold">Description:</span> {event?.description || "Нет описания"}
            </p>
            <p className="text-gray-700 mb-2">
                <span className="font-semibold">Date and time:</span> {event?.date_time || "Не указано"}
            </p>
            <p className="text-gray-700 mb-2 flex gap-2">
                <span className="font-semibold">Location:</span> {event?.location}
                <span className="font-semibold">Capacity:</span> {event?.capacity}
            </p>
            <p className="text-gray-700 mb-2">
                <span className="font-semibold">Price:</span> {event?.price || "Неизвестно"}
            </p>
            <p className="text-gray-700 mb-5">
                <span className="font-semibold">Created by:</span> {creator?.username || "Неизвестно"}
            </p>
            <div className="mb-6">
                {
                    event.capacity > 0 ?
                        registered ? <button
                                className="bg-gray-300 px-4 py-2 rounded-lg"
                                disabled
                            >
                                You registered to this event.
                            </button> :
                            <button
                                onClick={registerUserToEvent}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Register to event
                            </button>
                        : <button
                            className="bg-gray-300 px-4 py-2 rounded-lg"
                            disabled
                        >
                            All tickets are over.
                        </button>
                }
            </div>
            <Review eventId={id} eventCreator={creator.id}/>
        </div>
    );
};

export default EventPage;
