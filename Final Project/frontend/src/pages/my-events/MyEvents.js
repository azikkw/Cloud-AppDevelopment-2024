import React, {useEffect, useState} from "react";
import {fetchUserEvents} from "../../utils/eventUtils";
import {Link} from "react-router-dom";

const MyEvents = () => {

    const [events, setEvents] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("")
    const [price, setPrice] = useState("")
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        const data = await fetchUserEvents();
        setEvents(data);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://cloud-app-dev-amen.uc.r.appspot.com/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    date_time: dateTime,
                    location,
                    capacity,
                    price,
                    created_by: localStorage.getItem("uid"),
                }),
            });

            if(response.ok) {
                const data = await response.json();
                setMessage(`Event successfully created! Title: ${data.title}`);
                setTitle("");
                setDescription("");
                setDateTime("");
                setLocation("");
                await getEvents();
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Some error occurred.");
            }
        } catch(err) {
            setError("Произошла ошибка: " + err.message);
        }
    };

    return (
        <div className="w-full flex justify-between items-start gap-8">
            <div className="w-[410px] mx-auto bg-white border border-gray-200 rounded-lg p-6 mb-10">
                <h2 className="text-2xl font-bold mb-6">Create event</h2>
                {message && <div className="text-center text-green-600 mb-4">{message}</div>}
                {error && <div className="text-red-600 mb-4">{error}</div>}
                <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date and time</label>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex gap-2.5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(+e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(+e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Create event
                    </button>
                </form>
            </div>
            <ul className="space-y-2 flex-1">
            <li className="text-3xl font-bold mb-7">My Events</li>
                {
                    events && events.length > 0 ? (
                        events.map((eventItem) => (
                            <li key={eventItem.id}
                                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                            >
                                <Link to={`/my-events/${eventItem.id}`} className="">
                                    <h3 className="text-xl font-semibold text-gray-700">{eventItem.title}</h3>
                                    <p className="text-gray-600 mt-2">{eventItem.description}</p>
                                    <p className="text-gray-600 mt-2">In {eventItem.location} | {eventItem.date_time}</p>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="text-center text-gray-500">No events available</li>
                    )
                }
            </ul>
        </div>
    );
};

export default MyEvents;
