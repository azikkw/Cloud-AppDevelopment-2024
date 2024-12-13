import { getToken } from "./getToken";

const URL = 'https://cloud-app-dev-amen.uc.r.appspot.com'

export const registrationToEvent = async (id, eventCreator) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("uid");

    const registrationData = {
        event_id: id,
        user_id: userId,
        event_creator: eventCreator
    };

    try {
        const response = await fetch(`${URL}/registrations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(registrationData),
        });

        if(response.ok) {
            return "You successfully registered to event"
        }
    } catch(error) {
        console.log("An error occurred while registering user: ", error);
    }

    return null
}

export const fetchRegistrations = async () => {
    const token = getToken();
    const id = localStorage.getItem("uid");

    try {
        const response = await fetch(`${URL}/registrations/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if(response.ok) {
            return await response.json()
        } else {
            const errorData = await response.json();
            console.error('Error at registrations fetching:', errorData);
        }
    } catch(error) {
        console.error('Error at registrations requesting:', error);
    }
};

export const deleteRegistration = async (id, eventId) => {
    const token = getToken();

    const response = await fetch(`${URL}/registrations/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'event-id': eventId,
            'Authorization': `Bearer ${token}`,
        },
    });
    if(!response.ok) {
        throw new Error("Failed to delete event");
    }
};