/**
 * Compare two dates.
 * @param {*} a the first date
 * @param {*} b the second date
 * @returns a negative integer if a > b, a positive integer if a < b, or 0 if a = b
 */
export function compareVerifiedNamesByCreatedDate(a, b) {
  const aTimeSinceEpoch = new Date(a.created).getTime();
  const bTimeSinceEpoch = new Date(b.created).getTime();
  return bTimeSinceEpoch - aTimeSinceEpoch;
}

/**
 *
 * @param {*} verifiedNames a list of verified name objects, where each object has at least the
 *                          following keys: created, status, and verified_name.
 * @returns the most recent verified name object from the list parameter with the 'pending' or
 *          'accepted' status, if one exists; otherwise, null
 */
export function getMostRecentApprovedOrPendingVerifiedName(verifiedNames) {
  // clone array so as not to modify original array
  const names = [...verifiedNames];

  if (Array.isArray(names)) {
    names.sort(compareVerifiedNamesByCreatedDate);
  }

  // We only want to consider a subset of verified names when determining the value of nameOnAccount.
  // approved: consider this status, as the name has been verified by IDV and should supersede the full name
  //           (profile name).
  // pending: consider this status, as the learner has started the name change process through the
  //          Account Settings page, and has been navigated to IDV to complete the name change process.
  // submitted: do not consider this status, as the name has already been submitted for verification through
  //            IDV but has not yet been verified
  // denied: do not consider this status because the name was already denied via the IDV process
  const applicableNames = names.filter(name => ['approved', 'pending'].includes(name.status));
  const applicableName = applicableNames.length > 0 ? applicableNames[0].verified_name : null;

  return applicableName;
}
import camelCase from 'lodash.camelcase';
import snakeCase from 'lodash.snakecase';

export function modifyObjectKeys(object, modify) {
  // If the passed in object is not an object, return it.
  if (
    object === undefined
    || object === null
    || (typeof object !== 'object' && !Array.isArray(object))
  ) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(value => modifyObjectKeys(value, modify));
  }

  // Otherwise, process all its keys.
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    result[modify(key)] = modifyObjectKeys(value, modify);
  });
  return result;
}

export function camelCaseObject(object) {
  return modifyObjectKeys(object, camelCase);
}

export function snakeCaseObject(object) {
  return modifyObjectKeys(object, snakeCase);
}

export function convertKeyNames(object, nameMap) {
  const transformer = key => (nameMap[key] === undefined ? key : nameMap[key]);

  return modifyObjectKeys(object, transformer);
}

/**
 * Helper class to save time when writing out action types for asynchronous methods.  Also helps
 * ensure that actions are namespaced.
 *
 * TODO: Put somewhere common to it can be used by other MFEs.
 */
export class AsyncActionType {
  constructor(topic, name) {
    this.topic = topic;
    this.name = name;
  }

  get BASE() {
    return `${this.topic}__${this.name}`;
  }

  get BEGIN() {
    return `${this.topic}__${this.name}__BEGIN`;
  }

  get SUCCESS() {
    return `${this.topic}__${this.name}__SUCCESS`;
  }

  get FAILURE() {
    return `${this.topic}__${this.name}__FAILURE`;
  }

  get RESET() {
    return `${this.topic}__${this.name}__RESET`;
  }
}

