import axiosInstance from "src/config/config";

export const getSuggestion = async (payload?: any) => {
    let queryString = 'https://hotels4.p.rapidapi.com/locations/v2/search';
    // let queryString = 'https://travel-advisor.p.rapidapi.com/locations/search'
    return await axiosInstance
        .get(queryString, {
            params: payload,
            headers: {
                'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
                'X-RapidAPI-Key': '288eff7fd2mshf08524ba81443cdp1e3fc7jsn22145c6bb9ea'
            }
        })
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};

export const getSuggestionThingToDo = async (payload?: any) => {
    let queryString = 'https://travel-advisor.p.rapidapi.com/locations/search'
    return await axiosInstance
        .get(queryString, {
            params: payload,
            headers: {
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
                'X-RapidAPI-Key': '288eff7fd2mshf08524ba81443cdp1e3fc7jsn22145c6bb9ea'
            }
        })
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};

export const getSuggestionAttraction = async (payload?: any) => {
    let queryString = 'https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng';
    return await axiosInstance
        .get(queryString, {
            params: payload,
            headers: {
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
                'X-RapidAPI-Key': '288eff7fd2mshf08524ba81443cdp1e3fc7jsn22145c6bb9ea'
            }
        })
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};
export const getSuggestionHotels = async (payload?: any) => {
    let queryString = 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng';
    return await axiosInstance
        .get(queryString, {
            params: payload,
            headers: {
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
                'X-RapidAPI-Key': '288eff7fd2mshf08524ba81443cdp1e3fc7jsn22145c6bb9ea'
            }
        })
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};




export const getSuggestionDetail = async (payload: any) => {
    let queryString = 'https://hotels4.p.rapidapi.com/properties/list';
    console.log(queryString)
    return await axiosInstance
        .get(queryString, {
            // params: {
            //     destinationId: destinationId,
            //     pageNumber: payload?.pageNumber || '1',
            //     pageSize: payload?.pageSize || '25',
            //     checkIn: payload?.checkIn || '2022-04-17',
            //     checkOut: payload?.checkOut || '2022-05-01',
            //     adults1: payload?.people || '4',
            //     sortOrder: payload?.sortOrder || 'PRICE',
            //     locale: 'vi_VN',
            //     currency: 'VND'
            // },
            params: payload
        })
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};



export const getAirport = async (lat: number, lon: number, payload?: any) => {
    let queryString = `https://aerodatabox.p.rapidapi.com/airports/search/location/${lat}/${lon}/km/100/30`;
    return await axiosInstance
        .get(queryString, {
            params: payload,
            headers: {
                'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
                'X-RapidAPI-Key': '288eff7fd2mshf08524ba81443cdp1e3fc7jsn22145c6bb9ea'
            }
        })
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};


export const getFlight = async (payload?: any) => {
    let queryString = 'https://priceline-com-provider.p.rapidapi.com/v1/flights/search';
    return await axiosInstance
        .get(queryString, {
            params: payload,
            headers: {
                'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
                'X-RapidAPI-Key': '288eff7fd2mshf08524ba81443cdp1e3fc7jsn22145c6bb9ea'
            }
        })
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};
