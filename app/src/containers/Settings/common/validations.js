import i18n from 'lib/i18n';

export const required = (value) => {
    return !!value ? undefined : i18n._('This field is required.');
};
