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

    //Routing

    const router = useRouter()

    //Apollo query

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
        <header className="flex justify-end">
            {data.getUser ? <p className='mr-2'>Hola {data.getUser.nombre}</p> : null}
            <button onClick={() => closeSession()}
                type='button'
                className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
            >Cerrar sesión</button>
        </header>
    )
}

export default Header