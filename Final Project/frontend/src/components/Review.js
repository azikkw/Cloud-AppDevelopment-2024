import { useState, useEffect } from "react";
import {getToken} from "../utils/getToken";

const Review = ({ eventId, eventCreator }) => {
    const [hasReviewed, setHasReviewed] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        checkIfReviewed(eventId);
        getReviews()
    }, [eventId]);

    const getReviews = async () => {
        const token = getToken();

        try {
            const response = await fetch('https://cloud-app-dev-amen.uc.r.appspot.com/reviews/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'event-id': eventId,
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

    const checkIfReviewed = async (eventId) => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("uid");

        try {
            const response = await fetch(`https://cloud-app-dev-amen.uc.r.appspot.com/reviews/${eventId}/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(response.ok) {
                const data = await response.json();
                if(data.message === "Review exists") {
                    setHasReviewed(true);
                }
            } else {
                setHasReviewed(false);
            }
        } catch (err) {
            setError("Ошибка при проверке отзыва.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("uid");
        const username = await getUsername(userId)

        const reviewData = {
            event_id: eventId,
            user_id: userId,
            rating: rating,
            comment: comment,
            username: username,
            event_creator: eventCreator
        };
        console.log(reviewData)

        try {
            const response = await fetch("https://cloud-app-dev-amen.uc.r.appspot.com/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            if (response.ok) {
                alert("Review successfully added");
                await getReviews();
                await checkIfReviewed(eventId)
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Ошибка при добавлении отзыва");
            }
        } catch (err) {
            alert("Ошибка при отправке отзыва.");
        }
    };

    const getUsername = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://cloud-app-dev-amen.uc.r.appspot.com/profile/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            return data.username
        } catch (err) {
            setError("Ошибка при загрузке данных.");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Reviews</h1>
            {
                hasReviewed || <div className="max-w-4xl mx-auto mt-4 bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Add your review</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="rating" className="block text-gray-700 font-semibold mb-2">
                                Оценка:
                            </label>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="0">Select a rating</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
                                Comment:
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Your comment"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Leave review
                        </button>
                    </form>
                </div>
            }
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
    );
};

export default Review;
