'use client'

import { useState, useEffect } from "react"

interface Product {
    id:number,
    name: 'string',
    price: number,
    description: 'string',
}

export default function Products(){
const [products, setProducts] = useState<Product[]>([])

useEffect(() => {
    fetch("/api/products")
    .then((res) => res.json())
    .then((data) => setProducts(data))
}, [])

    return(
        <div>
            
                {products.map((product) => (
                    <ul key={product.id}>
                        <li>{product.name}</li>
                        <li>{product.price}</li>
                        <li>{product.description}</li>
                    </ul>
                ))}
                
            
        </div>
    )
}