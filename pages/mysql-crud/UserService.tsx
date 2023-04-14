import { User } from "./UserType";

export const UserService = {

    getUsers() {
        return fetch(' http://localhost:3000/api/users', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },

    createUser(user: User) {
        return fetch(' http://localhost:3000/api/users',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                }),


            }

        )
            .then((res) => res.json());
    },
    updateUser(user: User) {
        return fetch(`http://localhost:3000/api/users/${user.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'PUT',
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                }),


            }

        )
            .then((res) => res.json());
    },
    deleteUser(user: User) {
        return fetch(`http://localhost:3000/api/users/${user.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'DELETE',
            }

        )
            .then((res) => res.json());
    },

};