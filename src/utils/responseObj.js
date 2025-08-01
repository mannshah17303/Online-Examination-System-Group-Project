export const responseObj = (success, statusCode, message, data) => {
    return {
        success: success,
        status: statusCode,
        message: message,
        data: data
    }
}