import * as openid from 'openid-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ssrOpenidContext } from '../../src/node/auth/openid.ssr';

vi.mock('openid-client', () => ({
	discovery: vi.fn(),
	buildAuthorizationUrl: vi.fn(),
	authorizationCodeGrant: vi.fn(),
	randomPKCECodeVerifier: vi.fn(),
	calculatePKCECodeChallenge: vi.fn(),
	randomState: vi.fn(),
	randomNonce: vi.fn(),
}));

describe('ssrOpenidContext', () => {
	const mockConfig = { issuer: 'https://issuer.example' } as unknown as openid.Configuration;

	beforeEach(() => {
		vi.resetAllMocks();

		vi.mocked(openid.discovery).mockResolvedValue(mockConfig);
		vi.mocked(openid.randomPKCECodeVerifier).mockReturnValue('pkce-verifier');
		vi.mocked(openid.calculatePKCECodeChallenge).mockResolvedValue('pkce-challenge');
		vi.mocked(openid.randomState).mockReturnValue('state-123');
		vi.mocked(openid.randomNonce).mockReturnValue('nonce-123');
		vi.mocked(openid.buildAuthorizationUrl).mockImplementation((_, parameters) => {
			const url = new URL('https://issuer.example/authorize');
			const mapped = parameters as Record<string, string>;
			for (const [key, value] of Object.entries(mapped))
				url.searchParams.set(key, value);
			return url;
		});
		vi.mocked(openid.authorizationCodeGrant).mockResolvedValue({
			access_token: 'access',
			refresh_token: 'refresh',
			id_token: 'id',
		} as openid.TokenEndpointResponse & openid.TokenEndpointResponseHelpers);
	});

	it('builds auth URL with PKCE/state/nonce in handleAuthCode', async () => {
		const context = ssrOpenidContext(
			'client-1',
			'https://issuer.example',
			'https://app.example/auth/callback'
		);

		const result = await context.handleAuthCode();

		expect(result.authorizationUrl.toString()).toContain('https://issuer.example/authorize');
		expect(result.checks).toEqual({
			pkceCodeVerifier: 'pkce-verifier',
			state: 'state-123',
			nonce: 'nonce-123',
		});
		expect(vi.mocked(openid.buildAuthorizationUrl)).toHaveBeenCalledWith(
			mockConfig,
			expect.objectContaining({
				redirect_uri: 'https://app.example/auth/callback',
				scope: 'openid email',
				code_challenge: 'pkce-challenge',
				code_challenge_method: 'S256',
				state: 'state-123',
				nonce: 'nonce-123',
			})
		);
	});

	it('uses callback currentUrl and expected checks in authorizationCodeGrant', async () => {
		const context = ssrOpenidContext(
			'client-1',
			'https://issuer.example',
			'https://app.example/auth/callback'
		);

		const output = await context.handleAuthCallback(
			{
				currentUrl: 'https://app.example/auth/callback?code=abc&state=state-123',
				pkceCodeVerifier: 'pkce-verifier',
				expectedState: 'state-123',
				expectedNonce: 'nonce-123',
			},
			'https://identity.example/oid/token-exchange'
		);

		expect(vi.mocked(openid.authorizationCodeGrant)).toHaveBeenCalledTimes(1);
		const grantCall = vi.mocked(openid.authorizationCodeGrant).mock.calls[0];
		const callbackUrl = grantCall[1] as URL;
		const checks = grantCall[2] as openid.AuthorizationCodeGrantChecks;

		expect(callbackUrl.toString()).toBe('https://app.example/auth/callback?code=abc&state=state-123');
		expect(checks).toEqual({
			idTokenExpected: true,
			pkceCodeVerifier: 'pkce-verifier',
			expectedState: 'state-123',
			expectedNonce: 'nonce-123',
		});
		expect(output.tokens.id_token).toBe('id');
		expect(output.tokenExchangeUrl).toBe('https://identity.example/oid/token-exchange');
	});

	it('builds callback URL from query object when currentUrl is not provided', async () => {
		const context = ssrOpenidContext(
			'client-1',
			'https://issuer.example',
			'https://app.example/auth/callback'
		);

		await context.handleAuthCallback(
			{
				query: { code: 'query-code', state: 'query-state' },
				pkceCodeVerifier: 'pkce-verifier',
				expectedState: 'query-state',
			},
			'https://identity.example/oid/token-exchange'
		);

		const grantCall = vi.mocked(openid.authorizationCodeGrant).mock.calls[0];
		const callbackUrl = grantCall[1] as URL;

		expect(callbackUrl.toString()).toBe('https://app.example/auth/callback?code=query-code&state=query-state');
	});

	it('passes optional client secret to discovery', async () => {
		const context = ssrOpenidContext(
			'client-1',
			'https://issuer.example',
			'https://app.example/auth/callback',
			'client-secret-1'
		);

		await context.handleAuthCode();

		expect(vi.mocked(openid.discovery)).toHaveBeenCalledTimes(1);
		const call = vi.mocked(openid.discovery).mock.calls[0];
		expect((call[0] as URL).toString()).toBe('https://issuer.example/');
		expect(call[1]).toBe('client-1');
		expect(call[2]).toBe('client-secret-1');
	});
});
