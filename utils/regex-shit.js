export function isPhoneValid(phoneNumber) {
    var digits = phoneNumber.replace(/\D/g, ''); // remove all non-digit characters
    return /^\+\d+$/.test('+' + digits); // check if the resulting string matches the valid format
}
export const isEmailValid = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
export function formatPhoneNumber(phoneNumber) {
    var digits = phoneNumber.replace(/\D/g, '');
    if (digits.length === 11 && digits.charAt(0) === '1') {
        return '+' + digits;
    }
    return '+' + digits;
}