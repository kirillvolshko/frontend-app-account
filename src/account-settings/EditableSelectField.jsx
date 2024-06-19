import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Button, Form, StatefulButton,
} from '@edx/paragon';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SwitchContent from './SwitchContent';
import messages from './AccountSettingsPage.messages';
import polygon from './assets/polygon2.svg'
import {
  openForm,
  closeForm,
} from './data/actions';
import { editableFieldSelector } from './data/selectors';
import CertificatePreference from './certificate-preference/CertificatePreference';

const EditableSelectField = (props) => {
  const {
    name,
    label,
    emptyLabel,
    type,
    value,
    userSuppliedValue,
    options,
    saveState,
    error,
    confirmationMessageDefinition,
    confirmationValue,
    helpText,
    onEdit,
    onCancel,
    onSubmit,
    onChange: handleChange,
    isEditing,
    isEditable,
    isGrayedOut,
    intl,
    ...others
  } = props;
  const id = `field-${name}`;
  const [currentValue, setCurrentValue] = useState(value);

  const handleSubmit = (newValue) => {
    onSubmit(name, newValue);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
    handleChange(name, newValue);
    handleSubmit(newValue); // Automatically submit the form on change
  };

  const handleEdit = () => {
    onEdit(name);
  };

  const handleCancel = () => {
    onCancel(name);
  };

  const renderEmptyLabel = () => {
    if (isEditable) {
      return <Button variant="link" onClick={handleEdit} className="p-0">{emptyLabel}</Button>;
    }
    return <span className="text-muted">{emptyLabel}</span>;
  };

  const renderValue = (rawValue) => {
    if (!rawValue) {
      return renderEmptyLabel();
    }
    let finalValue = rawValue;

    if (options) {
      const selectedOption = options.find(option => option.value == rawValue);
      if (selectedOption) {
        finalValue = selectedOption.label;
      }
    }

    if (userSuppliedValue) {
      finalValue += `: ${userSuppliedValue}`;
    }

    return finalValue;
  };

  const renderConfirmationMessage = () => {
    if (!confirmationMessageDefinition || !confirmationValue) {
      return null;
    }
    return intl.formatMessage(confirmationMessageDefinition, {
      value: confirmationValue,
    });
  };

  const selectOptions = options.map((option) => {
    if (option.group) {
      return (
        <optgroup label={option.label} key={option.label}>
          {option.group.map((subOption) => (
            <option
              value={subOption.value}
              key={`${subOption.value}-${subOption.label}`}

            >
              {subOption.label}
            </option>
          ))}
        </optgroup>
      );
    }
    return (
      <option value={option.value} key={`${option.value}-${option.label}`} >
        {option.label}
      </option>
    );
  });

  return (
    <SwitchContent
      expression={isEditing ? 'editing' : 'default'}
      cases={{
        default: (
          <>
            <form>
              <Form.Group controlId={id} isInvalid={error != null}>
                <Form.Label className="h6 d-block" htmlFor={id}>{label}</Form.Label>
                <Form.Control
                  data-hj-suppress
                  name={name}
                  id={id}
                  type={type}
                  as={type}
                  value={currentValue}
                  onChange={handleInputChange}  // Use handleInputChange

                  {...others}
                >

                  {options.length > 0 && selectOptions}
                </Form.Control>
                {!!helpText && <Form.Text>{helpText}</Form.Text>}
                {error != null && <Form.Control.Feedback>{error}</Form.Control.Feedback>}
                {others.children}
              </Form.Group>
            </form>
            {['name', 'verified_name'].includes(name) && <CertificatePreference fieldName={name} />}
          </>
        )
      }}
    />
  );
};

EditableSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  emptyLabel: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userSuppliedValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  saveState: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  error: PropTypes.string,
  confirmationMessageDefinition: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  confirmationValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.node,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  isEditable: PropTypes.bool,
  isGrayedOut: PropTypes.bool,
  intl: intlShape.isRequired,
};

EditableSelectField.defaultProps = {
  value: undefined,
  options: [],
  saveState: undefined,
  label: undefined,
  emptyLabel: undefined,
  error: undefined,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
  isGrayedOut: false,
  userSuppliedValue: undefined,
};

export default connect(editableFieldSelector, {
  onEdit: openForm,
  onCancel: closeForm,
})(injectIntl(EditableSelectField));