import React from 'react'
import { content } from './DistributionData'
function Distribution() {
    return (
        <div className='borderStyles'>
            {content.map((items) => (
                <div className='borderInput'>
                    <input type="checkbox" />
                    <p>{items.content}</p>
                </div>
            ))}
        </div>
    )
}

export default Distribution