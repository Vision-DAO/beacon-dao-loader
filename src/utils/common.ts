/**
 * Users are redirected here when they have no active extension.
 */
export const METAMASK_SITE = "https://metamask.io/";

export const ERR_NO_TEMPLATES = "Client does not support HTML templates.";

/**
 * Encodes a JavaScript string to a byte array.
 */
export const toBytes = (s: string): Uint8Array => {
	const encoder = new TextEncoder();
	return encoder.encode(s);
};

export const fromBytes = (b: Uint8Array): string => {
	const decoder = new TextDecoder();
	return decoder.decode(b);
};

/**
 * Converts eval-able JS code into a URL blob.
 */
export const blobifyEval = (src: string): string =>
	"data:text/javascript;charset=utf-8," + encodeURIComponent(src);
