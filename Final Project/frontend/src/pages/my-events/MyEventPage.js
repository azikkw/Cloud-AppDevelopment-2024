import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEvent, deleteEvent, updateEvent } from "../../utils/eventUtils";
import {getToken} from "../../utils/getToken";

const MyEventPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date_time: "",
        location: "",
        capacity: "",
        price: ""
    });
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        getEvent()
        getReviews()
    }, []);

    const getEvent = async () => {
        try {
            const data = await fetchEvent(id);
            if(data) {
                setEvent(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    date_time: data.date_time,
                    location: data.location,
                    capacity: data.capacity,
                    price: data.price
                });
            } else {
                setError("Event does not exist");
            }
        } catch (err) {
            setError("Ошибка загрузки события.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (confirmDelete) {
            try {
                await deleteEvent(id);
                navigate("/my-events");
            } catch (err) {
                setError("Ошибка при удалении события.");
            }
        }
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateEvent(id, formData);
            setIsEditing(false);
            getEvent();
        } catch (err) {
            setError("Ошибка при сохранении изменений.");
        }
    };

    const getReviews = async () => {
        const token = getToken();

        try {
            const response = await fetch('https://cloud-app-dev-amen.uc.r.appspot.com/reviews/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'event-id': id,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                const errorData = await response.json();
                console.error('Error at reviews fetching:', errorData);
            }
        } catch (error) {
            console.error('Error at reviews requesting:', error);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return <div className="max-w-4xl mx-auto mt-10">
        <div className="border border-gray-200 rounded-lg p-6">
            {isEditing ? (
                <>
                    <h1 className="text-3xl font-bold mb-4 text-center">Edit Event</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Date and Time:</label>
                        <input
                            type="datetime-local"
                            name="date_time"
                            value={formData.date_time}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div className="w-full flex gap-2.5 mb-4">
                        <div className="w-1/2">
                            <label className="block font-semibold text-gray-700">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block font-semibold text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleEditToggle}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4 text-center">{event?.title}</h1>
                    <p className="text-gray-700 mb-2">
                        <span className="font-semibold">Description:</span> {event?.description}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-semibold">Date and time:</span> {event?.date_time}
                    </p>
                    <p className="text-gray-700 mb-2 flex gap-2">
                        <span className="font-semibold">Location:</span> {event?.location}
                        <span className="font-semibold">Capacity:</span> {event?.capacity}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-semibold">Price:</span> {event?.price} tg
                    </p>
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            onClick={handleEditToggle}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
        <div className="mt-5 border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold">Reviews</h1>
            <ul className="mt-4 space-y-4">
                {reviews.map((review) => (
                    <li key={review.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col">
                        <p className="text-lg text-gray-800 flex items-center gap-4">
                            <span className="font-semibold">{review.username}</span>
                            <span className="text-[15px] text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </p>
                        <p className="text-2xl text-yellow-500">{"★".repeat(review.rating)}</p>
                        <p className="text-gray-600">{review.comment}</p>
                    </li>
                ))}
            </ul>
        </div>
    </div>
};

export default MyEventPage;

