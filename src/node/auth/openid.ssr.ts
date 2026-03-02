import * as openid from 'openid-client';

export interface AuthCodeCheckValues {
  pkceCodeVerifier: string;
  state: string;
  nonce: string;
}

export interface AuthCodeHandleResult {
  authorizationUrl: URL;
  checks: AuthCodeCheckValues;
}

export interface AuthCallbackInput {
  currentUrl?: string;
  query?: Record<string, string | string[]>;
  pkceCodeVerifier: string;
  expectedState: string;
  expectedNonce?: string;
}

export interface AuthCallbackResult {
  tokens: openid.TokenEndpointResponse & openid.TokenEndpointResponseHelpers;
  tokenExchangeUrl: string;
}

/**
 * Creates an OpenID Connect context for server-side rendering (SSR) flows.
 * Handles authorization code grant with PKCE, state, and nonce parameters.
 *
 * @param clientId - The OpenID Connect client ID
 * @param issuerUrl - The OpenID Connect issuer URL
 * @param callbackUrl - The callback URL for authorization code grant
 * @param clientSecret - Optional client secret for confidential clients
 */
export function ssrOpenidContext(
  clientId: string,
  issuerUrl: string,
  callbackUrl: string,
  clientSecret?: string
) {
  return {
    /**
     * Handle the initial authorization code request.
     * Generates PKCE code verifier, state, and nonce.
     */
    async handleAuthCode(): Promise<AuthCodeHandleResult> {
      const issuerUrlWithSlash = issuerUrl.endsWith('/') ? issuerUrl : `${issuerUrl}/`;
      const issuerUri = new URL(issuerUrlWithSlash);

      const config = await openid.discovery(issuerUri, clientId, clientSecret);

      const pkceCodeVerifier = openid.randomPKCECodeVerifier();
      const pkceCodeChallenge = await openid.calculatePKCECodeChallenge(pkceCodeVerifier);
      const state = openid.randomState();
      const nonce = openid.randomNonce();

      const authorizationUrl = openid.buildAuthorizationUrl(config, {
        redirect_uri: callbackUrl,
        scope: 'openid email',
        code_challenge: pkceCodeChallenge,
        code_challenge_method: 'S256',
        state,
        nonce,
      });

      return {
        authorizationUrl,
        checks: {
          pkceCodeVerifier,
          state,
          nonce,
        },
      };
    },

    /**
     * Handle the authorization callback (code and state in query parameters).
     * Exchanges the authorization code for tokens.
     *
     * @param input - Callback input with either currentUrl or query parameters
     * @param tokenExchangeUrl - The token exchange URL (e.g., for token refresh)
     */
    async handleAuthCallback(
      input: AuthCallbackInput,
      tokenExchangeUrl: string
    ): Promise<AuthCallbackResult> {
      const issuerUrlWithSlash = issuerUrl.endsWith('/') ? issuerUrl : `${issuerUrl}/`;
      const issuerUri = new URL(issuerUrlWithSlash);

      const config = await openid.discovery(issuerUri, clientId, clientSecret);

      // Build callback URL from either currentUrl or query object
      let callbackUrlObj: URL;
      if (input.currentUrl) {
        callbackUrlObj = new URL(input.currentUrl);
      } else if (input.query) {
        callbackUrlObj = new URL(callbackUrl);
        for (const [key, value] of Object.entries(input.query)) {
          const stringValue = Array.isArray(value) ? value[0] : value;
          callbackUrlObj.searchParams.set(key, stringValue);
        }
      } else {
        throw new Error('Either currentUrl or query must be provided');
      }

      const checks: openid.AuthorizationCodeGrantChecks = {
        idTokenExpected: true,
        pkceCodeVerifier: input.pkceCodeVerifier,
        expectedState: input.expectedState,
        expectedNonce: input.expectedNonce,
      };

      const tokens = await openid.authorizationCodeGrant(config, callbackUrlObj, checks);

      return {
        tokens,
        tokenExchangeUrl,
      };
    },
  };
}
