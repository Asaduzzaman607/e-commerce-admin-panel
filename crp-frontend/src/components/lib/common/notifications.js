import {notification} from "antd";

export const getErrorMessages = (errors) => {
    try {
        if (!errors || !errors.response || !errors.response.data || !Array.isArray(errors.response.data.errors)) {
            return [];
        }
        const errorMessages = errors.response.data.errors.map((error) => {
            const description = error.msg.description;
            if (typeof description === 'string') {
                const modifiedDescription = description?.replace(/^name\b/, 'user name');
                return modifiedDescription;
            } else {
                return 'Unknown Error';
            }
        });
        return errorMessages;
    } catch (e) {
        console.error(e);
    }
    return ['Something Went Wrong!'];
};

export function notifyError(messages) {
    messages?.forEach((message) => {
        notification['error']({ message });
    });
}

export function notifyResponseError(error) {
    const errorMessages = getErrorMessages(error);
    notifyError(errorMessages);
}

export function notifySuccess(message) {
    notification['success']({message})
}

// export function notifyError(message) {
//     notification['error']({message})
// }
//
// export function notifyResponseError(error) {
//     notifyError(getErrorMessage(error))
// }

export function notifyWarning(message) {
    notification['warning']({message})
}

export function notifyInfo(message) {
    notification['info']({message})
}