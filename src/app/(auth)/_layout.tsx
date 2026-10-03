export { AuthStackLayout as default } from '@/screens/navigation/auth/auth-stack-layout';

// A deep link to /sign-up still gets sign-in underneath, so back has somewhere to go.
export const unstable_settings = { anchor: 'sign-in' };
