import { MoveLeft } from 'lucide-react'
import image from '../assets/monitor.png'

export default function NotFound() {
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <img src={image} alt="monitor" className='opacity-50 w-1/4' />
            <h1 className="text-3xl font-bold opacity-50">404 Not Found</h1>
            <a href="/" className='font-semibold hover:underline opacity-80 flex items-center justify-center gap-1'><MoveLeft className='h-4 w-4' /> Back Home</a>
        </div>
    )
}