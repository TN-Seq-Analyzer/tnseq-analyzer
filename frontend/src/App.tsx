import React from 'react'
import Header from './components/Header'
import SectionContent from './components/section-content/SectionContent'

function App() {
    return (
        <>
            <div className='flex flex-col w-full min-h-screen'>
                <Header />
                <SectionContent />
            </div>
        </>
    )
}

export default App