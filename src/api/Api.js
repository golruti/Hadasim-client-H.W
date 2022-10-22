import axios from "axios";

const instance = axios.create({
    baseURL: 'https://localhost:7222/Clients/',
});

const GetClients = () => {
    return axios.get(`https://localhost:7222/Clients`)
}


const DeleteClient = (id) => {
    return axios.delete(`https://localhost:7222/Clients/${id}`)
}

const GetClientByIdDetails = (id) => {
    return axios.get(`https://localhost:7222/Clients/${id}`)

    // return instance.get(`${id}`);
}



const addClient = (model) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
    };
    return axios.post(`https://localhost:7222/Clients`, model, axiosConfig)

}

const updateClient = (model) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
    };
    return axios.put(`https://localhost:7222/Clients`, model, axiosConfig)

}


export { GetClients, GetClientByIdDetails, updateClient, addClient, DeleteClient }