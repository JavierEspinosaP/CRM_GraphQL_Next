'use client'

import { useApolloClient, gql, useQuery } from '@apollo/client'
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'

const GET_USER = gql`
   query getUser{
        getUser{
            id
            nombre
            apellido
            email
        }
    }`

function Header() {

    const client = useApolloClient();

    // Routing
    const router = useRouter()

    // Apollo query
    const { data, loading, error } = useQuery(GET_USER)

    const closeSession = () => {
        deleteCookie('session-token')
        client.clearStore();
        router.push('/login')
    }

    if (loading) {
        return 'Cargando'
    }

    return (
        <header className="flex flex-col sm:flex-row sm:justify-end items-center mb-6">
            {data.getUser ? <p className='mb-4 sm:mb-0 sm:mr-2 text-center w-full sm:w-auto'>Hola {data.getUser.nombre}</p> : null}
            <button onClick={() => closeSession()}
                type='button'
                className='bg-blue-800 w-1/3 sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
            >
                Cerrar sesión
            </button>
        </header>
    )
}

export default Header
