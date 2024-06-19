import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient as getHttpClient } from '@edx/frontend-platform/auth';
import { camelCaseObject, convertKeyNames, snakeCaseObject } from '../../utils';
import { formatDistanceToNow, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
ensureConfig(['LMS_BASE_URL'], 'Profile API service');

function processAccountData(data) {
    return camelCaseObject(data);
}



// GET ACCOUNT
export async function getAccount(username) {
    const { data } = await getHttpClient().get(`${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${username}`);

    // Process response data
    return processAccountData(data);
}
export const formatDateJoined = (dateJoined) => {
    const joinedDate = new Date(dateJoined);
    const now = new Date();

    const yearsDifference = differenceInYears(now, joinedDate);
    if (yearsDifference >= 1) {
        return `${yearsDifference} ${yearsDifference === 1 ? 'рік' : 'років'} з Prometheus`;
    }

    const monthsDifference = differenceInMonths(now, joinedDate);
    if (monthsDifference >= 1) {
        return `${monthsDifference} ${monthsDifference === 1 ? 'місяць' : 'місяців'} з Prometheus`;
    }

    const daysDifference = differenceInDays(now, joinedDate);
    return `${daysDifference} ${daysDifference === 1 ? 'день' : 'днів'} з Prometheus`;
};

