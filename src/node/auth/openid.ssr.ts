import * as openid from 'openid-client';
import { Unsure } from '../../index.browser';
import { SSROnlyError } from '../api/models.errors';
import { messageFromError } from '../api/parsing.errors';


/**
 * OpenID Connect functional context (as server side JS closure)
 * @returns Set of functions to handle OpenID (OAuth2) operations using official openid library with server side environments
 */
export const ssrOpenidContext = (clientId: string, issuerUrl: string, redirectUrl: string) => {

	/**
	 * Creates the active client for OpenID operations
	 * @returns OpenID set up client ready to be used
	 */
	async function oidSetupIssuerConfiguration() {
		try {

			console.log('OIDC Setup Issuer Configuration:', { clientId, issuerUrl, redirectUrl });

			if (!issuerUrl)
				throw new SSROnlyError('OIDC ENV: Missing OID issuer URL');

			if (!clientId)
				throw new SSROnlyError('OIDC ENV: Missing OID client ID');

			if (!redirectUrl)
				throw new SSROnlyError('OIDC ENV: Missing OID redirect url back to this app (OAuth2 callback path)');

			// prepare Open ID Issuer client
			const url = new URL(issuerUrl)

			console.log('OIDC Discovering from URL:', url.toString());

			const config = await openid.discovery(url, clientId);

			console.log('OIDC Config Complete:', config);

			// return configuration
			return config;
		} catch (error: unknown) {
			console.error('OIDC Setup Error:', error);
			console.error('OIDC Setup Error Message:', messageFromError(error));
			console.error('OIDC Setup Error Stack:', (error instanceof Error) ? error.stack : 'no stack');
			console.error('OIDC Setup Error Type:', (error instanceof Error) ? error.cause : 'no cause');
			throw new SSROnlyError(`OIDC Config Setup: Failed to setup OID client: ${messageFromError(error)}`);
		}
	}

	async function handleUserOpenID() {
		try {

			console.log('OIDC Handle User OpenID');

			// get issuer configuration
			const oidConfig = await oidSetupIssuerConfiguration();

			// prepare parameters for authorisation URL
			// TODO: state, nonce, PKCE
			const parameters: Record<string, string> = {
				redirect_uri: redirectUrl,
				scope: 'openid email'
			}

			console.log('OIDC Build Authorization URL:', parameters);
			const url = openid.buildAuthorizationUrl(oidConfig, parameters)

			console.log('OIDC Auth URL:', url.toString());

			return url;
		} catch (error: unknown) {
			throw new SSROnlyError(`OIDC Build Authorization: Failed to build authorisation URL: ${messageFromError(error)}`);
		}
	}

	async function handleAuthCallback(params: any, tokenExchangeUrl: Unsure<string>) {

		const oidConfig = await oidSetupIssuerConfiguration();

		const tokens = await openid.authorizationCodeGrant(oidConfig, new URL(redirectUrl), { idTokenExpected: true });

		// do we have tokens and all values?
		if (!tokens.access_token)
			throw new SSROnlyError('Missing OID information');
		if (!tokens.refresh_token)
			throw new SSROnlyError('Missing OID information');
		if (!tokens.id_token)
			throw new SSROnlyError('Missing OID information');
		if (!tokens.refresh_token)
			throw new SSROnlyError('Missing OID information');
		if (!clientId)
			throw new SSROnlyError('Missing client ID');
		if (!tokenExchangeUrl)
			throw new SSROnlyError('Missing URL for excgange');
		if (!issuerUrl)
			throw new SSROnlyError('Missing issuer URL');

		// prepare output for route
		return {
			tokens: {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				id_token: tokens.id_token,
			},
			clientId,
			issuerUrl,
			tokenExchangeUrl,
		};
	}

	async function handleLogout(tokenExchangeUrl: Unsure<string>) {
		if (!tokenExchangeUrl)
			throw new SSROnlyError('Missing URL for exchange');

		return { tokenExchangeUrl };
	}

	return {
		handleAuthCode: handleUserOpenID,
		handleAuthCallback,
		handleLogout,
	};
}
