import {useEffect, useState, useRef} from 'react';

const TTL = 5 * 60 * 1000;// 5 min in millisec


const isSessionStorageAvailable = () =>{

    try{
        const testKey = '__test__';
        sessionStorage.setItem(testKey, testKey);
        sessionStorage.removeItem(testKey);
        return true;
    }catch{
        return false
    }
}

const memoryCache = {};

export default function useFetch(url, options = {}){

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const cacheKey = `fetch:${url}`;
    const sessionAvailable = isSessionStorageAvailable();

    const loadData = async (forceRefresh = false) =>{
        setLoading(true);
        setData(null)

        if(!forceRefresh){
            const cached = sessionAvailable ? sessionStorage.getItem(cacheKey) : memoryCache[cacheKey];

            if(cached){
                const {data, ts} = JSON.parse(cached);

                if(Date.now() - ts < TTL){
                    setData(data);
                    setLoading(false);
                    return;
                }
            }
        }

        try{
            abortControllerRef.current = new AbortController();
            const res = await fetch(url, {
                ...options,
                signal:abortControllerRef.current.signal,
            });

            if(!res.ok){
                throw new Error(`Error ${res.status}`);
            }
            const result = await res.json();

            const cacheData = JSON.stringify({data:result,ts:Date.now()});

            if(sessionAvailable){
                sessionStorage.setItem(cacheKey, cacheData);
            }else{
                memoryCache[cacheKey] = cacheData;
            }

            setData(result);
        }catch(err){
            if(err.name !== "AbortError"){
                setError(err);
            }
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        loadData();

        return ()=>{
            abortControllerRef.current?.abort();
        }
    },[url]);

    const refetch = () => loadData(true);

    return {data, error, loading, refetch};
}