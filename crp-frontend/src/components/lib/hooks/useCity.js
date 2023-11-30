import {useCallback, useState} from "react";
import axios from "axios";


export function useCity() {
    const [city, setCity] = useState([])

    const initCity = useCallback(async () => {
        const { data } = await axios.get('https://core.shoplover.com/sll/v1/states')
        setCity(data.data.map(({id, name}) => ({id, name})))
    }, [])

    return {
        city,
        initCity,
    }
}