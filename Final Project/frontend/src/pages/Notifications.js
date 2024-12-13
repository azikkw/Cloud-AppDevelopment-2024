import {useEffect, useState} from "react";
import {getToken} from "../utils/getToken";
import {Link} from "react-router-dom";

const Notifications = () => {

    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        const token = getToken();
        const id = localStorage.getItem("uid");

        try {
            const response = await fetch(`https://cloud-app-dev-amen.uc.r.appspot.com/notifications/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if(response.ok) {
                const data = await response.json()
                setNotifications(data)
            } else {
                const errorData = await response.json();
                console.error('Error at notifications requesting:', errorData);
            }
        } catch(error) {
            console.error('Error at notifications requesting:', error);
        }
    };

    return <div>
        <h2 className="text-3xl font-bold mb-6">Notifications</h2>
        <ul className="space-y-2">
            {
                notifications && notifications.length > 0 ? (
                    notifications.sort((a, b) => {
                        return new Date(b.sent_at) - new Date(a.sent_at);
                    }).map((notificationItem) => (
                        <li key={notificationItem.id}
                            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-700">{notificationItem?.id}</h3>
                            <p className="text-gray-600 mt-2">{notificationItem?.message}</p>
                            <p className="text-gray-600 mt-2">{notificationItem?.sent_at}</p>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500">No notifications available</li>
                )
            }
        </ul>
    </div>
}
export default Notifications;