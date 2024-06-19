import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { breakpoints, useWindowSize, Icon } from '@edx/paragon';
import { OpenInNew } from '@edx/paragon/icons';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';
import { Link } from 'react-router-dom';
import messages from './AccountSettingsPage.messages';
import { selectShowPreferences } from '../notification-preferences/data/selectors';

const JumpNav = ({
  intl,
  displayDemographicsLink,
}) => {
  const stickToTop = useWindowSize().width > breakpoints.small.minWidth;
  const showPreferences = useSelector(selectShowPreferences());

  return (
    <div className={classNames('jump-nav', { 'jump-nav-sm position-sticky pt-3': stickToTop })}>
      <Scrollspy
        items={[
          'basic-information',
          'profile-information',
          'demographics-information',
          'social-media',
          'site-preferences',
          'linked-accounts',
          'delete-account',
        ]}
        className="list-unstyled"
        currentClassName="button-primary button-lg tw-text-white"
      >
        <li>
          <NavHashLink to="#basic-information" className="tw-pl-[24px]">
            {intl.formatMessage(messages['account.settings.section.account.information'])}
          </NavHashLink>
        </li>
        <li>
        </li>
        {getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && displayDemographicsLink
          && (
            <li>
              <NavHashLink to="#demographics-information" className="tw-pl-[24px]">
                {intl.formatMessage(messages['account.settings.section.demographics.information'])}
              </NavHashLink>
            </li>
          )}
        <li>
          <NavHashLink to="#social-media" className="tw-pl-[24px]">
            {intl.formatMessage(messages['account.settings.section.social.media'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#site-preferences" className="tw-pl-[24px]">
            {intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#linked-accounts" className="tw-pl-[24px]">
            {intl.formatMessage(messages['account.settings.section.linked.accounts'])}
          </NavHashLink>
        </li>
        {getConfig().ENABLE_ACCOUNT_DELETION
          && (
            <li>
              <NavHashLink to="#delete-account" className="tw-pl-[24px]">
                {intl.formatMessage(messages['account.settings.jump.nav.delete.account'])}
              </NavHashLink>
            </li>
          )}
      </Scrollspy>
      {showPreferences && (
        <>
          <hr />
          <Scrollspy
            className="list-unstyled"
          >
            <li>
              <Link to="/notifications" target="_blank" rel="noopener noreferrer">
                <span>{intl.formatMessage(messages['notification.preferences.notifications.label'])}</span>
                <Icon className="d-inline-block align-bottom ml-1" src={OpenInNew} />
              </Link>
            </li>
          </Scrollspy>
        </>
      )}
    </div>
  );
};

JumpNav.propTypes = {
  intl: intlShape.isRequired,
  displayDemographicsLink: PropTypes.bool.isRequired,
};

export default injectIntl(JumpNav);
