export default function extract(data)
{
    if(data['hydra:member'])
        data = data['hydra:member'];
    if(data['hits'])
        data = data['hits']['hits'];
    return data;
}