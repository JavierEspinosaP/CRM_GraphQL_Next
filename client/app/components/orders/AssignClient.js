'use-client'

import {useState, useEffect} from 'react'

import Select from 'react-select'

const options = [
    { id: 1, name: 'Chocolate' },
    { id: 2, name: 'Strawberry' },
    { id: 3, name: 'Vanilla' }
]


function AssignClient() {


    const [client, setClient] = useState([])



    useEffect(() => {
        console.log(client);
    }, [client])

    const selectClient = client => {
        setClient(client)
    }


    return (<>
        <Select
            options={options}
            isMulti={true}
            onChange={(option) => selectClient(option)}
            getOptionValue={options => options.id}
            getOptionLabel={options => options.name}
            placeholder= "Busque o seleccione el cliente"
            noOptionsMessage={() => "No hay resultados"} />
    </>

    )
}

export default AssignClient