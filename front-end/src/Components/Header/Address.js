import React from 'react'

function Address(props) {
    return (
        <div className="bg-Subtle-Background font-Hanseif text-3xl pt-24 pb-24 shadow-md pl-10">
            <p className="border-b-2 max-w-max">{props.address}</p>
        </div>
    )
}

export default Address
