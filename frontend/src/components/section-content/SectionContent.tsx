import { useTranslation } from "react-i18next"
import DropdownBtn from "../ui/dropdownBtn"

function SectionContent() {
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'content.home' })

    return (
        <div className='flex w-full flex-1'>
            <aside className='
            flex w-25/100 lg:w-2/10 border-r-[1px] border-[var(--color-divider)]
            p-4 lg:px-10 lg:py-7'>

            </aside>
            <main className='flex flex-1 bg-[var(--bg-main)] px-8 py-8 lg:pl-10 lg:py-12'>
                <div>
                    <h1 className='text-2xl font-bold mb-4'>{t('title')}</h1>
                    <p className='mb-6'>{t('description')}</p>
                    <p className='mt-4'>{t('instructions')}</p>
                </div>
            </main>
        </div>
    )
}

export default SectionContent