# Swapping the mock for real auth

Everything that renders or routes stays as it is, and so does the store contract (`selectIsSignedIn`, `setSession`, `clearSession`). The work stays inside `src/features/auth` (api bodies, a DTO and mapper, deleting the mock) plus, for an SDK, `src/config/sdks` and a `src/shared/lib/<sdk>` wrapper.

## What is mocked today

| File | Role |
| --- | --- |
| `features/auth/utils/session/mock-auth.ts` | The fake backend: 700 ms latency, any email + 6-char password signs in; `error@example.com` fails, `taken@example.com` is already registered on sign up. **The only mock file.** |
| `features/auth/api/session/sign-in.api.ts` | `signIn(input): Promise<Session>`, calls `mockSignIn` |
| `features/auth/api/session/sign-up.api.ts` | `signUp(input): Promise<Session>`, calls `mockSignUp` |
| `features/auth/api/session/sign-out.api.ts` | `signOut(): Promise<void>`, calls `mockSignOut` |

Everything else is production code: the session types, the store and its storage, the mutations, `useConfirmSignOut`, validation, `config/http.ts` (token + 401), `config/auth.ts` (cleanup), the navigators and the screens.

## 1. Token-based backend (REST)

1. Add the wire type and mapper: `features/auth/types/session/session.types.ts` gets `SessionDto` (exactly what the API returns); `features/auth/types/session/session.mappers.ts` exports `toSession(dto): Session`.
2. Replace the three api bodies (the `REAL AUTH:` comment in each file shows the call):
   ```ts
   export async function signIn(input: SignInInput): Promise<Session> {
     try {
       const dto = await http.post<SessionDto>('/auth/sign-in', { body: input });
       return toSession(dto);
     } catch (error) {
       if (error instanceof HttpError && error.status === 401) throw new AuthError('invalidCredentials');
       throw error;
     }
   }
   ```
   Map the backend's "wrong credentials" and "email taken" responses to `AuthError` codes so the screens keep showing translated messages; any other error falls back to the generic message.
3. Delete `mock-auth.ts`. Move `PASSWORD_MIN_LENGTH` to the backend's rule if it differs.
4. Nothing else changes: `setSession` stores the token in SecureStore, `config/http.ts` attaches it as `Authorization: Bearer`, and a 401 anywhere signs the user out.

**Refresh tokens.** Store the refresh token as another secret: add `authRefreshToken` to `STORAGE_KEYS` and `SECRET_KEYS`, write it in `session.storage.ts`. Refresh in the http layer: extend `HttpConfig` (`shared/lib/http/http.types.ts`) with a `refreshToken` hook that `client.ts` calls once on a 401 before giving up, and wire it in `config/http.ts`. Call `clearSession()` only when the refresh fails.

**Current user.** If the user must come from `GET /me` instead of the sign-in response, keep `Session.user` as the cached copy (it renders instantly on launch) and add a `useMeQuery` in `features/auth/queries/user/` that updates it.

## 2. Auth SDK (Firebase, Supabase, Clerk, Cognito...)

1. Install with `bunx expo install`, initialise it in `src/config/sdks/` and expose it through a `src/shared/lib/<sdk>/<sdk>.ts` wrapper (see `src/config/sdks/README.md`). Register it in `criticalInitializers` only if its init is synchronous and the first screen needs it; if its init or session restore is async, keep it deferred and follow section 3.
2. The api functions call the SDK through the wrapper (`signInWithPassword`, `createUser`, `signOut`) and return a `Session` built from the SDK's user and token (map it in `features/auth/types/session/session.mappers.ts`).
3. Mirror the SDK's auth listener into the store. Keep the mapping in the feature: add an action such as `syncFromSdk(sdkSession: SdkSession | null)` to `session.store.ts` that maps and calls `setSession` / `clearSession`, and subscribe once in `src/config/auth.ts` (config may import feature stores, not mappers):
   ```ts
   authSdk.onAuthStateChange((sdkSession) => useSessionStore.getState().syncFromSdk(sdkSession));
   ```
   The SDK becomes the source of truth; the store mirrors it, and navigation keeps reading `selectIsSignedIn`.
4. If the SDK stores its own session, decide which copy is used on launch: keep the synchronous store seed (the listener reconciles it moments later), or, if the SDK's async restore must be the source of truth, follow section 3.

## 3. Async session restore (only if needed)

The current design needs no splash handling because storage is synchronous. If restoring becomes async (token refresh on launch, an SDK that restores asynchronously):

1. Add `'restoring'` to `SessionStatus` and start the store in that state.
2. `RootNavigator` needs no change: `selectIsSignedIn` is false while restoring, so `(auth)` is mounted behind the splash, and the guard flips to `(app)` if the restore finds a session. Never render `null` instead of the root Stack, and never make both guards false (only `+not-found` would remain).
3. Add a small controller, rendered once next to `RootNavigator`, that owns the splash:
   ```ts
   import * as SplashScreen from 'expo-splash-screen';
   void SplashScreen.preventAutoHideAsync(); // module scope: Expo Router no longer hides it by itself

   export function SplashScreenController() {
     const status = useSessionStore((state) => state.status);
     useEffect(() => {
       if (status !== 'restoring') SplashScreen.hide();
     }, [status]);
     return null;
   }
   ```
4. Keep the restore under ~1 s, or show a branded screen instead of holding the splash.

## Checklist

- [ ] The three api functions call the real backend; `mock-auth.ts` is deleted.
- [ ] Backend error responses map to `AuthError` codes; the strings in `features/auth/i18n` match the backend's rules.
- [ ] `selectIsSignedIn`, `setSession`, `clearSession` keep their meaning.
- [ ] Per-user cleanup (analytics, push tokens) is added to `src/config/auth.ts`.
- [ ] The server authorises every request (client-side guards only hide UI).
- [ ] Remove the mock hints from `auth:signIn.subtitle` and `auth:signUp.subtitle`.
- [ ] `bunx tsc --noEmit`, `bunx expo lint`, and the manual flows in `SKILL.md` "Done criteria".
