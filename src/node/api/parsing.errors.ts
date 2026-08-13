import { AuthorizationError, InvalidRequestError } from "./models.errors"

/**
 * Map an error object to an HTTP response with status code and message.
 * Known error types are mapped to specific status codes:
 * - InvalidRequestError -> 400
 * - AuthorizationError -> 401
 * - All other errors -> 500
 *
 * @param error - The error object from a catch block.
 * @returns Object with message string and HTTP status code.
 */
export const handleRouteError = (error: unknown) => {

    // Cast error to object for property access
	const processedError = error as any;

	// Determine error type by constructor for custom handling
	const errorType = processedError.constructor;

	// Map known error types to appropriate HTTP status codes
	switch (errorType) {
		case InvalidRequestError:
			return { message: processedError.message, status: 400 };
        case AuthorizationError:
            return { message: processedError.message, status: 401 };
		default:
			return { message: processedError.message, status: 500 };
	}
};


/**
 * Extract the message property from an error object.
 * Useful for safely retrieving error messages in catch blocks.
 *
 * @param error - Error object from a catch block.
 * @returns The error message as a string.
 */
 export const messageFromError = (error: any) => error["message"] as string
