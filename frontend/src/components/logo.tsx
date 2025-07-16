import React from 'react'

function Logo() {
    return (
        <>
            <div className='flex gap-1.5 items-center'>

                <div>
                    <img src='/icon-dna.svg' draggable="false" width={20} height={20} />
                </div>
                <h1 className='font-poppins font-bold text-base'>Tn-Seq Analyzer</h1>
            </div>
        </>
    )
}

export default Logo