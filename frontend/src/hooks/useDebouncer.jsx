import { useEffect, useState } from "react";


export const useDebouncer = (filter, time) => {
    const [debouncedFilter, setDebouncedFilter] = useState(filter);
    useEffect(() => {
        const previousTimeout = setTimeout(() => {
            setDebouncedFilter(filter);
        }, time);
        return ()=>{
            clearTimeout(previousTimeout);
        } 
    },[filter])


    return debouncedFilter;
}