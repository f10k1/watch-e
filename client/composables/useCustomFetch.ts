export const useCustomFetch = async (url: string, opts?: any) => {
    return await useFetch(`http://localhost:8083/${url}`, opts);
};