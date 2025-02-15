import Link from "next/link"

export default function Sidebar(){
    return (
            <aside className="min-h-screen bg-white text-gray-500 w-[100%] border-r fixed top-15 left-0 pt-4 p-2 z-[99]">
                <div className="pt-5 text-2xl"><h1><strong>ADD WIDGETS</strong></h1></div>

                
                <ul className="pt-5 space-y-1">
                    <li>
                        <Link href="/home"><strong>+ LA BIBLIA</strong></Link>             
                    </li>
                    <li>
                        <Link href="/blog"><strong>+ CALCULADORA</strong></Link>             
                    </li>
                    <li>
                        <Link href="/settings"><strong>+ CLIMA</strong></Link>             
                    </li>
                    <li>
                        <Link href="/test"><strong>+ OROMARTV</strong></Link>             
                    </li>
                    <li>
                        <Link href="/test"><strong>+ JUEGOS</strong></Link>             
                    </li>
                </ul>
            </aside> 
    )
}