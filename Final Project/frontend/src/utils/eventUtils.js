import { getToken } from "./getToken";

const URL = 'https://cloud-app-dev-amen.uc.r.appspot.com'

export const fetchEvents = async () => {
    const token = getToken();
    const id = localStorage.getItem("uid");

    try {
        const response = await fetch(`${URL}/events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'uid': id,
                'Authorization': `Bearer ${token}`,
            },
        });

        if(response.ok) {
            return await response.json()
        } else {
            const errorData = await response.json();
            console.error('Error at event requesting:', errorData);
        }
    } catch(error) {
        console.error('Error at event requesting:', error);
    }
};

export const fetchUserEvents = async () => {
    const token = getToken();
    const id = localStorage.getItem("uid");

    try {
        const response = await fetch(`${URL}/events/${id}`, {
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
            console.error('Error at event requesting:', errorData);
        }
    } catch(error) {
        console.error('Error at event requesting:', error);
    }
}

export const fetchEvent = async (eventId) => {
    const token = getToken();

    try {
        const response = await fetch(`${URL}/events/${eventId}/`, {
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
            console.error('Error at event fetching:', errorData);
        }
    } catch(error) {
        console.error('Error at event requesting:', error);
    }
}

export const deleteEvent = async (eventId) => {
    const token = getToken();

    const response = await fetch(`${URL}/events/${eventId}/`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete event");
    }
};

export const updateEvent = async (eventId, data) => {
    const token = getToken();

    const response = await fetch(`${URL}/events/${eventId}/`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to update event");
    }
};