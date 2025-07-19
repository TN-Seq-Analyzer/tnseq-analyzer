import Logo from './logo'
import { Globe } from 'lucide-react'

function Header() {
    return (
        <div className='
        flex justify-between items-center h-12 lg:h-16 px-4 lg:px-10 
        w-full border-b-[1px] border-[var(--color-divider)]
        select-none'>
            <Logo />
            <div className='flex gap-4 lg:gap-4 items-center'>
                {/* as tags "p" vao virar rotas posteriormente */}
                <p className='text-xs text-[var(--text-primaryGray)] font-poppins font-semibold cursor-pointer'>Ajuda</p>
                <p className='text-xs text-[var(--text-primaryGray)] font-poppins font-semibold cursor-pointer'>Sobre</p>
                <Globe color='var(--text-primaryGray)' className='cursor-pointer' size={14} />
            </div>
        </div>
    )
}

export default Header