import Logo from './logo'
import DropdownBtn from './ui/dropdownBtn'
import { useTranslation } from 'react-i18next'

function Header() {
    const { t } = useTranslation('translation', { keyPrefix: 'header.link' })
    return (
        <div className='
        flex justify-between items-center h-12 lg:h-16 px-4 lg:px-10 
        w-full border-b-[1px] border-[var(--color-divider)]
        select-none'>
            <Logo />
            <div className='flex gap-4 lg:gap-4 items-center'>
                {/* as tags "p" vao virar rotas posteriormente */}
                <DropdownBtn />
                <p className='text-xs text-[var(--text-primaryGray)] font-poppins font-semibold cursor-pointer'>{t('help')}</p>
                <p className='text-xs text-[var(--text-primaryGray)] font-poppins font-semibold cursor-pointer'>{t('about')}</p>

            </div>
        </div>
    )
}

export default Header