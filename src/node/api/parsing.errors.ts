import { AuthorizationError, InvalidRequestError } from "./models.errors"

export const handleRouteError = (error: unknown) => {
	
    // lets work with the error as an object
	const processedError = error as any;

	// need to know the type of error to handle it properly
	const errorType = processedError.constructor;

	// switch on the error type as we know how to handle our errors
	switch (errorType) {
		case InvalidRequestError:
			return { message: processedError.message, status: 400 };
        case AuthorizationError:
            return { message: processedError.message, status: 401 };
		default:
			return { message: processedError.message, status: 500 }; // default status code for server errors
	}
};


/**
 * Extract message from exception error (try-catch)
 * @param error error from catch block as any
 * @returns 
 */
 export const messageFromError = (error: any) => error["message"] as string
