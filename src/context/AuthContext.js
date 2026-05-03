import { createContext } from 'react';

/**
 * @module Contexts
 */

/**
 * AuthContext provides the current authenticated user and authentication-related functions.
 *
 * @type {React.Context}
 */
const AuthContext = createContext();

export default AuthContext;
