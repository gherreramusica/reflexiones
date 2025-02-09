export async function GET(req:Request){


    const productos = [
        {
            id: 1,
            name: 'Iphone',
            price: 780,
            description: 'Telefonos inteligentes'
        },
        {
            id: 2,
            name: 'Samgsung',
            price: 105,
            description: 'Telefonos inteligentes'
        },
        {
            id: 3,
            name: 'Honor',
            price: 89,
            description: 'Telefonos inteligentes'
        },

    ]
   
    return new Response(JSON.stringify(productos), {
        status:200,
        headers: {"Content-Type":"application/json"},
    })
}