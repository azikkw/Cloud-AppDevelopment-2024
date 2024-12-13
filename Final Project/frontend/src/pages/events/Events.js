import {useEffect, useState} from "react";
import {fetchEvents} from "../../utils/eventUtils";
import {Link} from "react-router-dom";

const Events = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        const data = await fetchEvents();
        setEvents(data);
    };

    return <div className="w-full">
        <h2 className="text-3xl font-bold mb-6">Events</h2>
        <ul className="space-y-2">
            {
                events && events.length > 0 ? (
                    events.map((eventItem) => (
                        <li key={eventItem.id}
                            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                        >
                            <Link to={`/events/${eventItem.id}`} className="relative">
                                <h3 className="text-xl font-semibold text-gray-700">{eventItem.title}</h3>
                                <p className="text-gray-600 mt-2">{eventItem.description}</p>
                                <p className="text-gray-600 mt-2">In {eventItem.location} | {eventItem.date_time}</p>
                                <p className="absolute right-2 bottom-0 text-xl font-semibold">{eventItem.price} tg</p>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500">No events available</li>
                )
            }
        </ul>
    </div>

}
export default Events;