import axios from 'axios';

const reuqest = axios.create();

const getImage = (url: string) => reuqest({
    url,
    method: 'get',
    responseType: 'blob'
}).then(response => {
    if (response.status === 200) return response.data;
    throw new Error('失败');
});

export default {
    getImage,
    ...reuqest
};