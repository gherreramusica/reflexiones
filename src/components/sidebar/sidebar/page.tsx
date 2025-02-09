import Link from "next/link"

export default function Sidebar(){
    return (
            <aside className="min-h-screen bg-black text-white w-[160px] border-r fixed top-0 left-0 pt-4 p-2 lg:block hidden">
                <div className="font-bold text-xl">REFLEXIONES</div>
                <ul className="space-y-4 pt-20">
                    <li>
                        <Link href="/home"><strong>NOTES</strong></Link>             
                    </li>
                    <li>
                        <Link href="/blog"><strong>LONG NOTES</strong></Link>             
                    </li>
                    <li>
                        <Link href="/settings"><strong>SAVES</strong></Link>             
                    </li>
                    <li>
                        <Link href="/test"><strong>TESTS</strong></Link>             
                    </li>
                </ul>
            </aside> 
    )
}