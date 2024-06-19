import React, { useEffect, useState } from 'react';
import avatar from './assets/avatar.svg';
import { getAccount, formatDateJoined } from './data/services.js';

function ProfileUser({ value }) {
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        if (value) {  // Ensure value is not empty
            const fetchAccountData = async () => {
                try {
                    const data = await getAccount(value);
                    setAccountData(data);
                    console.log(data);
                } catch (error) {
                    console.error('Error fetching account data:', error);
                }
            };
            fetchAccountData();
        }
    }, [value]);

    if (!value) {
        return null;
    }

    return (
        <div className='tw-flex tw-items-center tw-pl-[20px] tw-mb-[40px] sticky'>

            {accountData && (
                <>
                    <img src={accountData.profileImage.hasImage ? accountData.profileImage.imageUrlFull : avatar} className='tw-h-[70px] tw-rounded-full' alt='Avatar' />
                    <h3 className='tw-font-medium tw-text-[24px] tw-leading-[31.68px] tw-ml-[5px]'>{accountData.username}</h3>
                </>
            )}
        </div>
    );
}

export default ProfileUser;
