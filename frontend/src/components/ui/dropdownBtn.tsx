import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from 'lucide-react'
import i18next from 'i18next'
import { changeLanguage } from '@/i18n'

function DropdownBtn({ i18n }: { i18n: typeof i18next }) {

    const handleLanguageChange = (lang: string) => {
        changeLanguage(lang)
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none focus-visible:outline-none'>
                <Globe color='var(--text-primaryGray)' className='cursor-pointer' size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className='text-sm'>Idioma</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleLanguageChange('pt')}>Português</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownBtn