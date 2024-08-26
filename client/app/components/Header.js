'use client'

import { useApolloClient, gql, useQuery } from '@apollo/client'
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'

// GraphQL query to fetch the user data
const GET_USER = gql`
   query getUser {
        getUser {
            id
            nombre
            apellido
            email
        }
    }`

function Header() {

    const client = useApolloClient();
    const router = useRouter();

    // Apollo query to get the current user data
    const { data, loading, error } = useQuery(GET_USER);

    // Function to handle user logout
    const closeSession = () => {
        deleteCookie('session-token'); // Delete session cookie
        client.clearStore(); // Clear Apollo client store
        router.push('/login'); // Redirect to login page
    }

    if (loading) {
        return 'Loading...'; // Show loading state while fetching data
    }

    return (
        <header className="flex flex-col sm:flex-row sm:justify-end items-center mb-6">
            {data.getUser ? (
                <p className='mb-4 sm:mb-0 sm:mr-2 text-center w-full sm:w-auto'>
                    Hello {data.getUser.nombre}
                </p>
            ) : null}
            <button
                onClick={closeSession}
                type='button'
                className='bg-blue-800 w-1/3 sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
            >
                Log out
            </button>
        </header>
    )
}

export default Header
